import argparse
import asyncio
import sys
from pathlib import Path

# Windows: prevent BOM/CRLF from corrupting any stdout output
# sys.stdout is None when launched with pythonw (no console), so guard against that
if sys.platform == "win32" and sys.stdout is not None:
    import io
    sys.stdout = io.TextIOWrapper(
        sys.stdout.buffer, encoding="utf-8", newline="\n", line_buffering=True
    )


def _startup_vbs_path():
    import os
    startup = Path(os.environ["APPDATA"]) / "Microsoft" / "Windows" / "Start Menu" / "Programs" / "Startup"
    return startup / "OmniSkill.vbs"


def _install_startup(skills_dirs: list[str], port: int):
    pythonw = Path(sys.executable).parent / "pythonw.exe"
    project_root = Path(__file__).parent.parent.parent
    # Build skills-dir args using Chr(34) for each quoted path (VBS safe)
    q = 'Chr(34)'
    skills_parts = " & ".join(
        f'{q} & "{d}" & {q}' for d in skills_dirs
    )
    cmd = (
        f'{q} & "{pythonw}" & {q}'
        f' & " -m omniskill tray --skills-dir " & {skills_parts}'
        f' & " --port {port}"'
    )
    script = (
        f'Set ws = CreateObject("WScript.Shell")\n'
        f'ws.CurrentDirectory = "{project_root}"\n'
        f'ws.Run {cmd}, 0, False\n'
    )
    vbs = _startup_vbs_path()
    vbs.write_text(script, encoding="utf-8")
    print(f"OmniSkill added to startup: {vbs}", file=sys.stderr)


def _remove_startup():
    vbs = _startup_vbs_path()
    if vbs.exists():
        vbs.unlink()
        print("OmniSkill removed from startup.", file=sys.stderr)
    else:
        print("OmniSkill was not in startup.", file=sys.stderr)


def main():
    parser = argparse.ArgumentParser(prog="omniskill")
    sub = parser.add_subparsers(dest="command")

    sse_p = sub.add_parser("sse", help="Run MCP server over SSE/HTTP")
    sse_p.add_argument("--skills-dir", nargs="+", default=["./skills"],
                       metavar="DIR", help="One or more skill directories (scanned recursively)")
    sse_p.add_argument("--host", default="127.0.0.1")
    sse_p.add_argument("--port", type=int, default=3006)

    tray_p = sub.add_parser("tray", help="Run as a Windows system tray app (no console window)")
    tray_p.add_argument("--skills-dir", nargs="+", default=["./skills"],
                        metavar="DIR", help="One or more skill directories (scanned recursively)")
    tray_p.add_argument("--host", default="127.0.0.1")
    tray_p.add_argument("--port", type=int, default=3006)
    tray_p.add_argument("--install-startup", action="store_true",
                        help="Add OmniSkill to Windows startup and exit")
    tray_p.add_argument("--remove-startup", action="store_true",
                        help="Remove OmniSkill from Windows startup and exit")

    args = parser.parse_args()

    if args.command == "sse":
        from omniskill.transport.sse import run_sse
        asyncio.run(run_sse(args.skills_dir, args.host, args.port))
    elif args.command == "tray":
        if args.install_startup:
            _install_startup(args.skills_dir, args.port)
        elif args.remove_startup:
            _remove_startup()
        else:
            from omniskill.tray import TrayApp
            TrayApp(args.skills_dir, args.host, args.port).run()
    else:
        parser.print_help()
        sys.exit(1)


if __name__ == "__main__":
    main()
