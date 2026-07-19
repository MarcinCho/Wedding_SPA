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
  text: "Elegancki / formalny",
  palette: [
    { name: "Fuksjowy", color: "#e72295" },
    { name: "Butelkowa zieleń", color: "#134e36" },
  ],
  note: "Panie prosimy o unikanie bieli oraz pudrowego różu.",
};

// Zakładka „O nas” — nasza historia (na podstawie „historia Klusek”).
export const about = {
  heading: "Nasza historia",
  // Historia w sekcjach: każda ma opcjonalny tytuł, akapity i opcjonalne punkty.
  story: [
    {
      title: "Początek pierdzi Gąsek.",
      paragraphs: [
        "Marcin wrócił do Polski zaledwie kilka tygodni wcześniej, w grudniu 2023 roku, po spędzeniu aż 10 lat w chłodnej Norwegii. Wychowywał się wraz z dwiema starszymi siostrami, Ewą i Kasią, doskonale wiedział, jak radzić sobie w życiu, ale powrót do kraju i tak był dla niego rewolucją. Ola z kolei miała za sobą zupełnie inne doświadczenia – jako jedyna dziewczyna z pięciorga rodzeństwa, wychowana z czterema braćmi, miała twardy charakter i jasno określone zdanie na każdy temat. Na przykład na temat miast. Dla Oli absolutnym numerem jeden na świecie był Andrychów. I choć przez rok mieszkała w Gdańsku – który uważa za drugie najładniejsze miasto zaraz po jej ukochanym Andrychowie – to w październiku 2023 roku spakowała walizki i wróciła w rodzinne strony.",
        "I tak, w ostatni wieczór roku 2024, oboje wylądowali na imprezie sylwestrowej organizowanej przez ich wspólnych znajomych, Dawida i Dominikę.",
      ],
    },
    {
      title: "Pierwsze wrażenie i różowy gin",
      paragraphs: [
        "Ola zapamiętała wejście Marcina idealnie: facet wkroczył na imprezę z butelką różowego ginu w dłoni, co od razu przykuło jej uwagę. Szybko jednak okazało się, że Marcin ma też inną, nieco bardziej „kombinatorską” stronę. Podczas gry w Wygibajtusa bezczelnie oszukiwał, co wywołało falę śmiechu i rzuciło na niego oko wszystkich zebranych.",
        "Marcin zapamiętał tę noc równie dobrze, choć z zupełnie innej perspektywy. Ola wydała mu się osobą uśmiechniętą, choć wcale nie nieśmiałą – od razu było widać, że nie brakuje jej charakteru. Wielkim zaskoczeniem było dla niego, gdy w pewnym momencie wieczoru zaczęła śpiewać. Nie obyło się też bez pierwszej przyjacielskiej sprzeczki: gdy Ola upierała się, że w Twistera – a jak kto woli, w Wygibajtusa – kontakt fizyczny jest niedozwolony, Marcin stanowczo się z nią nie zgadzał.",
        "Ale to nie wygibajtus ani różowy gin skradły serce Oli tej nocy. Nad ranem, gdy po noworocznym morsowaniu Ola trzęsła się z zimna, Marcin bez słowa poszedł do kuchni i zrobił dla niej ciepłą, idealną herbatę. To był mały gest, który zakorzenił się w jej pamięci głębiej, niż mogłoby się wydawać.",
      ],
    },
    {
      title: "Sycylijski przełom",
      paragraphs: [
        "Faktycznym początkiem znajomości był pomysł Dawida i Dominiki – jak na genialnych swatów przystało – na wspólny wyjazd na Sycylię. To miała być okazja, by cała paczka lepiej się poznała, ale dla Marcina i Oli stała się czymś znacznie więcej.",
        "Sycylia kojarzyła im się z potężną dawką adrenaliny – to tam wspólnie, ramię w ramię, zbiegali z samej Etny prosto w dół, czując pod stopami wulkaniczny pył i wolność. Jednak niedługo potem los spłatał Oli figla i na słonecznej wyspie dziewczyna się rozchorowała. Marcin nie odstępował jej wtedy na krok. Troszczył się o nią, dbał, by niczego jej nie brakowało, a na dowód tego, jak bardzo mu zależy, wstał z nią rano, by wspólnie – mimo jej osłabienia – obejrzeć magiczny sycylijski wschód słońca.",
        "W drodze powrotnej, na lotnisku, Ola postanowiła wykorzystać jedną ze słabości Marcina. Wiedząc, że chłopak nie znosi robić sobie zdjęć, rzuciła mu wyzwanie: „Przez najbliższe 365 dni masz mi codziennie wysyłać jeden powód, dla którego tak bardzo nie lubisz zdjęć”. Marcin, choć niechętnie, wyzwanie przyjął.",
      ],
    },
    {
      title: "Efekt karteczki i zdrowotny rosół",
      paragraphs: [
        "Marcin traktował słowo poważniej, niż Ola przypuszczała. Już następnego dnia po powrocie napisał do niej z pytaniem, jak się czuje po chorobie, a zaraz potem... wysłał pierwszą wiadomość z powodem, wywiązując się z umowy.",
        "Z czasem ich fotograficzny pakt ewoluował. Zasady zostały zmodyfikowane i stały się ich małym, codziennym rytuałem. Marcin miał po prostu wysyłać Oli swoje selfie, ale z jednym warunkiem – na zdjęciu musiał trzymać karteczkę z jakimś swoim przemyśleniem, złotą myślą lub żartem. Dzień po dniu ta nietypowa gra zbliżała ich do siebie coraz bardziej.",
        "W końcu nadszedł moment na oficjalną, pierwszą randkę. Marcin postanowił nie iść na łatwiznę i nie zabierać Oli do restauracji. Zamiast tego zaprosił ją do siebie. Znając jej słabość do ciepłych gestów po chorobie, sam ugotował dla niej pyszny, zdrowotny rosół. A żeby tradycji męskiej gościnności stało się zadość, na deser upiekł całą górę genialnych, słodkich ciastek.",
        "Ola, siedząc w jego kuchni, jedząc rosół i patrząc na chłopaka, który jeszcze niedawno oszukiwał w Wygibajtusa z różowym ginem w ręku, wiedziała jedno... to jest dopiero początek ich wspólnej historii.",
      ],
    },
    {
      title: "Rodzinny ogień i pierwsze deklaracje",
      paragraphs: [
        "Po paru tygodniach spotykania się nadszedł czas na ostateczny test: zapoznanie Marcina z rodziną Oli. Jako chłopak wychowany przez dwie siostry, Marcin wiedział, że do serca rodziny idzie się przez żołądek. Przygotował się po mistrzowsku – upiekł klasyczną szarlotkę oraz piękny, widowiskowy sernik z jednorożcem i polewą ze słonego karmelu.",
        "Gdy jednak rano wszedł do kuchni Oli, przeżył lekki szok. Zobaczyć na raz całą jej liczną rodzinkę, z czterema braćmi na czele, to było coś, na co nic nie mogło go w pełni przygotować! Mało tego – w ciągu tych samych świąt Marcin, chcąc nie chcąc, poznał chyba całą jej najbliższą rodzinę. Przetrwał to z wyróżnieniem. Nic dziwnego, że początkiem kwietnia 2024 roku przyszedł czas na oficjalne słowa i od tamtej pory zaczęli się już dumnie nazywać parą – chłopakiem i dziewczyną.",
        "Cały rok 2024 upłynął im na dalszym poznawaniu siebie i swoich rodzin. Działo się mnóstwo. Ola ambitnie parła do przodu: ukończyła kurs ratownika, a we wrześniu rozpoczęła studia podyplomowe. Marcin w tym czasie powoli układał sobie życie w kraju po dekadzie w Norwegii. Nie brakowało też podróży i... dramatów. Podczas odwiedzin rodziny w Leluchowie Marcin przeszedł tak poważny atak alergii, że Ola autentycznie bała się o jego życie – chłopak zapomniał wziąć ze sobą inhalatora! Na szczęście wszystko skończyło się dobrze. Później przyszedł czas na spokojniejszy wyjazd do Norwegii, gdzie odwiedzili jego siostrę Ewę oraz kuzynkę Oli – Anię.",
      ],
    },
    {
      title: "Tradycje, nowe gniazdko i alimenty na królika",
      paragraphs: [
        "Rok 2025 zaczął się niestety od smutnego akcentu – Ola musiała pożegnać swojego ukochanego dziadka Józka. Marcin był wtedy dla niej największym oparciem. Chwilę później przyszły jej urodziny, które spędzili wraz ze znajomymi nad Bałtykiem. To wtedy narodziła się ich mała tradycja: coroczny, styczniowy wyjazd nad polskie morze.",
        "W lutym świat ruszył z kopyta. Podjęli dorosłą decyzję – kredyt i zakup własnego mieszkania. Wybór mógł być tylko jeden: Andrychów. Okna ich nowego gniazdka wychodziły na piękne, zielone pola. Ola, pracując, mogła z zachwytem podziwiać pracę rolników i dziką przyrodę. Przeprowadzka miała jednak jeden mały minus. Ola nie mogła zabrać ze sobą swojego 13-letniego królika seniora. Zwierzak został u jej rodziców, a Ola śmiała się, że teraz co miesiąc płaci na niego „alimenty”. Kiedy nowe mieszkanie odwiedzali znajomi, najpopularniejszym prezentem parapetówkowym, jaki dostawali, była... kawa w doniczce.",
        "Najważniejszy moment roku nadszedł jednak w sierpniu. Bez zbędnego blasku fleszy, w domowym zaciszu, po zjedzeniu przepysznej carbonary, którą Marcin sam przygotował, chłopak wyciągnął pierścionek i zadał to kluczowe pytanie. Ola oczywiście powiedziała „TAK”.",
        "I wtedy się zaczęło... Weselny maraton logistyczny: rezerwacja sali, szukanie DJ-a, fotografa i dopinanie setek szczegółów.",
      ],
    },
    {
      title: "Przez Portugalię po triathlonowe emocje",
      paragraphs: [
        "Żeby nie było zbyt monotonnie, Marcin stwierdził, że planowanie ślubu to za mało i... zaczął studia informatyczne ze specjalizacją cyberbezpieczeństwo. Życie pędziło dalej: w międzyczasie zaliczyli kilka wesel znajomych, odwiedzili brata Oli w Danii, a w październiku ruszyli na legendarne Camino – przeszli piechotą 270 kilometrów z Porto do Santiago de Compostela.",
        "Ta droga nie oszczędzała Marcina. Najpierw buty potwornie obdarły mu stopy, a na pięcie pojawił się bąbel wielkości kciuka Oli. Gdy pięta jako tako się podgoiła, odezwało się kolano, a na koniec wjechało zwichnięcie kostki. Mimo strasznego bólu i deszczowej pogody, Marcin parł do przodu jak czołg. Mało tego – gdy na szlaku to Olę rozbolało kolano, bez wahania wziął jej plecak i niósł go obok swojego.",
        "Pod koniec 2025 roku, za namową Bogusi, postanowili rzucić sobie kolejne wyzwanie: start w sztafetowym triathlonie, ale w dwóch oddzielnych, rywalizujących ekipach!",
      ],
      bullets: [
        "Team Oli: Ola (2 km pływania), Bogusia (90 km roweru) i Bartek z pracy (22 km biegu).",
        "Team Marcina: Marcin (90 km roweru), Dawid (bieg) i jego przyszły teść (pływanie).",
      ],
    },
    {
      title: "Rok 2026: odliczanie i wielki finał",
      paragraphs: [
        "I tak oto nastał rok 2026. Do ślubu zostało zaledwie 9 miesięcy! Przygotowania szły pełną parą: kurs przedmałżeński zaliczony, zimowa sesja na studiach zdana. Od semestru letniego Marcin musiał poświęcać nauce coraz więcej czasu, lawirując między obowiązkami, weselami szwagra Kuby, dyplomami Wojtka, zawożeniem Antoniego na obozy i pomaganiem siostrze Kasi.",
        "Ola w przerwach od ślubnego szaleństwa zorganizowała genialną wycieczkę do Antalyi na tureckie wesele Kuby, spędzała czas z przyjaciółkami i na nowo odkryła magię „leżakowania na kanapie”. W międzyczasie trenowała do triathlonu, chodząc z tatą na basen, oraz uczyła się od mamy trudnej sztuki opieki nad domowymi kwiatkami. Wybór świadków na ślub był dla obojga oczywisty: Marcin postawił na swojego niezawodnego przyjaciela Dawida, a Ola na brata Kubę.",
        "Wreszcie nadszedł wyczekiwany 12 lipca 2026 roku – dzień triathlonu. Emocje sięgały zenitu! Dzięki potężnemu dopingowi Jagody, Justyny i Dominiki obie ekipy poszły jak burza, kończąc zawody z czasami lepszymi, niż ktokolwiek zakładał. Marcin na rowerze zszedł poniżej spektakularnych 3 godzin, a Ola przepłynęła swój dystans w niesamowite 34 minuty!",
        "Po sportowych emocjach przyszedł czas na ostatnie, wakacyjne szlify przedślubne. Życie oczywiście musiało dorzucić trochę niepewności – w pracy Oli odszedł kierownik, zostawiając wielką niewiadomą co do przyszłości zawodowej. Ale oni nie mieli czasu się tym martwić. Powstała ślubna strona internetowa, zaliczyli ostatnie odwiedziny na sali, dograli szczegóły z wykonawcami i...",
        "Nadszedł ten dzień. 12 września 2026 roku. Pora odetchnąć, założyć obrączki, wyjść na parkiet i z uśmiechem czekać na wszystko, co jeszcze przyniesie im wspólne życie.",
      ],
    },
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
