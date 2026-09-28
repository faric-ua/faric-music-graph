#!/usr/bin/env python3
from __future__ import annotations
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
required = [
    "START_HERE_ASSISTANT.md",
    "CURRENT_HANDOFF.md",
    "PROJECT_STATUS.md",
    "BACKLOG.md",
    "MUSIC_GRAPH_ASSISTANT_WORKFLOW.md",
    "docs/architecture.md",
    "docs/assistant-kit/DATA_CONTRACT.md",
    "docs/assistant-kit/YOUTUBE_CHANNEL_CONTRACT.md",
    "data/catalog.seed.json",
    "data/channel.json",
    "data/accounts.fixture.json",
    "data/schemas/account.schema.json",
    "app/filter-model.js",
    "scripts/test_filter_panel.js",
]

errors = []
for rel in required:
    if not (ROOT / rel).is_file():
        errors.append(f"missing: {rel}")

for rel in ["data/catalog.seed.json", "data/channel.json", "data/accounts.fixture.json", "data/schemas/account.schema.json", "docs/v.0.1.0/RELEASE_META.json", "docs/v.0.2.0/RELEASE_META.json"]:
    path = ROOT / rel
    if path.exists():
        try:
            json.loads(path.read_text(encoding="utf-8"))
        except Exception as exc:
            errors.append(f"invalid json {rel}: {exc}")

for path in ROOT.rglob("*"):
    if not path.is_file() or ".git" in path.parts:
        continue
    if path.suffix.lower() in {".md", ".txt", ".json", ".py", ".sh", ".yml", ".yaml", ".html", ".css", ".js"}:
        raw = path.read_bytes()
        if b"\r\n" in raw:
            errors.append(f"CRLF: {path.relative_to(ROOT)}")

if errors:
    print("FAIL")
    for e in errors:
        print(" -", e)
    raise SystemExit(1)

print("PASS: repository foundation validation")
