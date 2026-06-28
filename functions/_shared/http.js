// Wspólne helpery HTTP/CORS dla Pages Functions.

// CORS dla endpointów ODCZYTU (media, list) — publiczne, więc "*".
export function readCors() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

// CORS dla endpointów ZAPISU (upload, delete).
// S-7: jeśli ustawiono env.ALLOWED_ORIGIN, ograniczamy do origin witryny;
// w przeciwnym razie (faza testowa) dopuszczamy "*".
export function writeCors(env, request, methods = "POST, OPTIONS") {
  const allowed = env && env.ALLOWED_ORIGIN ? env.ALLOWED_ORIGIN : "";
  const origin = request ? request.headers.get("Origin") || "" : "";
  let allowOrigin = "*";
  if (allowed) {
    const list = allowed.split(",").map((s) => s.trim()).filter(Boolean);
    allowOrigin = list.includes(origin) ? origin : list[0] || "null";
  }
  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Vary": "Origin",
    "Access-Control-Allow-Methods": methods,
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

export function json(body, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...extraHeaders, "Content-Type": "application/json" },
  });
}
