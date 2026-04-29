import logging
from pathlib import Path

import mcp.types as types

from omniskill.skill.loader import SkillDefinition, load_skill
from omniskill.skill.executor import run_skill

log = logging.getLogger("omniskill.registry")

_RELOAD_TOOL = types.Tool(
    name="omniskill__reload_skills",
    description="Reload all skills from disk without restarting the server.",
    inputSchema={"type": "object", "properties": {}, "required": []},
)


class SkillRegistry:
    def __init__(self, skills_dirs: list[str]):
        self._dirs = [Path(d) for d in skills_dirs]
        self._skills: dict[str, SkillDefinition] = {}

    async def load(self) -> int:
        self._skills.clear()
        for skills_dir in self._dirs:
            if not skills_dir.exists():
                log.warning("skills_dir %s not found", skills_dir)
                continue
            # Recursively find all SKILL.md files
            for skill_md in skills_dir.rglob("SKILL.md"):
                candidate = skill_md.parent
                try:
                    defn = load_skill(str(candidate))
                    self._skills[defn.tool.name] = defn
                    log.info("Loaded skill: %s", defn.tool.name)
                except Exception as e:
                    log.error("Failed to load %s: %s", candidate, e)
            # Also pick up ZIP/skill packages at the top level
            for candidate in skills_dir.iterdir():
                if candidate.suffix in (".zip", ".skill"):
                    try:
                        defn = load_skill(str(candidate))
                        self._skills[defn.tool.name] = defn
                        log.info("Loaded skill: %s", defn.tool.name)
                    except Exception as e:
                        log.error("Failed to load %s: %s", candidate, e)

        log.info("Registry loaded %d skill(s)", len(self._skills))
        return len(self._skills)

    def as_mcp_tools(self) -> list[types.Tool]:
        return [_RELOAD_TOOL] + [d.tool for d in self._skills.values()]

    async def execute(self, name: str, arguments: dict) -> str:
        if name == "omniskill__reload_skills":
            count = await self.load()
            return f"Reloaded. {count} skill(s) available."

        if name not in self._skills:
            raise ValueError(f"Unknown skill: {name}")

        return await run_skill(self._skills[name], arguments)
