# FARIC Music Graph

Єдиний репозиторій для музичного каталогу, дослідження виконавців, візуального графа та майбутнього керування YouTube/YouTube Music каналом **@faric_ua**.

**Нова assistant-сесія починає з [START_HERE_ASSISTANT.md](START_HERE_ASSISTANT.md).**

## Початковий каталог

- The Prodigy
- Linkin Park

Підготовлений seed: **88 release/list entities** та **863 normalized track-title entities**. Повний seed буде перенесений окремою перевіреною data migration у межах v0.1.0.

## Головна ідея

```text
Рік → Жанр → Виконавець → Реліз → Трек
                              ↘ Remix / Live / Demo / Edit
                               ↘ YouTube / YTM item
```

Це **не жорстка файлова ієрархія**. Рік, жанр, виконавець, реліз, тип версії та стан каналу — фасети одного графа.

## Канал

Target: `https://music.youtube.com/@faric_ua`

Перший етап інтеграції — **read-only audit**. Будь-які майбутні зміни каналу тільки через:

`preview → explicit confirmation → write → read-after-write verification → audit`.

## Технологічний напрям

Спочатку web/PWA:
- TypeScript;
- React + Vite;
- Graphology + Sigma.js;
- IndexedDB;
- Playwright + Vitest.

Версії залежностей перевіряються перед scaffold, а не копіюються зі старих проєктів.

Android package розглядається після прийняття web/PWA; перший кандидат — Capacitor. Kotlin/Compose — лише якщо з'явиться конкретна native-only вимога.

## Termux

Music Graph — **окремий** від Renault/YTM repository.

Live checkout:

`$HOME/faric-music-graph`

Shared data:

`/storage/emulated/0/Documents/FARIC-Music-Graph/`

Після clone:

```bash
cd "$HOME/faric-music-graph"
bash tools/install_termux_aliases.sh
bash tools/install_termux_widget.sh
source ~/.bashrc 2>/dev/null || true
music-menu
```

Termux:Widget shortcut називається **Music Graph**. Після installer натиснути Refresh у Widget.

Повна інструкція: `docs/ua/TERMUX_SETUP.md`.

## Документація

- `CURRENT_HANDOFF.md` — точка продовження;
- `PROJECT_STATUS.md` — поточний стан;
- `BACKLOG.md` — roadmap;
- `OPEN_FINDINGS.md` — відкриті findings;
- `docs/assistant-kit/` — стабільні contracts;
- `docs/v.*` — release/QA history;
- `docs/catalog/` — knowledge notes по виконавцях;
- `docs/WORKFLOW_LESSONS.md` — уроки, які не можна втрачати;
- `docs/ua/TERMUX_SETUP.md` — setup/menu/widget.

## Поточний milestone

**v0.1.0 — repository/contracts/graph foundation.**

No remote YouTube write belongs to v0.1.0.
