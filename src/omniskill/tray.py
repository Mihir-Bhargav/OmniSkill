"""
System tray app for OmniSkill.
Runs the SSE server in a background thread and shows a tray icon.
Start with: pythonw -m omniskill tray
"""
import asyncio
import logging
import sys
import threading
from pathlib import Path
from logging.handlers import RotatingFileHandler

import pystray
from PIL import Image, ImageDraw

log = logging.getLogger("omniskill.tray")

# Always log to a file — pythonw has no console
_LOG_FILE = Path(__file__).parent.parent.parent / "omniskill-tray.log"
_LOG_FILE.parent.mkdir(parents=True, exist_ok=True)

# Prevent unbounded growth: keep a few small rotated logs.
_tray_log_handler = RotatingFileHandler(
    str(_LOG_FILE),
    maxBytes=2_000_000,
    backupCount=3,
    encoding="utf-8",
)
logging.basicConfig(
    handlers=[_tray_log_handler],
    level=logging.DEBUG,
    format="%(asctime)s %(name)s %(levelname)s %(message)s",
    force=True,
)

_ICON_PATH = Path(__file__).parent.parent.parent / "extension" / "chrome-extension" / "public" / "icon-128.png"


def _make_icon() -> Image.Image:
    if _ICON_PATH.exists():
        return Image.open(_ICON_PATH).resize((64, 64))
    # Fallback: indigo circle with white "O"
    img = Image.new("RGBA", (64, 64), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    draw.ellipse([2, 2, 62, 62], fill=(99, 102, 241, 255))
    draw.text((32, 32), "O", fill="white", anchor="mm")
    return img


class TrayApp:
    def __init__(self, skills_dirs: list[str], host: str, port: int):
        self.skills_dirs = skills_dirs
        self.host = host
        self.port = port
        self._loop: asyncio.AbstractEventLoop | None = None
        self._registry = None
        self._skill_count = 0
        self._icon: pystray.Icon | None = None

    # ------------------------------------------------------------------
    # Server thread
    # ------------------------------------------------------------------

    def _run_server(self) -> None:
        from omniskill.transport.sse import run_sse
        from omniskill.skill.registry import SkillRegistry

        async def _start():
            self._registry = SkillRegistry(self.skills_dirs)
            await self._registry.load()
            self._skill_count = len(self._registry._skills)
            log.info("Loaded %d skills", self._skill_count)
            self._update_title()
            from omniskill.server import create_server
            from mcp.server.sse import SseServerTransport
            from starlette.applications import Starlette
            from starlette.middleware import Middleware
            from starlette.middleware.cors import CORSMiddleware
            from starlette.requests import Request
            from starlette.routing import Mount, Route
            import uvicorn

            server = create_server(self._registry)
            sse_transport = SseServerTransport("/messages/")

            async def handle_sse(request: Request):
                async with sse_transport.connect_sse(
                    request.scope, request.receive, request._send
                ) as streams:
                    await server.run(
                        streams[0], streams[1], server.create_initialization_options()
                    )

            app = Starlette(
                routes=[
                    Route("/sse", endpoint=handle_sse),
                    Mount("/messages", app=sse_transport.handle_post_message),
                ],
                middleware=[
                    Middleware(
                        CORSMiddleware,
                        allow_origins=["*"],
                        allow_methods=["GET", "POST", "OPTIONS"],
                        allow_headers=["*"],
                        allow_credentials=False,
                    )
                ],
            )

            config = uvicorn.Config(app, host=self.host, port=self.port, log_config=None)
            srv = uvicorn.Server(config)
            await srv.serve()

        self._loop = asyncio.new_event_loop()
        asyncio.set_event_loop(self._loop)
        self._loop.run_until_complete(_start())

    # ------------------------------------------------------------------
    # Tray menu actions
    # ------------------------------------------------------------------

    def _update_title(self) -> None:
        if self._icon:
            self._icon.title = f"OmniSkill — {self._skill_count} skills on :{self.port}"

    def _reload(self, icon: pystray.Icon, item) -> None:
        if self._loop and self._registry:
            async def _do_reload():
                await self._registry.load()
                self._skill_count = len(self._registry._skills)
                log.info("Reloaded: %d skills", self._skill_count)
                self._update_title()
            asyncio.run_coroutine_threadsafe(_do_reload(), self._loop)

    def _quit(self, icon: pystray.Icon, item) -> None:
        icon.stop()
        if self._loop:
            self._loop.call_soon_threadsafe(self._loop.stop)
        sys.exit(0)

    # ------------------------------------------------------------------
    # Entry point
    # ------------------------------------------------------------------

    def run(self) -> None:
        try:
            log.info("TrayApp.run() starting, port=%d", self.port)
            thread = threading.Thread(target=self._run_server, daemon=True, name="omniskill-server")
            thread.start()
            log.info("Server thread started")

            menu = pystray.Menu(
                pystray.MenuItem("OmniSkill", None, enabled=False),
                pystray.MenuItem(f"localhost:{self.port}", None, enabled=False),
                pystray.Menu.SEPARATOR,
                pystray.MenuItem("Reload Skills", self._reload),
                pystray.Menu.SEPARATOR,
                pystray.MenuItem("Quit", self._quit),
            )

            self._icon = pystray.Icon(
                name="OmniSkill",
                icon=_make_icon(),
                title=f"OmniSkill — starting…",
                menu=menu,
            )
            log.info("Calling icon.run()")
            self._icon.run()  # blocks on main thread (required on Windows)
            log.info("icon.run() returned (normal exit)")
        except Exception:
            log.exception("TrayApp crashed")
