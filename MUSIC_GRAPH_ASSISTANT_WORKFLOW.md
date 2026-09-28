# FARIC Music Graph — Assistant Workflow

## Roles

ChatGPT prepares complete code, documentation, data migrations, tests, diagrams, release notes, audits and exact Termux blocks.

The user performs real-device/browser/APK checks, approves product direction and supplies account-side evidence when needed.

## Default loop

`requirements → product/behavior contract → active plan → release skeleton/diagram → prepared change → static/schema/unit tests → Git review → CI → phone/browser QA → evidence/status closeout → next change`

For YouTube writes add:

`read-only inventory → dry-run → explicit confirmation → write → read-after-write verification → audit`.

## Product target

Final user-facing product: signed Android APK.

Web/PWA is the fast graph development/test surface.

Do not treat a browser prototype as the final delivery state.

## Git safety

Before commit:
- `git diff --check`;
- inspect `git status --short`;
- stage exact intended paths;
- inspect staged name/status + stat;
- check real deletion filter;
- stop on unexpected deletions/unrelated files;
- do not use `git add -A` as routine default;
- require clean tree after push.

## History

Preserve `docs/v.*`, QA reports, evidence manifests, finding history, architecture decisions and intentionally versioned sanitized snapshots.

Do not rewrite old PASS/FAIL to make history cleaner.

## Evidence

Static analysis is not phone PASS.
Browser PASS is not APK PASS.
Signed APK is not installed-phone PASS.
API success is not mutation PASS until read-after-write verification.

Never invent missing evidence.

## Documentation gate

For every major behavior:
1. update product/behavior contract;
2. create/update release skeleton;
3. add/update diagram;
4. update `ACTIVE_PLAN.md`;
5. then implement feature code.

Documentation is part of the implementation.

## Active plan / crash-recovery rule

`ACTIVE_PLAN.md` is mandatory mutable project state.

- before multi-step work, refresh the ordered checkbox plan;
- after every successful project-progress step, mark the exact verified checkbox complete;
- after phone/browser/APK PASS/FAIL, update plan + QA/finding/handoff;
- first unchecked checkbox is the default resume point;
- never check work merely because it was intended or coded;
- if scope changes, rewrite remaining unchecked items;
- pure Q&A without project-state change needs no repository commit.

`CURRENT_HANDOFF.md` is the concise state snapshot.
`ACTIVE_PLAN.md` is the ordered execution checklist.

## Sibling repositories

YTM and Renault may be read for proven workflow/Android lessons.

While Music Graph is active:
- treat them as read-only;
- do not modify them;
- do not reuse signing keys/secrets/package IDs;
- do not blindly copy dependency versions or business logic.

Adapt useful rules into Music Graph and test them here.

Canonical rule:
`docs/assistant-kit/SIBLING_PROJECT_REFERENCE_RULE.md`.

## Android/APK discipline

Track separately:
- repository source/version;
- signed build source + CI run;
- phone-installed/tested version.

Music Graph gets its own signing identity.

After a signed build:
- retrieve exact APK + checksum;
- verify;
- place in stable versioned Music Graph artifact folder;
- user installs;
- record installed version;
- run separate APK phone QA.

## Channel safety

Until explicitly enabled later:
- no upload/delete/rename/reorder/playlist mutation;
- credentials/tokens never enter Git;
- all future writes require preview + explicit confirmation + verification + audit.

## Source/tool rule

Use the source closest to the fact:
- repository → GitHub/Git;
- generated data → validators/fixtures;
- current dependencies/platform behavior → current official/public docs;
- channel state → live account/channel data;
- UX → real browser/phone;
- APK build → CI;
- APK behavior → installed phone.

## Package/data safety

Migration/apply helpers should be idempotent, fail closed on ambiguous IDs, support dry-run/check when practical, use LF, avoid cache pollution and validate before phone execution.
