// Krótkotrwała "przepustka" do uploadu, podpisana HMAC-SHA256.
// Pozwala rozwiązać Turnstile RAZ i wysłać wiele plików w oknie czasowym.
// Klucz podpisu = sekret serwera (przekazywany z env). Stateless (bez KV).

const enc = new TextEncoder();

function b64url(bytes) {
  let s = btoa(String.fromCharCode(...new Uint8Array(bytes)));
  return s.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function b64urlToBytes(str) {
  const s = str.replace(/-/g, "+").replace(/_/g, "/");
  const pad = s.length % 4 ? "=".repeat(4 - (s.length % 4)) : "";
  const bin = atob(s + pad);
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}

async function hmac(secret, data) {
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  return crypto.subtle.sign("HMAC", key, enc.encode(data));
}

// Tworzy przepustkę ważną przez ttlMs (domyślnie 45 min).
export async function signPass(secret, ttlMs = 45 * 60 * 1000) {
  const payload = { exp: Date.now() + ttlMs, n: b64url(crypto.getRandomValues(new Uint8Array(8))) };
  const body = b64url(enc.encode(JSON.stringify(payload)));
  const sig = b64url(await hmac(secret, body));
  return { pass: `${body}.${sig}`, exp: payload.exp };
}

// Weryfikuje przepustkę. Zwraca payload albo null.
export async function verifyPass(secret, token) {
  if (!token || typeof token !== "string" || !token.includes(".")) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  let expected;
  try {
    expected = b64url(await hmac(secret, body));
  } catch (e) {
    return null;
  }
  // porównanie stałoczasowe
  if (sig.length !== expected.length) return null;
  let diff = 0;
  for (let i = 0; i < sig.length; i++) diff |= sig.charCodeAt(i) ^ expected.charCodeAt(i);
  if (diff !== 0) return null;

  let payload;
  try {
    payload = JSON.parse(new TextDecoder().decode(b64urlToBytes(body)));
  } catch (e) {
    return null;
  }
  if (!payload || typeof payload.exp !== "number" || payload.exp < Date.now()) return null;
  return payload;
}
