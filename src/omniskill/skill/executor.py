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


def _resolve_prompt_content(skill_dir: Path, text: str, _visited: set | None = None) -> str:
    """Replace './file.md' references in text with the file's actual content."""
    if _visited is None:
        _visited = set()
    def replacer(m: re.Match) -> str:
        ref_path = skill_dir / m.group(1)
        if not ref_path.exists() or str(ref_path) in _visited:
            return m.group(0)
        _visited.add(str(ref_path))
        ref_text = ref_path.read_text(encoding="utf-8")
        ref_body = re.sub(r"^---\s*\n.*?\n---\s*\n", "", ref_text, count=1, flags=re.DOTALL)
        return _resolve_prompt_content(ref_path.parent, ref_body.strip(), _visited)
    return re.sub(r"\./([^\s)\"']+\.md)", replacer, text)


async def run_skill(defn: SkillDefinition, arguments: dict) -> str:
    if defn.runtime == "prompt":
        content = Path(defn.entry_abs_path).read_text(encoding="utf-8")
        # Strip YAML frontmatter, return only the markdown body
        body = re.sub(r"^---\s*\n.*?\n---\s*\n", "", content, count=1, flags=re.DOTALL).strip()
        skill_dir = Path(defn.skill_root)
        return _resolve_prompt_content(skill_dir, body) or content.strip()

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
