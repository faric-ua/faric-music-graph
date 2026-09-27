# FARIC Music Graph — START HERE

Canonical entry point for every new assistant/session. The repository must be sufficient to recover project context without relying on an old chat.

## Mission

Build a local-first music knowledge graph and a future management workspace for the YouTube / YouTube Music channel `@faric_ua`.

Initial catalog work already exists for **The Prodigy** and **Linkin Park**.

The product must support relationships, not only folders:

`year ↔ genre ↔ artist ↔ release ↔ track ↔ version/remix ↔ YouTube item`.

## Mandatory reading order

1. `CURRENT_HANDOFF.md`
2. `MUSIC_GRAPH_ASSISTANT_WORKFLOW.md`
3. `PROJECT_STATUS.md`
4. `BACKLOG.md`
5. `OPEN_FINDINGS.md`
6. `docs/assistant-kit/ASSISTANT_TOOL_MAP.md`
7. `docs/assistant-kit/SYSTEM_BEHAVIOR_CONTRACT.md`
8. `docs/assistant-kit/UI_CONTRACT.md`
9. `docs/assistant-kit/DATA_CONTRACT.md`
10. `docs/assistant-kit/YOUTUBE_CHANNEL_CONTRACT.md`
11. `TERMUX_COMMANDS.md`
12. `docs/architecture.md`
13. current release folder under `docs/v.*`.

## Sources of truth

When evidence conflicts, prefer:
1. current real channel/API result for channel facts;
2. real phone/browser behavior;
3. verified CI/build evidence;
4. current GitHub code;
5. current contracts/status docs;
6. historical release docs;
7. old chat memory.

Never turn a guess into catalog truth.

## Development strategy

Phase 1 is read-only: normalize → visualize → inventory channel → match → detect missing/duplicate/wrong-version items.

Only after that layer is stable may write actions exist. Every future mutation must follow:

`preview → explicit confirmation → mutation → verified result → audit record`.

## Technology direction

Web/PWA first. Planned candidate stack after version verification:
- TypeScript;
- React + Vite;
- Graphology + Sigma.js;
- JSON Schema or Zod;
- IndexedDB;
- Playwright;
- Vitest;
- GitHub Actions.

A packaged Android app may later use Capacitor unless a native-only requirement justifies Kotlin/Compose.

Do not create a native Android module merely because other projects have one.
