// ============================================================
// Treści strony. Przeniesione z wersji produkcyjnej (folder main/ + test/).
// Pozycje [DO_WYPEŁNIENIA] (hashtag, dress code, „O nas") nie istniały w starej
// wersji — uzupełnij je później.
// ============================================================

export const couple = {
  bride: "Ola",
  groom: "Marcin",
  // Format ISO — wykorzystywany przez licznik odliczający
  weddingDate: "2026-09-12T16:00:00",
  // Wyświetlana data
  weddingDateLabel: "Sobota, 12 września 2026",
  // Brak hashtagu w starej wersji — uzupełnij lub zostaw pusty (nie wyświetli się).
  hashtag: "",
};

export const hero = {
  greeting: "Kochani!",
  intro: "Mamy dla Was najwspanialszą informację tego roku! ❤️",
  subtitle:
    "Z ogromną radością chcielibyśmy zaprosić Was do wspólnego świętowania dnia, w którym powiemy sobie TAK! Będzie nam niezmiernie miło, jeśli zechcecie towarzyszyć nam w tym wyjątkowym momencie.",
};

// Zakładka „Co i gdzie”
export const schedule = [
  {
    time: "16:00",
    title: "Ceremonia ślubna",
    description:
      "Powiemy sobie „TAK”. Prosimy o przybycie kilka minut wcześniej.",
    place: "Kościół św. Macieja Apostoła w Andrychowie",
  },
  {
    time: "po ceremonii",
    title: "Przyjęcie weselne",
    description:
      "Huczne przyjęcie weselne — świętujemy i tańczymy do białego rana! 💃🕺",
    place: "Restauracja na Starym Tartaku",
  },
];

export const locations = [
  {
    name: "Kościół św. Macieja Apostoła",
    address: "Andrychów",
    // Zapytanie do mapy (Google Maps embed)
    mapQuery: "Kościół św. Macieja Apostoła w Andrychowie",
    note: "Ceremonia rozpoczyna się o 16:00.",
  },
  {
    name: "Restauracja na Starym Tartaku",
    address: "Andrychów i okolice",
    mapQuery: "Restauracja na Starym Tartaku Andrychów",
    note: "Przyjęcie weselne po ceremonii.",
  },
];

export const dressCode = {
  title: "Dress code",
  // Brak w starej wersji — uzupełnij (np. „elegancki / formalny”).
  text: "[DO_WYPEŁNIENIA: np. elegancki / formalny]",
  palette: [
    { name: "Pudrowy róż", color: "#fbcfe8" },
    { name: "Lila", color: "#dbb5d6" },
    { name: "Śliwka", color: "#9d174d" },
  ],
  note: "Panie prosimy o unikanie bieli. Sugerujemy odcienie z naszej palety.",
};

// Zakładka „O nas” — w starej wersji była „in progress”, więc placeholder.
export const about = {
  heading: "Nasza historia",
  paragraphs: [
    "Naszą historię opowiemy Wam już niedługo — zaglądajcie tu od czasu do czasu. 🤍",
  ],
  // Opcjonalne zdjęcie pary — wrzuć plik do src/assets/img/ i podaj nazwę
  photo: null,
};

// Zakładka „Galeria gości”
export const gallery = {
  heading: "Galeria gości",
  intro:
    "Pomóżcie nam uwiecznić ten dzień! Wrzućcie tutaj swoje zdjęcia i filmy z wesela.",
  // Wspólny album Google Photos na dłuższe filmy / dodatkowe materiały.
  // Wklej link do albumu z włączoną współpracą; pusty = przycisk się nie pokaże.
  photosAlbumUrl: "https://photos.app.goo.gl/y1azZTXm9wkL3nUW8",
  // Cloudflare Turnstile (ochrona antyspamowa formularza). Wklej SITE KEY z panelu
  // Cloudflare → Turnstile. Pozostaw pusty, by wyłączyć widget. Sekret (SECRET KEY)
  // ustaw osobno jako secret Pages: TURNSTILE_SECRET — NIGDY w kodzie.
  turnstileSiteKey: "0x4AAAAAADsQ3hdzVnZKSNiY",
};
