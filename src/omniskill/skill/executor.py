import asyncio
import json
import logging
import re
import shutil
import sys
from asyncio.subprocess import PIPE
from pathlib import Path

from omniskill.skill.loader import SkillDefinition

log = logging.getLogger("omniskill.executor")

RUNTIME_CMD: dict[str, list[str]] = {
    "python": [sys.executable],
    "node": [shutil.which("node") or "node"],
    "bash": ["bash"],
}


def _resolve_prompt_content(
    skill_dir: Path, text: str, _visited: set | None = None, _depth: int = 0, max_depth: int = 2
) -> str:
    """Replace './file.md' references in text with file content, up to max_depth levels deep."""
    if _visited is None:
        _visited = set()
    def replacer(m: re.Match) -> str:
        if _depth >= max_depth:
            return m.group(0)  # Stop expanding — leave reference as literal text
        ref_path = skill_dir / m.group(1)
        if not ref_path.exists() or str(ref_path) in _visited:
            return m.group(0)
        _visited.add(str(ref_path))
        ref_text = ref_path.read_text(encoding="utf-8")
        ref_body = re.sub(r"^---\s*\n.*?\n---\s*\n", "", ref_text, count=1, flags=re.DOTALL)
        return _resolve_prompt_content(ref_path.parent, ref_body.strip(), _visited, _depth + 1, max_depth)
    return re.sub(r"\./([^\s)\"']+\.md)", replacer, text)


_BMAD_STRIP_SECTIONS = re.compile(
    r"^##\s+(Conventions|On Activation)\b.*?(?=^##\s|\Z)",
    re.MULTILINE | re.DOTALL,
)
_BMAD_TEMPLATE_VAR = re.compile(r"\{[a-zA-Z_][a-zA-Z0-9_.]*\}")


_CONTENT_CAP = 3000  # chars — keeps persona + goal, drops multi-step workflow protocol


def _sanitise_for_llm(text: str) -> str:
    """Remove BMAD runner-only sections, unresolvable template vars, and cap length."""
    text = _BMAD_STRIP_SECTIONS.sub("", text)
    text = _BMAD_TEMPLATE_VAR.sub("[not configured]", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    text = text.strip()

    if len(text) > _CONTENT_CAP:
        # Keep everything up to and including the first heading that starts a step-file reference
        # (e.g. "## FIRST STEP"), otherwise hard-truncate at a paragraph boundary
        first_step = re.search(r"\n##\s+FIRST STEP\b", text)
        if first_step:
            text = text[:first_step.start()].strip()
        else:
            # Truncate at last paragraph break before the cap
            cutoff = text.rfind("\n\n", 0, _CONTENT_CAP)
            text = text[:cutoff if cutoff > 0 else _CONTENT_CAP].strip()

    return text


def resolve_prompt_skill_content(defn: SkillDefinition) -> str:
    """Resolve and return the full content for a prompt skill. Used by registry for pre-caching."""
    content = Path(defn.entry_abs_path).read_text(encoding="utf-8")
    body = re.sub(r"^---\s*\n.*?\n---\s*\n", "", content, count=1, flags=re.DOTALL).strip()
    skill_dir = Path(defn.skill_root)
    resolved = _resolve_prompt_content(skill_dir, body) or content.strip()
    return _sanitise_for_llm(resolved)


async def run_skill(defn: SkillDefinition, arguments: dict, _cached_content: str | None = None) -> str:
    if defn.runtime == "prompt":
        return _cached_content if _cached_content is not None else resolve_prompt_skill_content(defn)

    cmd = RUNTIME_CMD.get(defn.runtime, [sys.executable]) + [defn.entry_abs_path]
    stdin_payload = json.dumps(arguments).encode()

    try:
        proc = await asyncio.create_subprocess_exec(
            *cmd,
            stdin=PIPE,
            stdout=PIPE,
            stderr=PIPE,
            cwd=defn.skill_root,
        )
        out, err = await asyncio.wait_for(
            proc.communicate(stdin_payload), timeout=defn.timeout
        )
    except asyncio.TimeoutError:
        try:
            proc.kill()
        except Exception:
            pass
        return f"**Error:** Skill `{defn.tool.name}` timed out after {defn.timeout}s."
    except Exception as e:
        return f"**Error:** Failed to launch skill `{defn.tool.name}`: {e}"

    if err:
        log.debug("[%s stderr] %s", defn.tool.name, err.decode(errors="replace"))

    if proc.returncode != 0:
        return (
            f"**Error:** Skill `{defn.tool.name}` exited with code {proc.returncode}.\n\n"
            f"```\n{err.decode(errors='replace')}\n```"
        )

    return out.decode(errors="replace").strip()
