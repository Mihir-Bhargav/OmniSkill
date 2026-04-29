import sys
import logging
import mcp.types as types
from mcp.server.lowlevel import Server

logging.basicConfig(stream=sys.stderr, level=logging.INFO,
                    format="%(asctime)s %(name)s %(levelname)s %(message)s")
log = logging.getLogger("omniskill")


def create_server(registry) -> Server:
    server = Server("omniskill")

    @server.list_tools()
    async def handle_list_tools() -> list[types.Tool]:
        return registry.as_mcp_tools()

    @server.call_tool()
    async def handle_call_tool(
        name: str, arguments: dict
    ) -> list[types.TextContent]:
        try:
            result = await registry.execute(name, arguments)
        except Exception as e:
            result = f"**Error:** {e}"
        return [types.TextContent(type="text", text=result)]

    return server
