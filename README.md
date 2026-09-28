# FARIC Music Graph

Єдиний репозиторій для музичного каталогу, багаторівневого 3D-графа та майбутнього керування YouTube/YouTube Music акаунтами/каналами.

**Нова assistant-сесія починає з [START_HERE_ASSISTANT.md](START_HERE_ASSISTANT.md).**

## Кінцевий продукт

Кінцева користувацька форма — **signed Android APK**.

Web/PWA використовується як швидкий development/debug harness для графа, фільтрів і data model, але не є кінцевою ціллю продукту.

## Основна UX-модель

**Nested 3D Worlds**:

```text
Universe
  → Account
    → Year
      → Genre
        → Artist
          → Release / Album
            → Track
              → complete known details / IDs / URLs / provenance
```

Це навігаційна проєкція над канонічним графом, а не жорстка папкова структура.

На кожному рівні:
- 3D world показує лише релевантний контекст;
- є contextual filters;
- є floating node-control palette;
- Expand/Collapse не змінюють scope;
- Enter/Back змінюють scope;
- breadcrumb показує точне місце.

Повний контракт: `docs/product/PRODUCT_VISION.md`.

## Фільтри

На телефоні фільтри відкриваються окремим adaptive panel:
- один вертикальний стовпчик;
- portrait: bottom sheet приблизно 45–55% висоти;
- landscape/tablet: side sheet приблизно 40–50% ширини;
- scrollable body;
- fixed footer `Скинути / Застосувати`.

За замовчуванням фільтри редагуються як draft і застосовуються тільки після `Застосувати`. Live/debounced режим можливий пізніше після вимірювання продуктивності.

## Node controls

Постійна напівпрозора floating panel:
- Expand all;
- Collapse all;
- Expand selected;
- Collapse selected;
- Enter;
- Back;
- Home;
- Fit.

Tap по node = select/focus, а не автоматичний drill-in.

## Дані

Підготовлений початковий seed:
- The Prodigy;
- Linkin Park;
- 88 release/list entities;
- 863 normalized track-title entities.

Канонічний graph зберігає many-to-many relationships, Track vs TrackVersion, provenance та external IDs.

## YouTube / YTM safety

Remote write не належить до раннього етапу:

`inventory → match → preview → explicit confirmation → write → read-after-write verification → audit`.

## Android

APK delivery contract:
`docs/android/APK_DELIVERY_CONTRACT.md`.

Music Graph матиме власний signing identity. YTM/Renault signing material не перевикористовується.

## Документація

- `CURRENT_HANDOFF.md` — точка продовження;
- `ACTIVE_PLAN.md` — живий TODO;
- `docs/product/PRODUCT_VISION.md` — канонічний product contract;
- `docs/architecture/NESTED_3D_WORLDS.md` — state/projection/navigation architecture;
- `docs/design/MOBILE_UI_BLUEPRINT.md` — mobile UI;
- `docs/android/APK_DELIVERY_CONTRACT.md` — фінальний APK workflow;
- `docs/assistant-kit/` — reusable contracts;
- `docs/v.*` — історія релізів/QA/діаграми.

## Termux

Live checkout:
`$HOME/faric-music-graph`

Shared data/artifacts:
`/storage/emulated/0/Documents/FARIC-Music-Graph/`
