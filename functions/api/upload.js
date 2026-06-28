import {
  validateServer,
  validateMagic,
  sanitizeName,
  PER_DEVICE_MAX_DEFAULT,
  TOTAL_MAX_DEFAULT,
} from "../_shared/validation.js";
import { writeCors, json } from "../_shared/http.js";
import { verifyPass } from "../_shared/pass.js";

export async function onRequestPost({ request, env }) {
  const cors = writeCors(env, request);

  if (!env.SLUB_BUCKET) {
    return json({ success: false, message: "Błąd konfiguracji serwera." }, 500, cors);
  }

  const contentType = request.headers.get("Content-Type") || "";
  if (!contentType.includes("multipart/form-data")) {
    return json({ success: false, message: "Nieprawidłowy typ żądania." }, 400, cors);
  }

  let formData;
  try {
    formData = await request.formData();
  } catch (e) {
    return json({ success: false, message: "Nie udało się odczytać pliku." }, 400, cors);
  }

  // Przepustka z Turnstile (jeśli skonfigurowany). Jedna przepustka = wiele plików.
  if (env.TURNSTILE_SECRET) {
    const payload = await verifyPass(env.TURNSTILE_SECRET, formData.get("pass"));
    if (!payload) {
      return json(
        {
          success: false,
          code: "pass",
          message: "Weryfikacja antyspamowa wygasła. Odśwież stronę i spróbuj ponownie.",
        },
        403,
        cors
      );
    }
  }

  const file = formData.get("file");
  if (!file || typeof file === "string") {
    return json({ success: false, message: "Nie przesłano pliku." }, 400, cors);
  }

  // 1) Walidacja metadanych
  const meta = validateServer(file);
  if (!meta.ok) {
    return json({ success: false, message: meta.message }, meta.status, cors);
  }

  // 2) Walidacja magic bytes (S-3)
  let head;
  try {
    head = new Uint8Array(await file.slice(0, 16).arrayBuffer());
  } catch (e) {
    return json({ success: false, message: "Nie udało się odczytać pliku." }, 400, cors);
  }
  const magic = validateMagic(head, meta.ext);
  if (!magic.ok) {
    return json({ success: false, message: magic.message }, magic.status, cors);
  }

  const guestName = sanitizeName(formData.get("guestName"));
  const deviceId = sanitizeName(formData.get("deviceId"), "unknown")
    .replace(/[^a-zA-Z0-9_-]/g, "")
    .slice(0, 40) || "unknown";

  // 3) Kontrola nadużyć: per-device cap + total ceiling (S-2)
  const perDeviceMax = Number(env.PER_DEVICE_MAX || PER_DEVICE_MAX_DEFAULT);
  const totalMax = Number(env.TOTAL_MAX || TOTAL_MAX_DEFAULT);
  try {
    const listed = await env.SLUB_BUCKET.list({
      prefix: "uploads/",
      include: ["customMetadata"],
      limit: 1000,
    });
    if (listed.objects.length >= totalMax) {
      return json(
        { success: false, message: "Galeria osiągnęła limit pojemności. Skontaktuj się z parą młodą." },
        429,
        cors
      );
    }
    const deviceCount = listed.objects.filter(
      (o) => o.customMetadata && o.customMetadata.deviceId === deviceId
    ).length;
    if (deviceCount >= perDeviceMax) {
      return json(
        { success: false, message: `Osiągnięto limit ${perDeviceMax} plików z tego urządzenia.` },
        429,
        cors
      );
    }
  } catch (e) {
    // Jeśli liczenie zawiedzie, nie blokujemy uploadu (soft-guard).
  }

  // S-5: klucz NIE zawiera deviceId (nie wyciekamy go w URL). deviceId w metadanych.
  const id = crypto.randomUUID();
  const objectKey = `uploads/${id}.${meta.ext}`;

  try {
    await env.SLUB_BUCKET.put(objectKey, file.stream(), {
      httpMetadata: { contentType: file.type || "application/octet-stream" },
      customMetadata: {
        guestName,
        kind: meta.kind,
        deviceId,
        uploadedAt: new Date().toISOString(),
      },
    });
  } catch (e) {
    return json({ success: false, message: "Nie udało się zapisać pliku." }, 500, cors);
  }

  return json(
    {
      success: true,
      key: objectKey,
      url: `/api/media/${objectKey}`,
      kind: meta.kind,
      message: "Przesłano.",
    },
    200,
    cors
  );
}

export function onRequestOptions({ request, env }) {
  return new Response(null, { headers: writeCors(env, request) });
}
