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


async def run_skill(defn: SkillDefinition, arguments: dict) -> str:
    if defn.runtime == "prompt":
        content = Path(defn.entry_abs_path).read_text(encoding="utf-8")
        # Strip YAML frontmatter, return only the markdown body
        body = re.sub(r"^---\s*\n.*?\n---\s*\n", "", content, count=1, flags=re.DOTALL)
        return body.strip() or content.strip()

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
