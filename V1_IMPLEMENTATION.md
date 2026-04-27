# OmniSkill V1 — Implementation Spec

## Scope

V1 targets LLMs that have native MCP connectors:
- **ChatGPT Web** (OpenAI) — connects via SSE over HTTP
- **Claude Code** (CLI) — connects via stdio

Gemini is out of scope for V1.

---

## Architecture (V1)

```
Client Environments          OmniSkill Bridge              Local Machine
─────────────────────        ────────────────────          ──────────────
Claude Code (CLI)   ──────▶  Stdio Transport (JSON-RPC) ──▶
                                                            Skill Translator
ChatGPT Web         ──────▶  SSE Transport               ──▶  & Registry
                             └─▶ Cloudflare/ngrok tunnel      │
                                                              ├── Skill packages (.ZIP)
                                                              ├── Local scripts (Py/JS)
                                                              └── Obsidian Vault
```

**Protocol:** JSON-RPC 2.0 over MCP. Lifecycle: Initialize → Discover (tools/list) → Call Loop (tools/call).

---

## Project Structure

```
OmniSkill/
├── pyproject.toml
├── .gitignore
├── src/omniskill/
│   ├── __init__.py
│   ├── __main__.py          # CLI: `omniskill stdio` | `omniskill sse`
│   ├── server.py            # MCP protocol handlers (shared by both transports)
│   ├── config.py            # env var + CLI arg config
│   ├── transport/
│   │   ├── stdio.py         # stdin/stdout JSON-RPC for Claude Code
│   │   └── sse.py           # SSE/HTTP for ChatGPT Web via tunnel
│   └── skill/
│       ├── loader.py        # SKILL.md parser + ZIP extractor
│       ├── registry.py      # in-memory tool registry + hot-reload
│       └── executor.py      # subprocess runner (Py/JS/bash)
├── sample_skills/hello-world/
│   ├── SKILL.md
│   └── scripts/hello.py
├── skills/                  # drop skill ZIPs or folders here
└── tests/
    ├── test_loader.py
    ├── test_executor.py
    └── test_protocol.py
```

---

## Dependencies (`pyproject.toml`)

```toml
[project]
requires-python = ">=3.10"
dependencies = [
    "mcp[cli]>=1.27.0",   # starlette, uvicorn, sse-starlette, anyio, pydantic bundled
    "pyyaml>=6.0",
    "aiofiles>=23.0",
]

[project.optional-dependencies]
dev = ["pytest>=8.0", "pytest-asyncio>=0.23", "httpx>=0.27"]

[project.scripts]
omniskill = "omniskill.__main__:main"
```

Install: `pip install -e ".[dev]"`

---

## Phase 1 — Core MCP Server + Stdio Transport

### Critical invariant
All debug/log output → `stderr`. `stdout` is the JSON-RPC stream — any non-JSON byte corrupts it.
Windows guard in `__main__.py` (prevents BOM/CRLF corruption):
```python
sys.stdout = open(sys.stdout.fileno(), mode='w', encoding='utf-8', newline='\n', closefd=False)
```

### `server.py`
Uses `mcp.server.lowlevel.Server` (not FastMCP) so tools are discovered dynamically at runtime.

```python
import sys, logging, mcp.types as types
from mcp.server.lowlevel import Server

logging.basicConfig(stream=sys.stderr, level=logging.INFO)

def create_server(registry) -> Server:
    server = Server("omniskill")

    @server.list_tools()
    async def handle_list_tools() -> list[types.Tool]:
        return registry.as_mcp_tools()

    @server.call_tool()
    async def handle_call_tool(name: str, arguments: dict):
        result = await registry.execute(name, arguments)
        return [types.TextContent(type="text", text=result)]

    return server
```

### `transport/stdio.py`
```python
async def run_stdio(skills_dir: str):
    registry = SkillRegistry(skills_dir)
    await registry.load()
    server = create_server(registry)
    async with stdio_transport.stdio_server() as (read, write):
        await server.run(read, write, server.create_initialization_options())
```

