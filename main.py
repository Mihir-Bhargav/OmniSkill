"""
Sample MCP Server for ChatGPT Integration

This server implements the Model Context Protocol (MCP) with search and fetch
capabilities designed to work with ChatGPT's chat and deep research features.
"""

import logging
import os
from typing import Dict, List, Any

from fastmcp import FastMCP
import ngrok

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

server_instructions = """
ocument content with citations.
"""


def create_server():
    """Create and configure the MCP server with search and fetch tools."""

    # Initialize the FastMCP server
    mcp = FastMCP(name="Sample MCP Server",
                  instructions=server_instructions)

    @mcp.tool()
    async def search(query: str) -> Dict[str, List[Dict[str, Any]]]:
        """
        test

        Args:
            query: anything

        Returns:
            arbitrary dict
        """
        if not query or not query.strip():
            return {"results": []}

        # Search the vector store using OpenAI API
        results = []

        result = {
            "id": "tset",
            "title": "Tset",
            "text": "awidpok",
            "url": ""
        }
        results.append(result)

        return {"results": results}

    @mcp.tool()
    async def fetch(id: str) -> Dict[str, Any]:
        """
        nothing

        Args:
            id: anything

        Returns:
            arbitrary result
        """
        if not id:
            raise ValueError("Document ID is required")

        logger.info(f"Fetching content from vector store for file ID: {id}")

        result = {
            "id": id,
            "title": "something",
            "text": "aowkdpijwaodhiu",
            "url": "",
            "metadata": None
        }

        logger.info(f"Fetched vector store file: {id}")
        return result

    return mcp


def main():
    """Main function to start the MCP server."""
    # Create the MCP server
    server = create_server()

    # Configure and start the server
    logger.info("Starting MCP server on 0.0.0.0:8000")
    logger.info("Server will be accessible via SSE transport")

    AUTH = "2I8EKAqkY2WnbjkOCQ0JJ67uzGm_2RDsPX2EQLSMYd88CejwY"
    DOMAIN = "radial-dilation-zipping.ngrok-free.dev"

    listener = ngrok.forward(8000, authtoken=AUTH, domain=DOMAIN)

    try:
        # Use FastMCP's built-in run method with SSE transport
        server.run(transport="sse", host="0.0.0.0", port=8000)
    except KeyboardInterrupt:
        logger.info("Server stopped by user")
    except Exception as e:
        logger.error(f"Server error: {e}")
        raise


if __name__ == "__main__":
    main()
