# FARIC Music Graph — Assistant Workflow

## Roles

ChatGPT prepares complete code, documentation, data migrations, tests, diagrams, release notes and exact Termux blocks.

The user performs real-device/browser checks, approves product direction and supplies account-side evidence when needed.

## Default loop

`requirements → prepared change → static/schema tests → Git review → CI → phone/browser QA → evidence/status closeout → next change`

For YouTube writes add:

`read-only inventory → dry-run → explicit confirmation → write → verify → audit`.

## Git safety

Before commit:
- `git diff --check`;
- inspect `git status --short`;
- stage exact intended paths;
- inspect `git diff --cached --name-status`;
- inspect `git diff --cached --stat`;
- check `git diff --cached --diff-filter=D --name-status`;
- stop on unexpected deletions/unrelated files;
- do not use `git add -A` as routine default;
- require clean tree after push.

## History

Preserve `docs/v.*`, QA reports, evidence manifests, finding history, architecture decisions and intentionally versioned sanitized channel snapshots.

Do not rewrite old PASS/FAIL to make history cleaner.

## Package/data safety

Migration/apply helpers should be idempotent, fail closed on ambiguous IDs, support dry-run/check when practical, use LF, avoid cache pollution and validate before phone execution.

## Evidence

Static analysis is not phone PASS. API success is not mutation PASS until read-after-write verification. Never invent missing evidence.

## Source/tool rule

Use the source closest to the fact:
- repo → GitHub/Git;
- generated data → validators/fixtures;
- public music metadata → current authoritative sources;
- channel state → live channel/account data;
- UX → real browser/phone;
- build → CI.

## Channel safety

Until explicitly enabled in a later release:
- adapters are read-only;
- no upload/delete/rename/reorder/playlist mutation;
- credentials/tokens never enter Git;
- all future writes require preview and explicit confirmation.
