---
name: hello-world
description: "Greets a person by name. Use this to verify OmniSkill is working."
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
