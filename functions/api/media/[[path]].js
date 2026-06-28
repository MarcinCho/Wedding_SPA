import { readCors } from "../../_shared/http.js";
import { SAFE_CONTENT_TYPE, getExtension, isSafeKey } from "../../_shared/validation.js";

export async function onRequestGet({ env, params }) {
  const cors = readCors();

  if (!env.SLUB_BUCKET) {
    return new Response("Server Configuration Error", { status: 500, headers: cors });
  }
  if (!params.path || params.path.length === 0) {
    return new Response("Not Found", { status: 404, headers: cors });
  }

  const objectKey = params.path.map((p) => decodeURIComponent(p)).join("/");

  // Tylko prefiks uploads/, bez wyjścia w górę (S-4 / path-traversal)
  if (!isSafeKey(objectKey)) {
    return new Response("Forbidden", { status: 403, headers: cors });
  }

  const object = await env.SLUB_BUCKET.get(objectKey);
  if (object === null) {
    return new Response("Not Found", { status: 404, headers: cors });
  }

  // S-4: wymuszamy bezpieczny, jawny Content-Type wg rozszerzenia.
  const ext = getExtension(objectKey);
  const safeType = SAFE_CONTENT_TYPE[ext] || "application/octet-stream";
  const fileName = objectKey.split("/").pop() || "plik";

  const headers = new Headers(cors);
  headers.set("etag", object.httpEtag);
  headers.set("Cache-Control", "public, max-age=31536000, immutable");
  headers.set("Content-Type", safeType);
  headers.set("X-Content-Type-Options", "nosniff");
  // Wyświetlamy inline, ale z jawną nazwą i bez interpretacji jako dokument.
  headers.set("Content-Disposition", `inline; filename="${fileName}"`);

  return new Response(object.body, { headers, status: 200 });
}

export function onRequestOptions() {
  return new Response(null, { headers: readCors() });
}
