import { writeCors, json } from "../_shared/http.js";
import { signPass } from "../_shared/pass.js";

async function verifyTurnstile(env, token, ip) {
  if (!token) return false;
  const body = new FormData();
  body.append("secret", env.TURNSTILE_SECRET);
  body.append("response", token);
  if (ip) body.append("remoteip", ip);
  try {
    const r = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      { method: "POST", body }
    );
    const data = await r.json();
    return !!data.success;
  } catch (e) {
    return false;
  }
}

export async function onRequestPost({ request, env }) {
  const cors = writeCors(env, request);

  // Jeśli Turnstile wyłączony — przepustka nie jest potrzebna.
  if (!env.TURNSTILE_SECRET) {
    return json({ ok: true, required: false }, 200, cors);
  }

  let body;
  try {
    body = await request.json();
  } catch (e) {
    body = {};
  }
  const token = body && body.token;
  const ip = request.headers.get("CF-Connecting-IP") || "";

  const ok = await verifyTurnstile(env, token, ip);
  if (!ok) {
    return json(
      { ok: false, message: "Weryfikacja nie powiodła się. Odśwież i spróbuj ponownie." },
      403,
      cors
    );
  }

  const { pass, exp } = await signPass(env.TURNSTILE_SECRET);
  return json({ ok: true, required: true, pass, exp }, 200, cors);
}

export function onRequestOptions({ request, env }) {
  return new Response(null, { headers: writeCors(env, request) });
}
