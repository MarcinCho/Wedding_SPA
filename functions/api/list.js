import { readCors, json } from "../_shared/http.js";

export async function onRequestGet({ env }) {
  const cors = readCors();
  if (!env.SLUB_BUCKET) {
    return json({ items: [], message: "Błąd konfiguracji serwera." }, 500, cors);
  }

  try {
    const list = await env.SLUB_BUCKET.list({
      prefix: "uploads/",
      include: ["customMetadata"],
      limit: 1000,
    });

    // S-5: minimalny payload — bez deviceId, bez rozmiaru wewnętrznego.
    const items = list.objects
      .map((obj) => ({
        url: `/api/media/${obj.key}`,
        guestName: obj.customMetadata?.guestName || "",
        kind:
          obj.customMetadata?.kind ||
          (/\.(mp4|mov)$/i.test(obj.key) ? "video" : "image"),
        uploaded: obj.uploaded,
      }))
      .sort((a, b) => new Date(b.uploaded) - new Date(a.uploaded))
      // klucz porządkowy do v-for, bez ujawniania deviceId
      .map((it, i) => ({ id: i, ...it }));

    return json({ items, count: items.length }, 200, cors);
  } catch (e) {
    return json({ items: [], message: "Nie udało się wczytać listy." }, 500, cors);
  }
}

export function onRequestOptions() {
  return new Response(null, { headers: readCors() });
}
