// Reguły walidacji i bezpieczeństwa po stronie serwera (Pages Functions).
// Pliki _* nie są routami.

export const MAX_FILE_BYTES = 50 * 1024 * 1024; // 50 MB

// Limity nadużyć (możliwe nadpisanie przez env w upload.js)
export const PER_DEVICE_MAX_DEFAULT = 500; // plików na deviceId (weselny gość może wrzucić dużo)
export const TOTAL_MAX_DEFAULT = 20000; // obiektów w bucketcie

// Bezpieczne, jawne typy serwowane (S-4). Brak application/octet-stream / "".
export const SAFE_CONTENT_TYPE = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  heic: "image/heic",
  mp4: "video/mp4",
  mov: "video/quicktime",
};

export const ALLOWED = {
  jpg: ["image/jpeg"],
  jpeg: ["image/jpeg"],
  png: ["image/png"],
  heic: ["image/heic", "image/heif", ""],
  mp4: ["video/mp4"],
  mov: ["video/quicktime", "video/mov", ""],
};

export const EXT_BY_TYPE = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/heic": "heic",
  "image/heif": "heic",
  "video/mp4": "mp4",
  "video/quicktime": "mov",
};

export function getExtension(name = "") {
  const m = String(name).toLowerCase().match(/\.([a-z0-9]+)$/);
  return m ? m[1] : "";
}

// Walidacja metadanych (nazwa/typ/rozmiar) — bez treści.
export function validateServer(file) {
  if (!file || typeof file.size !== "number") {
    return { ok: false, status: 400, message: "Brak pliku." };
  }
  if (file.size === 0) {
    return { ok: false, status: 400, message: "Plik jest pusty." };
  }
  if (file.size > MAX_FILE_BYTES) {
    return {
      ok: false,
      status: 413,
      message: "Plik jest za duży. Maksymalny rozmiar to 50 MB.",
    };
  }

  let ext = getExtension(file.name);
  const type = (file.type || "").toLowerCase();
  if (!ext && EXT_BY_TYPE[type]) ext = EXT_BY_TYPE[type];

  if (!ALLOWED[ext]) {
    return {
      ok: false,
      status: 415,
      message: "Niedozwolony format. Akceptujemy: jpg, png, heic, mp4, mov.",
    };
  }
  if (type && !ALLOWED[ext].includes(type)) {
    return { ok: false, status: 415, message: "Typ pliku nie pasuje do rozszerzenia." };
  }

  const normExt = ext === "jpeg" ? "jpg" : ext;
  const kind = normExt === "mp4" || normExt === "mov" ? "video" : "image";
  return { ok: true, ext: normExt, kind };
}

/**
 * Walidacja "magic bytes" (S-3). `head` to Uint8Array z pierwszych >=16 bajtów.
 * Zwraca { ok:true } albo { ok:false, status, message }.
 */
export function validateMagic(head, ext) {
  if (!head || head.length < 12) {
    return { ok: false, status: 400, message: "Nie udało się odczytać pliku." };
  }
  const b = head;
  const isJpeg = b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff;
  const isPng =
    b[0] === 0x89 &&
    b[1] === 0x50 &&
    b[2] === 0x4e &&
    b[3] === 0x47 &&
    b[4] === 0x0d &&
    b[5] === 0x0a &&
    b[6] === 0x1a &&
    b[7] === 0x0a;
  // ISO-BMFF (mp4 / mov / heic): bajty 4..8 == "ftyp"
  const isFtyp =
    b[4] === 0x66 && b[5] === 0x74 && b[6] === 0x79 && b[7] === 0x70;
  const brand = String.fromCharCode(b[8], b[9], b[10], b[11]).toLowerCase();
  const heicBrands = ["heic", "heix", "hevc", "heim", "heis", "mif1", "msf1", "heif"];

  let actual = null;
  if (isJpeg) actual = "jpg";
  else if (isPng) actual = "png";
  else if (isFtyp) actual = heicBrands.includes(brand) ? "heic" : "video"; // mp4/mov

  const expect =
    ext === "mp4" || ext === "mov" ? "video" : ext === "jpeg" ? "jpg" : ext;

  if (actual === null) {
    return { ok: false, status: 415, message: "Nie rozpoznano zawartości pliku." };
  }
  if (actual !== expect) {
    return {
      ok: false,
      status: 415,
      message: "Zawartość pliku nie odpowiada jego rozszerzeniu.",
    };
  }
  return { ok: true };
}

// Sanitacja nazwy gościa (S-6): usuń znaki sterujące/nowe linie, przytnij.
export function sanitizeName(raw, fallback = "Gość") {
  const s = String(raw || "")
    // usuń znaki sterujące (w tym \n, \r, \t)
    .replace(/[\x00-\x1F\x7F]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80);
  return s || fallback;
}

// Bezpieczny klucz: tylko prefiks uploads/, bez wyjścia w górę.
export function isSafeKey(key) {
  return (
    typeof key === "string" &&
    key.startsWith("uploads/") &&
    !key.includes("..") &&
    !key.includes("//")
  );
}
