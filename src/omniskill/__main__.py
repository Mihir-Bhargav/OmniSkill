import argparse
import asyncio
import sys

# Windows: prevent BOM/CRLF from corrupting any stdout output
if sys.platform == "win32":
    import io
    sys.stdout = io.TextIOWrapper(
        sys.stdout.buffer, encoding="utf-8", newline="\n", line_buffering=True
    )


def main():
    parser = argparse.ArgumentParser(prog="omniskill")
    sub = parser.add_subparsers(dest="command")

    sse_p = sub.add_parser("sse", help="Run MCP server over SSE/HTTP")
    sse_p.add_argument("--skills-dir", nargs="+", default=["./skills"],
                       metavar="DIR", help="One or more skill directories (scanned recursively)")
    sse_p.add_argument("--host", default="127.0.0.1")
    sse_p.add_argument("--port", type=int, default=3006)

    args = parser.parse_args()

    if args.command == "sse":
        from omniskill.transport.sse import run_sse
        asyncio.run(run_sse(args.skills_dir, args.host, args.port))
    else:
        parser.print_help()
        sys.exit(1)


if __name__ == "__main__":
    main()
