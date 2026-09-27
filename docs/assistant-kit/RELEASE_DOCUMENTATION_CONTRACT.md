# Release Documentation Contract

Create the release skeleton before the first feature-code change.

```text
docs/v.X.Y.Z/
├── RELEASE_META.json
├── RELEASE.md
├── REGRESSION_CHECKLIST.md
├── diagrams/
│   └── README.md
└── qa/
    ├── BUG_REGISTER.md
    ├── PHONE_TEST.md
    └── EVIDENCE_MANIFEST.md
```

After execution add dated test-run/report files.

Track separately:
- source SHA;
- CI run;
- browser QA;
- phone QA;
- channel read audit;
- channel write audit;
- known findings.

Successful CI never implies phone or YouTube mutation PASS.
