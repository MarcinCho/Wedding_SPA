# Paleta i tokeny — wyodrębnione 1:1 ze starego projektu

Źródła: `main/index.html`, `main/src/style.css`, `main/src/components/*.vue`,
`test/src/components/*.vue`. Poniżej dokładne wartości użyte w nowym projekcie
(`app/src/style.css`, sekcja `@theme`).

## Tło i tekst (z `<body>`: `bg-linear-65 from-purple-100 to-pink-100 text-gray-800`)

| Token            | HEX       | Pochodzenie (Tailwind) |
| ---------------- | --------- | ---------------------- |
| `--color-bg-from`| `#f3e8ff` | purple-100 (gradient)  |
| `--color-bg-to`  | `#fce7f3` | pink-100 (gradient)    |
| `--color-ink`    | `#1f2937` | gray-800 (tekst)       |

Gradient: `linear-gradient(65deg, #f3e8ff 0%, #fce7f3 100%)`.

## Akcenty różowe (skala pink użyta w komponentach)

| Token              | HEX       | Tailwind |
| ------------------ | --------- | -------- |
| `--color-blush-50` | `#fdf2f8` | pink-50  |
| `--color-blush-100`| `#fce7f3` | pink-100 |
| `--color-blush-200`| `#fbcfe8` | pink-200 |
| `--color-blush-300`| `#f9a8d4` | pink-300 |
| `--color-blush-400`| `#f472b6` | pink-400 |
| `--color-blush-500`| `#ec4899` | pink-500 |
| `--color-blush-600`| `#db2777` | pink-600 |
| `--color-blush-700`| `#be185d` | pink-700 |
| `--color-blush-800`| `#9d174d` | pink-800 |

## Odcienie specjalne (literalne wartości z kodu źródłowego)

| Token               | HEX        | Pochodzenie                                |
| ------------------- | ---------- | ------------------------------------------ |
| `--color-orchid`    | `#9333ea`  | purple-600 (akcenty gradientów w `test/`)  |
| `--color-mauve`     | `#dbb5d6`  | `#dbb5d679` z `RSVPForm.vue` (bez alfa)     |
| `--color-plum`      | `#140712`  | `.time-value` z `CountdownComp.vue`        |
| `--color-plum-soft` | `#121111`  | `.time-label` z `CountdownComp.vue`        |
| `--color-tint-1`    | `#fffbfb`  | miękkie tło z `test/`                       |
| `--color-tint-2`    | `#fff5f6`  | miękkie tło z `test/`                       |
| `--color-tint-3`    | `#ffeef1`  | miękkie tło z `test/`                       |
| `--color-ok-bg`     | `#e6ffe6`  | tło sukcesu z `RSVPForm.vue`               |
| `--color-err-bg`    | `#ffe6e6`  | tło błędu z `RSVPForm.vue`                 |

## Typografia (zachowane pliki fontów marki)

- Nagłówki: **Cinzel** (`--font-cinzel: "Cinzel", serif`) — `src/assets/fonts/Cinzel.ttf`
- Ozdobny skrypt: **Amsterdam** (`--font-amsterdam: "Amsterdam", cursive`) — `src/assets/fonts/Amsterdam.ttf`

Pliki `.ttf` to assety marki przeniesione 1:1; cały kod/komponenty napisano od zera.
