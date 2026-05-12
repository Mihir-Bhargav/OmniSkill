
<div align="center">
  <img src="extension/chrome-extension/public/banner.png" alt="OmniSkill — Run local /skills across platforms" width="100%">
</div>

<p align="center">
Run local AI skills from any chat interface (Lovable, Gemini, ChatGPT, and more) — without copy-pasting prompts.
</p>

---

## What Is OmniSkill?

OmniSkill has two parts:

- **A small local app** (Python) that loads your skills from disk.
- **A Chrome extension** that lets you type `/skill-name` inside supported AI chat sites to insert the skill instantly.

Your skills live locally in `skills/` as simple `SKILL.md` files.

---

## Quick Start (Windows, Non‑Technical)

### What you need

- Google Chrome
- Python 3.10+ installed
- This repository on your computer (download ZIP, then extract)

### 1) Install OmniSkill (one time)

Open **PowerShell** in the repo folder and run:

```bash
python -m pip install -e .
```

### 2) Start OmniSkill (tray app)

Run:

```bash
python -m omniskill tray --skills-dir ./skills --port 3006
```

What to look for:

- An OmniSkill icon appears in your Windows system tray (near the clock).
- A log file appears in the repo folder: `omniskill-tray.log`

Optional (recommended): start OmniSkill automatically when you log in:

```bash
python -m omniskill tray --skills-dir ./skills --port 3006 --install-startup
```

### 3) Install the Chrome extension (no building required)

1. Open Chrome and go to `chrome://extensions/`
2. Turn on **Developer mode** (top right)
3. Click **Load unpacked**
4. Select this folder: `extension/dist`

### 4) Connect the extension to your local OmniSkill server (one time)

1. Open a supported site, for example `https://lovable.dev/`
2. Open the OmniSkill sidebar
3. Click the server status (it may say “Disconnected”)
4. Enter this server URL:

`http://localhost:3006/sse`

5. Click **Connect**

---

## Using Skills (the only thing you need to remember)

1. Click the chat input box
2. Type `/` and start typing a skill name
3. Choose from the popup (Enter or Tab)
4. Add optional context (one sentence is enough)
5. Press Enter to send

On `lovable.dev`, OmniSkill intentionally shows only `lovable-*` skills in autocomplete so it stays focused.

---

## Adding Or Editing Skills

Skills live in `skills/<skill-name>/SKILL.md`.

- Edit a skill file
- In any connected chat, run `/omniskill__reload_skills` to reload skills without restarting OmniSkill

---

## Troubleshooting

If the extension won’t connect:

- Confirm OmniSkill is running (tray icon exists)
- Confirm the URL is exactly `http://localhost:3006/sse`
- Open `omniskill-tray.log` and search for “Error”

If `/` doesn’t show the OmniSkill popup:

- Refresh the page
- Check `chrome://extensions/` and make sure OmniSkill is enabled
- Confirm you loaded `extension/dist` (not `extension/`)

If the port is already in use:

- Start OmniSkill on a different port, for example:

```bash
python -m omniskill tray --skills-dir ./skills --port 3007
```

- Then connect the extension to `http://localhost:3007/sse`

---

## Supported Platforms

Current host permissions include:

- Lovable (`lovable.dev`)
- Google Gemini (`gemini.google.com`)
- ChatGPT (`chatgpt.com`, `chat.openai.com`)
- Google AI Studio (`aistudio.google.com`)
- GitHub Copilot chat (`github.com`, `copilot.github.com`)
- DeepSeek (`chat.deepseek.com`)
- Grok (`grok.com`)
- Perplexity (`perplexity.ai`)

---

## Development (Optional)

If you want to rebuild the extension yourself:

```bash
cd extension
pnpm install
pnpm base-build
```

Then load `extension/dist` in `chrome://extensions/`.

To run the server without the tray:

```bash
python -m omniskill sse --skills-dir ./skills --port 3006
```

---

## License

MIT — see `LICENSE`.