### Claude Code MCP config (`~/.claude.json`)
```json
{
  "mcpServers": {
    "omniskill": {
      "type": "stdio",
      "command": "python",
      "args": ["-m", "omniskill", "stdio", "--skills-dir", "C:/Users/ai53580/OmniSkill/skills"]
    }
  }
}
```

**Verify:** Restart Claude Code → `/mcp` shows `omniskill` connected → stub `ping` tool appears.

---

## Phase 2 — Skill Resolution Engine

### SKILL.md format (OmniSkill custom spec)

```yaml
---
name: hello-world
description: "Greets a person by name. Use this to test OmniSkill."
entry: scripts/hello.py      # path relative to skill root
runtime: python              # python | node | bash  (inferred from extension if omitted)
timeout: 30                  # seconds; default 30, max 300
parameters:
  - name: person_name
    type: string
    description: "Name of the person to greet"
    required: true
  - name: style
    type: string
    description: "Greeting style: formal or casual"
    required: false
    default: "casual"
---
```

Arguments are passed to the script as **JSON on stdin**. The script reads `sys.stdin`, processes, and writes result to **stdout**.

### `skill/loader.py`
- Accepts a directory path (raw skill) or `.zip`/`.skill` file
- ZIPs: extract to `skills/_extracted/<name>/` (handles both flat-at-root and folder-at-root ZIP structures)
- Parses YAML frontmatter between `---` delimiters with `yaml.safe_load()`
- Converts `parameters` list → MCP `inputSchema` (JSON Schema object)
- Returns `SkillDefinition` dataclass: `(tool, entry_abs_path, runtime, timeout, skill_root)`

### `skill/registry.py`
- `load()`: scans `skills_dir` for dirs with `SKILL.md` and `.zip`/`.skill` files
- `as_mcp_tools()`: returns current tool list (called fresh on every `tools/list` request)
- Built-in `omniskill__reload_skills` tool: hot-reloads without server restart

### `skill/executor.py`
```python
RUNTIME_CMD = {
    "python": [sys.executable],        # shares OmniSkill's venv
    "node":   [shutil.which("node") or "node"],
    "bash":   ["bash"],
}

async def run_skill(defn, arguments) -> str:
    cmd = RUNTIME_CMD[defn.runtime] + [defn.entry_abs_path]
    proc = await asyncio.create_subprocess_exec(
        *cmd, stdin=PIPE, stdout=PIPE, stderr=PIPE, cwd=defn.skill_root
    )
    out, err = await asyncio.wait_for(
        proc.communicate(json.dumps(arguments).encode()), timeout=defn.timeout
    )
    # stderr from skill → OmniSkill's stderr (never to MCP stream)
    if proc.returncode != 0:
        return f"**Error:** exit {proc.returncode}\n```\n{err.decode()}\n```"
    return out.decode().strip()
```

**Verify:** `pytest tests/test_loader.py tests/test_executor.py`

---

## Phase 3 — SSE / HTTP Transport (ChatGPT Web)

Uses `mcp.server.sse.SseServerTransport` (Starlette-native — already a transitive dep, no FastAPI needed).

Routes: `GET /sse` (open SSE stream) + `POST /messages` (receive JSON-RPC).

### CORS — V1 origins (no wildcard)
```python
ALLOWED_ORIGINS = [
    "https://chat.openai.com",
    "https://chatgpt.com",
    "https://claude.ai",
]
```

### Running with tunnel
```bash
# Terminal 1: start SSE server
python -m omniskill sse --skills-dir ./skills --port 8000

# Terminal 2: expose via Cloudflare tunnel
cloudflared tunnel --url http://127.0.0.1:8000

# Or ngrok
ngrok http 8000
```

The public tunnel URL is entered into ChatGPT's MCP connector settings.

