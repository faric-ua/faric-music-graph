# Sibling Project Reference Rule

Updated: 2026-09-28

Sibling repositories may be read as engineering references:
- `faric-ua/YTM`;
- `faric-ua/renault-docs-android`.

## Hard rule

While working on FARIC Music Graph:
- sibling projects are **read-only references** unless the user explicitly switches projects and asks for changes there;
- never “synchronize” or modify YTM/Renault just because Music Graph learned from them;
- never reuse their signing keys, secrets, package IDs or project-specific code blindly.

## What may be reused conceptually

Good candidates:
- release/QA workflow;
- crash-recovery documentation;
- Git safety guards;
- Android lifecycle rules;
- fixed-footer mobile layout lessons;
- stable dev signing concept;
- signed APK validation pipeline;
- phone artifact conventions;
- separation of CI PASS from phone PASS;
- modal/state restoration lessons.

## What must be re-evaluated

Do not copy blindly:
- dependency versions;
- Android SDK baseline;
- Gradle/Kotlin versions;
- UI layouts;
- business logic;
- package IDs;
- storage permissions;
- signing files;
- API quotas/behavior;
- data schemas.

For current dependencies/platform behavior, check current official/public documentation at implementation time.

## Documentation requirement

If a sibling-project lesson materially changes Music Graph:
1. record the adapted rule in Music Graph;
2. explain why it applies here;
3. test it in Music Graph;
4. keep the sibling repository unchanged.
