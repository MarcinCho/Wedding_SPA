import { writeCors, json } from "../_shared/http.js";
import { isSafeKey } from "../_shared/validation.js";

// Moderacja: usuwanie obiektów. Wymaga nagłówka:
//   Authorization: Bearer <ADMIN_TOKEN>
// Endpoint jest WYŁĄCZONY, dopóki nie ustawisz sekretu ADMIN_TOKEN
// (npx wrangler pages secret put ADMIN_TOKEN --project-name test-slub).
export async function onRequestPost({ request, env }) {
  const cors = writeCors(env, request, "POST, OPTIONS");

  if (!env.ADMIN_TOKEN) {
    return json({ success: false, message: "Moderacja nieaktywna." }, 403, cors);
  }

  const auth = request.headers.get("Authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  // porównanie stałoczasowe (proste, bez early-exit na długości)
  if (!token || token.length !== env.ADMIN_TOKEN.length || token !== env.ADMIN_TOKEN) {
    return json({ success: false, message: "Brak autoryzacji." }, 401, cors);
  }

  if (!env.SLUB_BUCKET) {
    return json({ success: false, message: "Błąd konfiguracji serwera." }, 500, cors);
  }

  let body;
  try {
    body = await request.json();
  } catch (e) {
    return json({ success: false, message: "Nieprawidłowe żądanie." }, 400, cors);
  }

  const key = body && body.key;
  if (!isSafeKey(key)) {
    return json({ success: false, message: "Nieprawidłowy klucz." }, 400, cors);
  }

  try {
    await env.SLUB_BUCKET.delete(key);
  } catch (e) {
    return json({ success: false, message: "Nie udało się usunąć." }, 500, cors);
  }

  return json({ success: true, message: "Usunięto." }, 200, cors);
}

export function onRequestOptions({ request, env }) {
  return new Response(null, { headers: writeCors(env, request, "POST, OPTIONS") });
}
