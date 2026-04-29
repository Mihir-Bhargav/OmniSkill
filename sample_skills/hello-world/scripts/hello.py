import sys
import json

args = json.load(sys.stdin)
name = args.get("person_name", "World")
style = args.get("style", "casual")
print(f"Good day, {name}." if style == "formal" else f"Hey {name}!")
