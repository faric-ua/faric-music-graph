# Blueprint застосунку

```mermaid
flowchart TD
  H[Home / Music Graph] --> G[Graph]
  H --> L[Library]
  H --> C[Channel]
  G --> I[Inspector]
  L --> A[Artist]
  A --> R[Release]
  R --> T[Track / Version]
  C --> S[Channel Snapshot]
  S --> D[Differences]
  D --> P[Write Preview — later]
```

Graph modes:
- повний граф;
- тільки виконавець;
- тільки альбом;
- рік → жанр → виконавець → реліз → трек;
- remix map;
- channel coverage.

Натискання на вузол відкриває inspector. Окрема дія ізолює гілку. Breadcrumb повертає вище без втрати фільтрів.

Перший Channel milestone — тільки читання: snapshot, inventory, match/missing/duplicate/review.

Кнопок, що змінюють канал, у read-only milestone немає.
