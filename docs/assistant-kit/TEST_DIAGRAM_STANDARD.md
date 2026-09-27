# Test Diagram Standard

Each route/test diagram starts from the real user entry point and shows:
- parent view;
- action;
- child view;
- modal/system picker;
- state transitions;
- Back/Cancel ownership;
- reload/rotation/recreation point when relevant;
- expected PASS/FAIL.

Remote write flows always show:

```text
read current remote state
  ↓
build preview
  ↓
explicit confirmation
  ↓
write
  ↓
read-after-write verification
  ↓
audit result
```

A diagram defines a test. It is not evidence the test ran.
