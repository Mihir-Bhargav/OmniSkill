import logging
import sys

import uvicorn
from mcp.server.sse import SseServerTransport
from starlette.applications import Starlette
from starlette.middleware import Middleware
from starlette.middleware.cors import CORSMiddleware
from starlette.requests import Request
from starlette.routing import Mount, Route

from omniskill.server import create_server
from omniskill.skill.registry import SkillRegistry

log = logging.getLogger("omniskill.sse")

# Localhost is only accessible locally so wildcard CORS is acceptable here.
# Restrict to specific origins in a tunnel/cloud deployment.
ALLOWED_ORIGINS = ["*"]


async def run_sse(skills_dirs: list[str], host: str = "127.0.0.1", port: int = 3006):
    registry = SkillRegistry(skills_dirs)
    await registry.load()
    server = create_server(registry)

    sse_transport = SseServerTransport("/messages/")

    async def handle_sse(request: Request):
        async with sse_transport.connect_sse(
            request.scope, request.receive, request._send
        ) as streams:
            await server.run(
                streams[0], streams[1], server.create_initialization_options()
            )

    middleware = [
        Middleware(
            CORSMiddleware,
            allow_origins=ALLOWED_ORIGINS,
            allow_methods=["GET", "POST", "OPTIONS"],
            allow_headers=["*"],
            allow_credentials=False,
        )
    ]

    app = Starlette(
        routes=[
            Route("/sse", endpoint=handle_sse),
            Mount("/messages", app=sse_transport.handle_post_message),
        ],
        middleware=middleware,
    )

    log.info("OmniSkill SSE server starting on http://%s:%d/sse", host, port)
    print(f"OmniSkill running → http://{host}:{port}/sse", file=sys.stderr)

    config = uvicorn.Config(app, host=host, port=port, log_config=None)
    srv = uvicorn.Server(config)
    await srv.serve()
