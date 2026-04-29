import re
import zipfile
import yaml
from dataclasses import dataclass
from pathlib import Path

import mcp.types as types

FRONTMATTER_RE = re.compile(r"^---\s*\n(.*?)\n---", re.DOTALL)


@dataclass
class SkillDefinition:
    tool: types.Tool
    entry_abs_path: str
    runtime: str
    timeout: int
    skill_root: str


def load_skill(path: str) -> SkillDefinition:
    p = Path(path)
    if p.suffix in (".zip", ".skill"):
        skill_root = _extract_zip(p)
    else:
        skill_root = str(p)

    skill_md = Path(skill_root) / "SKILL.md"
    raw = skill_md.read_text(encoding="utf-8")
    fm = _parse_frontmatter(raw)

    # Skills without an entry script are "prompt skills" — they return their
    # SKILL.md content directly for the LLM to follow (e.g. BMAD-METHOD skills).
    if fm.get("entry"):
        entry_path = str((Path(skill_root) / fm["entry"]).resolve())
        runtime = fm.get("runtime") or _infer_runtime(Path(fm["entry"]))
    else:
        entry_path = skill_md.resolve().as_posix()
        runtime = "prompt"

    timeout = int(fm.get("timeout", 30))
    input_schema = _params_to_schema(fm.get("parameters", []))

    tool = types.Tool(
        name=fm["name"],
        description=fm["description"],
        inputSchema=input_schema,
    )
    return SkillDefinition(
        tool=tool,
        entry_abs_path=entry_path,
        runtime=runtime,
        timeout=timeout,
        skill_root=skill_root,
    )


def _parse_frontmatter(text: str) -> dict:
    m = FRONTMATTER_RE.match(text)
    if not m:
        raise ValueError("SKILL.md missing YAML frontmatter (--- delimiters)")
    data = yaml.safe_load(m.group(1))
    for field in ("name", "description"):
        if not data.get(field):
            raise ValueError(f"SKILL.md missing required field: {field}")
    return data


def _params_to_schema(params: list) -> dict:
    props, required = {}, []
    for p in params:
        prop = {"type": p["type"], "description": p.get("description", "")}
        if "default" in p:
            prop["default"] = p["default"]
        props[p["name"]] = prop
        if p.get("required", False):
            required.append(p["name"])
    return {"type": "object", "properties": props, "required": required}


def _infer_runtime(entry: Path) -> str:
    return {"py": "python", "js": "node", "sh": "bash"}.get(
        entry.suffix.lstrip("."), "python"
    )


def _extract_zip(zip_path: Path) -> str:
    dest = Path("skills/_extracted") / zip_path.stem
    dest.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(zip_path) as zf:
        # Handle both flat-at-root and folder-at-root ZIP structures
        names = zf.namelist()
        has_root_folder = all(n.startswith(names[0].split("/")[0] + "/") for n in names if n)
        if has_root_folder:
            root_prefix = names[0].split("/")[0] + "/"
            for member in zf.infolist():
                rel = member.filename[len(root_prefix):]
                if not rel:
                    continue
                target = dest / rel
                if member.is_dir():
                    target.mkdir(parents=True, exist_ok=True)
                else:
                    target.parent.mkdir(parents=True, exist_ok=True)
                    target.write_bytes(zf.read(member.filename))
        else:
            zf.extractall(dest)
    return str(dest)
