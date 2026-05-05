
<div align="center">
  <img src="chrome-extension/public/icon-128.png" alt="OmniSkill Logo" width="80" height="80">
  <h1>OmniSkill</h1>
</div>

<p align="center">
Run local AI skills from any chat interface — Gemini, ChatGPT, Perplexity, Grok, AI Studio, and more.
</p>

---

## What is OmniSkill?

OmniSkill is a Chrome extension that bridges your local skill library to any AI chat platform. Type `/skill-name` in any supported chat input, select from the autocomplete popup, and the skill's full prompt is sent seamlessly — no copy-pasting, no switching windows.

It also integrates with the Model Context Protocol (MCP), allowing AI platforms to detect, execute, and receive results from local MCP tools.

## Supported Platforms

- [Google Gemini](https://gemini.google.com/)
- [ChatGPT](https://chatgpt.com/)
- [Google AI Studio](https://aistudio.google.com/)
- [Perplexity](https://perplexity.ai/)
- [Grok](https://grok.com/)
- [OpenRouter Chat](https://openrouter.ai/chat)
- [DeepSeek](https://chat.deepseek.com/)
- [T3 Chat](https://t3.chat/)
- [GitHub Copilot](https://github.com/copilot)
- [Mistral AI](https://chat.mistral.ai/)
- [Kimi](https://kimi.com/)
- [Qwen Chat](https://chat.qwen.ai/)
- [Z Chat](https://chat.z.ai/)

## Slash Command Skills

Type `/` in any supported chat input to open the skill autocomplete:

1. Type `/skill-name` — autocomplete popup appears
2. Arrow keys or mouse to navigate, Enter or Tab to select
3. The skill prompt is inserted as a blue pill in the input
4. Press Enter — the full skill content is sent to the AI naturally

Skills live in `C:\Users\<you>\OmniSkill\skills\` as SKILL.md files. The OmniSkill tray server loads them automatically on startup.

## MCP Tool Integration

OmniSkill connects to a local MCP server (default: `http://localhost:3006/sse`) and enables AI platforms to:

- Detect MCP tool calls in AI responses
- Execute tools with one click (or automatically)
- Insert tool results back into the conversation

### Starting the OmniSkill server

```bash
python -m omniskill tray --skills-dir ./skills --port 3006
```

Or use the Windows startup shortcut in `%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup\OmniSkill.vbs` to launch it automatically on login.

### Connecting the extension

1. Open a supported AI platform
2. Click the server status indicator in the OmniSkill sidebar (shows "Disconnected")
3. Enter the server URL — default: `http://localhost:3006/sse`
4. Click Connect

Transport options:
- SSE: `http://localhost:3006/sse`
- Streamable HTTP: `http://localhost:3006/mcp`
- WebSocket: `ws://localhost:3006/message`

## Key Features

- **Slash command skills** — `/skill-name` autocomplete with instant injection
- **MCP tool detection** — automatically detects tool calls in AI responses
- **One-click execution** — run tools from a card UI rendered inline
- **Auto-execute / auto-submit** — fully automated tool call loops
- **Multi-platform** — 13 AI chat platforms supported
- **AI Studio system prompt injection** — skills injected directly into system instructions

## Manual Installation

1. Download or build the extension (see Development below)
2. Go to `chrome://extensions/` in Chrome
3. Enable **Developer mode**
4. Click **Load unpacked** and select the `dist/` folder

## Development

### Prerequisites

- Node.js (v18+)
- pnpm

### Setup

```bash
# Install dependencies
pnpm install

# Build for production
pnpm base-build

# Start development server with hot reload
pnpm dev
```

Built output lands in `extension/dist/`. Load that folder as an unpacked extension.

## License

MIT — see LICENSE for details.
