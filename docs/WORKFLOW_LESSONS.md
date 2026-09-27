# Workflow Lessons

Reusable lessons adapted from real YTM Importer and Renault Docs development.

## 1. Repository is the memory
A new assistant must recover the project from START_HERE + CURRENT_HANDOFF + live Git, not from chat recollection.

## 2. Build success is not user-behavior success
CI can prove syntax/tests/build. It cannot prove Android touch, browser layout, orientation, OAuth/account state or remote YouTube results.

## 3. Never hide lifecycle bugs
Do not disable landscape/refresh to make a state-restoration bug disappear. Restore semantic state and do not repeat operations.

## 4. Modals are not operation state
Long-running work survives independently from dialogs. Closing a result dialog must not erase the completed operation view.

## 5. Cancel means no-op
File pickers and future mutation previews must return to the same parent state without unexpected side effects.

## 6. Exact Git staging prevents history damage
Routine `git add -A` is banned. Review staged names/stats/deletions before commit.

## 7. Generated packages must be tested before the phone
Check first apply, repeat apply/idempotence, failure cases, line endings and repository cleanliness.

## 8. IDs are opaque
Do not infer semantics from suffixes, filenames, title punctuation or URL shape. Preserve exact external IDs.

## 9. Preserve source evidence
Do not rewrite old FAIL/PENDING into PASS. New evidence updates current status while historical snapshots stay historical.

## 10. YouTube writes need a stronger gate
Read first. Build a dry-run. Show exact target and quota. Confirm. Write. Read back. Record result. Never silently retry a mutation that can duplicate content.

## 11. Separate canonical data from views
`year → genre → artist → album → track` is one view. The same track can appear in compilations, Best Of, live, remix and channel playlists without becoming separate unrelated identities.

## 12. Do not copy old architecture blindly
Reuse proven contracts and safety rules, but choose the technology that fits this graph product.
