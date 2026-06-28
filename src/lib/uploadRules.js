// ============================================================
// Wspólne reguły walidacji uploadu (klient i serwer korzystają z tych samych).
// Limity wg specyfikacji: max 50 MB / plik; typy: jpg, png, heic, mp4, mov.
// Pliki > 50 MB: odrzucane z komunikatem kierującym na Google Drive (opcja A).
// ============================================================

export const MAX_FILE_BYTES = 50 * 1024 * 1024; // 50 MB

export const ALLOWED = {
  jpg: ["image/jpeg"],
  jpeg: ["image/jpeg"],
  png: ["image/png"],
  heic: ["image/heic", "image/heif", ""],
  mp4: ["video/mp4"],
  mov: ["video/quicktime", "video/mov", ""],
};

export const ALLOWED_EXT = Object.keys(ALLOWED);

// Wartość dla atrybutu accept w <input type="file">
export const ACCEPT_ATTR = [
  ".jpg",
  ".jpeg",
  ".png",
  ".heic",
  ".mp4",
  ".mov",
  "image/jpeg",
  "image/png",
  "image/heic",
  "video/mp4",
  "video/quicktime",
].join(",");

export function getExtension(name = "") {
  const m = String(name).toLowerCase().match(/\.([a-z0-9]+)$/);
  return m ? m[1] : "";
}

/**
 * Waliduje plik. Zwraca { ok: true, ext, kind } albo { ok: false, code, message }.
 * code === "size" oznacza plik > 50 MB — UI pokaże wtedy odnośnik do Google Drive.
 * Działa zarówno z obiektem File (przeglądarka), jak i z { name, size, type }.
 */
export function validateFile(file) {
  if (!file) {
    return { ok: false, code: "missing", message: "Nie wybrano pliku." };
  }

  const ext = getExtension(file.name);
  if (!ALLOWED_EXT.includes(ext)) {
    return {
      ok: false,
      code: "ext",
      message: `Niedozwolony format „.${ext || "?"}”. Akceptujemy: jpg, png, heic, mp4, mov.`,
    };
  }

  const type = (file.type || "").toLowerCase();
  const allowedTypes = ALLOWED[ext];
  if (type && allowedTypes && !allowedTypes.includes(type)) {
    return {
      ok: false,
      code: "type",
      message: `Typ pliku (${type}) nie pasuje do rozszerzenia „.${ext}”.`,
    };
  }

  if (typeof file.size === "number" && file.size > MAX_FILE_BYTES) {
    const mb = (file.size / (1024 * 1024)).toFixed(1);
    return {
      ok: false,
      code: "size",
      message: `Ten plik jest za duży (${mb} MB). Maksymalny rozmiar to 50 MB.`,
    };
  }

  if (typeof file.size === "number" && file.size === 0) {
    return { ok: false, code: "empty", message: "Plik jest pusty." };
  }

  return { ok: true, ext, kind: ext === "mp4" || ext === "mov" ? "video" : "image" };
}

export function humanSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
