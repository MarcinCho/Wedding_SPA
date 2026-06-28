import { writeCors, json } from "../_shared/http.js";

function esc(s) {
  return String(s == null ? "" : s).replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );
}
function clean(s, max) {
  return String(s == null ? "" : s)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, " ")
    .trim()
    .slice(0, max);
}

export async function onRequestPost({ request, env }) {
  const cors = writeCors(env, request);

  let body;
  try {
    body = await request.json();
  } catch (e) {
    return json({ error: "Nieprawidłowe żądanie." }, 400, cors);
  }

  // Honeypot — boty wypełniają ukryte pole; udajemy sukces, nic nie wysyłamy.
  if (body.website) {
    return json({ success: true }, 200, cors);
  }

  const name = clean(body.name, 120);
  if (!name) {
    return json({ error: "Imię i nazwisko jest wymagane." }, 400, cors);
  }
  let guestCount = parseInt(body.guestCount, 10);
  if (!Number.isFinite(guestCount) || guestCount < 1) guestCount = 1;
  if (guestCount > 50) guestCount = 50;
  const attending =
    String(body.attending) === "Nie" ? "Nie będę" : "Będę";
  const comment = clean(body.comment, 1000);

  if (!env.RESEND_API_KEY) {
    return json({ error: "Błąd konfiguracji serwera (brak klucza e-mail)." }, 500, cors);
  }

  const from = env.RESEND_FROM || "onboarding@resend.dev";
  const to = env.RSVP_TO || "marcin.chowaniec@outlook.com";

  const html = `
    <h2 style="font-family:Georgia,serif;color:#be185d;">Nowe potwierdzenie (RSVP)</h2>
    <p><strong>Gość / Goście:</strong> ${esc(name)}</p>
    <p><strong>Obecność:</strong> ${esc(attending)}</p>
    <p><strong>Liczba osób:</strong> ${esc(guestCount)}</p>
    <p><strong>Komentarz:</strong> ${esc(comment) || "—"}</p>
  `;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from,
        to,
        reply_to: env.RSVP_TO || undefined,
        subject: `Wesele RSVP: ${name} (${attending}, ${guestCount} os.)`,
        html,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      return json({ error: "Nie udało się wysłać potwierdzenia." }, 502, cors);
    }
    return json({ success: true }, 200, cors);
  } catch (e) {
    return json({ error: "Błąd sieci. Spróbuj ponownie." }, 502, cors);
  }
}

export function onRequestOptions({ request, env }) {
  return new Response(null, { headers: writeCors(env, request) });
}
