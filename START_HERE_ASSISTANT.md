# FARIC Music Graph — START HERE

Canonical entry point for every new assistant/session. The repository must be sufficient to recover project context without relying on an old chat.

## Mission

Build a mobile-first nested music knowledge graph and a future management workspace for multiple YouTube / YouTube Music accounts/channels.

Initial catalog work exists for **The Prodigy** and **Linkin Park**.

Final user-facing target: **signed Android APK**.

Primary UX: **Nested 3D Worlds**.

`Universe → Account → Year → Genre → Artist → Release → Track`.

The canonical data remains a many-to-many graph. The sequence above is the primary navigation projection.

## Mandatory reading order

1. `CURRENT_HANDOFF.md`
2. `ACTIVE_PLAN.md`
3. `docs/product/PRODUCT_VISION.md`
4. `docs/architecture/NESTED_3D_WORLDS.md`
5. `docs/design/MOBILE_UI_BLUEPRINT.md`
6. `MUSIC_GRAPH_ASSISTANT_WORKFLOW.md`
7. `PROJECT_STATUS.md`
8. `BACKLOG.md`
9. `OPEN_FINDINGS.md`
10. `docs/assistant-kit/DOCUMENTATION_DISCIPLINE.md`
11. `docs/assistant-kit/SIBLING_PROJECT_REFERENCE_RULE.md`
12. `docs/assistant-kit/ASSISTANT_TOOL_MAP.md`
13. `docs/assistant-kit/SYSTEM_BEHAVIOR_CONTRACT.md`
14. `docs/assistant-kit/UI_CONTRACT.md`
15. `docs/assistant-kit/DATA_CONTRACT.md`
16. `docs/assistant-kit/YOUTUBE_CHANNEL_CONTRACT.md`
17. `docs/android/APK_DELIVERY_CONTRACT.md`
18. `TERMUX_COMMANDS.md`
19. `docs/architecture.md`
20. current release folder under `docs/v.*`.

## Sources of truth

When evidence conflicts, prefer:
1. real phone behavior for UI/gesture/lifecycle facts;
2. live channel/API result for current channel facts;
3. verified CI/build evidence;
4. current GitHub code;
5. current contracts/status docs;
6. historical release docs;
7. old chat memory.

Never turn a guess into catalog truth.

## Development strategy

Current product sequence:

```text
product contract
→ renderer-independent state/navigation
→ Nested 3D projection
→ mobile filter/control UX
→ full seed
→ multi-account read-only inventory
→ performance/phone hardening
→ Android packaging
→ signed APK pipeline
→ real-phone APK QA
→ later safe remote writes
```

## Sibling projects

YTM and Renault may be read for proven engineering lessons.

They are read-only references while working on Music Graph.

Never modify them, reuse their signing keys, or copy project-specific behavior blindly.

## Remote-write boundary

Only after read-only inventory/matching is stable:

`preview → explicit confirmation → mutation → read-after-write verification → audit record`.