Add SSE keepalive ping every 20s to prevent tunnel inactivity timeouts.

**Verify:**
```bash
# CORS preflight must return specific origin, not *
curl -X OPTIONS http://localhost:8000/sse \
  -H "Origin: https://chat.openai.com" \
  -H "Access-Control-Request-Method: GET" -v 2>&1 | grep -i access-control

# SSE stream opens and sends endpoint event
curl -s -N http://localhost:8000/sse | head -5
```

---

## Phase 4 — Configuration

### Environment variables (also via `.env` file)
| Variable | Default | Description |
|----------|---------|-------------|
| `OMNISKILL_SKILLS_DIR` | `./skills` | Path to skills directory |
| `OMNISKILL_HOST` | `127.0.0.1` | SSE server bind host |
| `OMNISKILL_PORT` | `8000` | SSE server port |
| `OMNISKILL_LOG_LEVEL` | `INFO` | stderr log level |
| `OMNISKILL_TIMEOUT` | `0` | Global timeout override (0 = use per-skill) |

`sse` subcommand also accepts `--allowed-origin` flag to add origins without editing source.

---

## Phase 5 — Tests

### `tests/test_loader.py`
- Parses `sample_skills/hello-world` → correct `tool.name`, `inputSchema`, `required` list
- Missing `entry` field raises `ValueError`
- ZIP with folder-at-root structure extracts and loads correctly

### `tests/test_executor.py`
- `run_skill(defn, {"person_name": "Test"})` returns string containing `"Test"`
- Timeout returns `"timed out"` error string (not an exception)
- Non-zero exit returns error string with stderr content

### `tests/test_protocol.py`
Full end-to-end using the MCP SDK's in-process test client — no Claude Code needed:
```python
@pytest.mark.asyncio
async def test_tools_list():
    params = StdioServerParameters(
        command="python",
        args=["-m", "omniskill", "stdio", "--skills-dir", "sample_skills"]
    )
    async with stdio_client(params) as (read, write):
        async with ClientSession(read, write) as session:
            await session.initialize()
            result = await session.list_tools()
            assert "hello-world" in [t.name for t in result.tools]
```

---

## Sample Skill: `sample_skills/hello-world/`

### `SKILL.md`
```yaml
---
name: hello-world
description: "Greets a person by name with formal or casual style. Use to verify OmniSkill is working."
entry: scripts/hello.py
runtime: python
timeout: 10
parameters:
  - name: person_name
    type: string
    description: "Name of the person to greet"
    required: true
  - name: style
    type: string
    description: "Greeting style: formal or casual"
    required: false
    default: "casual"
---
```

### `scripts/hello.py`
```python
import sys, json
args = json.load(sys.stdin)
name = args.get("person_name", "World")
style = args.get("style", "casual")
print(f"Good day, {name}." if style == "formal" else f"Hey {name}!")
```

---

## Implementation Order

| Phase | Depends on | Verify with |
|-------|------------|-------------|
| 0 — Bootstrap | — | `python -m omniskill --help` |
| 1 — stdio transport | Phase 0 | Claude Code `/mcp` + `ping` tool |
| 2 — Skill loader | Phase 0 | `pytest tests/test_loader.py` |
| 2 — Skill executor | Loader | `pytest tests/test_executor.py` |
| 1+2 — Integration | 1 + 2 | `pytest tests/test_protocol.py` |
| 3 — SSE transport | Phase 1 | curl CORS + SSE stream tests |
| 4 — Config | All | smoke test with env vars |

Phases 1 and 2 can be worked in parallel:
- **Track 1:** `server.py` + `transport/stdio.py`
- **Track 2:** `skill/loader.py` + `skill/executor.py`

---

## Out of Scope (V1)
- Gemini CLI / Gemini Web
- Multi-user / auth for the SSE endpoint
- Skill marketplace / remote registry
- Node.js runtime for OmniSkill itself (Python only)
