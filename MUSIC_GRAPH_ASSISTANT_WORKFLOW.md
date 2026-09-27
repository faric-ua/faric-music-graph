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


## Active plan / crash-recovery rule

`ACTIVE_PLAN.md` is mandatory mutable project state.

Rules:
- before a multi-step implementation/research/QA task, write or refresh the ordered checkbox plan;
- after every successful project-progress step, mark the exact verified checkbox complete before closing the work;
- after every user-confirmed phone/browser PASS/FAIL, update the plan and relevant QA/finding/handoff files in the same documentation wave;
- the first unchecked checkbox is the default resume point after a chat/session loss;
- never check a step merely because it was intended, coded, or discussed; check only what current evidence proves;
- if scope changes, edit the remaining plan instead of keeping a misleading obsolete checklist;
- pure questions that do not change project state do not require a repository commit.

`CURRENT_HANDOFF.md` remains the short state snapshot; `ACTIVE_PLAN.md` is the ordered execution checklist.
