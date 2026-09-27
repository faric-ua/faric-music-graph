# FARIC Music Graph — ACTIVE PLAN

Updated: 2026-09-28

Purpose: live crash-recovery checklist. After a chat loss, read this after `CURRENT_HANDOFF.md` and continue from the first unchecked item.

## Current objective — mobile graph UX + spherical feasibility

- [x] Repository/project skeleton established.
- [x] Termux private checkout and shared folders established.
- [x] Termux:Widget `Music Graph` shortcut and project menu phone smoke PASS.
- [x] First mobile graph feedback recorded: current Canvas control is poor and usable pinch zoom is missing.
- [x] Research real 3D/spherical graph approaches and keep reference links/decision rationale in the project discussion.
- [x] Implement mobile-first 2D interaction prototype: pinch zoom, one-finger pan, tap/select, fit/reset.
- [x] Implement a separate spherical/3D prototype using the same canonical sample data.
- [ ] Phone-compare improved 2D vs spherical/3D: portrait, landscape, orbit/pan, pinch, select/focus, isolate/reset.
- [ ] Choose default graph mode and secondary mode from phone evidence; update architecture decision.
- [ ] Import the full prepared The Prodigy + Linkin Park seed through the canonical data contract.
- [ ] Validate canonical IDs, provenance and remix/original edges.
- [ ] Run full-seed phone performance/interaction QA.
- [ ] Inventory `@faric_ua` read-only and add channel-state overlays.

## Update rule

After each successful project-progress step:
1. mark only the verified checkbox as `[x]`;
2. record new finding/evidence when applicable;
3. update `CURRENT_HANDOFF.md` when the resume point changes;
4. leave the next action as the first unchecked item.

Do not rely on chat memory as the only record.
