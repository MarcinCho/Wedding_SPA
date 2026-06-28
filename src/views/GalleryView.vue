<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import { gallery } from "../data/site.js";
import SectionTitle from "../components/SectionTitle.vue";
import {
  validateFile,
  humanSize,
  ACCEPT_ATTR,
  MAX_FILE_BYTES,
} from "../lib/uploadRules.js";

const guestName = ref("");
const dragOver = ref(false);

// --- Cloudflare Turnstile (opcjonalne, aktywne gdy podano site key) ---
// Model: rozwiąż Turnstile RAZ -> serwer wydaje krótkotrwałą przepustkę (HMAC),
// którą używamy do wielu plików. Token Turnstile jest jednorazowy, przepustka nie.
const turnstileEl = ref(null);
let turnstileWidgetId = null;
const turnstileSiteKey = gallery.turnstileSiteKey || "";
const turnstileEnabled = computed(() => !!turnstileSiteKey);

const uploadPass = ref("");
const passExp = ref(0);
const passError = ref("");

function passValid() {
  return uploadPass.value && passExp.value > Date.now() + 5000;
}

// Wymiana tokenu Turnstile na przepustkę.
async function exchangePass(token) {
  try {
    const res = await fetch("/api/pass", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    const data = await res.json();
    if (data && data.ok && data.pass) {
      uploadPass.value = data.pass;
      passExp.value = data.exp || 0;
      passError.value = "";
      flushWaiting();
    } else {
      passError.value = data.message || "Weryfikacja nie powiodła się.";
    }
  } catch (e) {
    passError.value = "Błąd weryfikacji. Odśwież stronę.";
  }
}

// Poproś o nowy token (np. po wygaśnięciu przepustki).
function refreshTurnstile() {
  if (window.turnstile && turnstileWidgetId !== null) {
    try {
      window.turnstile.reset(turnstileWidgetId);
    } catch (e) {}
  }
}

function loadTurnstile() {
  if (!turnstileSiteKey) return;
  const render = () => {
    if (window.turnstile && turnstileEl.value && turnstileWidgetId === null) {
      turnstileWidgetId = window.turnstile.render(turnstileEl.value, {
        sitekey: turnstileSiteKey,
        callback: (t) => exchangePass(t),
        "expired-callback": () => {
          uploadPass.value = "";
          passExp.value = 0;
        },
        "error-callback": () => {
          passError.value = "Weryfikacja nie powiodła się. Odśwież stronę.";
        },
      });
    }
  };
  if (window.turnstile) return render();
  const s = document.createElement("script");
  s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
  s.async = true;
  s.defer = true;
  s.onload = render;
  document.head.appendChild(s);
}

// Uruchom uploady, które czekały na przepustkę.
function flushWaiting() {
  for (const entry of queue) {
    if (entry.status === "waiting") uploadEntry(entry);
  }
}

// Lista zadań uploadu w bieżącej sesji
const queue = reactive([]); // { id, file, status, progress, error, preview, kind }

// Galeria już przesłanych mediów
const items = ref([]);
const loadingGallery = ref(true);
const galleryError = ref("");

const deviceId = ref("");

onMounted(() => {
  try {
    let id = localStorage.getItem("guestDeviceId");
    if (!id) {
      id = "guest-" + Math.random().toString(36).slice(2, 10);
      localStorage.setItem("guestDeviceId", id);
    }
    deviceId.value = id;
    guestName.value = localStorage.getItem("guestName") || "";
  } catch (e) {
    deviceId.value = "guest-anon";
  }
  loadGallery();
  loadTurnstile();
});

function saveName() {
  try {
    localStorage.setItem("guestName", guestName.value);
  } catch (e) {}
}

function onInputChange(e) {
  addFiles(e.target.files);
  e.target.value = "";
}

function onDrop(e) {
  dragOver.value = false;
  addFiles(e.dataTransfer.files);
}

function addFiles(fileList) {
  for (const file of Array.from(fileList || [])) {
    const check = validateFile(file);
    const id = Math.random().toString(36).slice(2);
    const entry = {
      id,
      file,
      name: file.name,
      size: file.size,
      status: check.ok ? "ready" : "error",
      progress: 0,
      error: check.ok ? "" : check.message,
      kind: check.kind || (file.type.startsWith("video") ? "video" : "image"),
      preview: check.ok ? URL.createObjectURL(file) : null,
    };
    queue.push(entry);
    if (check.ok) maybeUpload(entry);
  }
}

// Wyślij teraz albo poczekaj na przepustkę z Turnstile.
function maybeUpload(entry) {
  if (turnstileEnabled.value && !passValid()) {
    entry.status = "waiting";
    entry.error = "";
    refreshTurnstile();
    return;
  }
  uploadEntry(entry);
}

function uploadEntry(entry) {
  entry.status = "uploading";
  entry.error = "";
  const form = new FormData();
  form.append("file", entry.file);
  form.append("guestName", guestName.value || "Gość");
  form.append("deviceId", deviceId.value);
  if (turnstileEnabled.value) {
    form.append("pass", uploadPass.value || "");
  }

  const xhr = new XMLHttpRequest();
  xhr.open("POST", "/api/upload");

  xhr.upload.onprogress = (ev) => {
    if (ev.lengthComputable) {
      entry.progress = Math.round((ev.loaded / ev.total) * 100);
    }
  };

  xhr.onload = () => {
    if (xhr.status >= 200 && xhr.status < 300) {
      entry.status = "done";
      entry.progress = 100;
      loadGallery();
    } else {
      let msg = `Błąd serwera (${xhr.status}).`;
      let code = "";
      try {
        const r = JSON.parse(xhr.responseText);
        if (r && r.message) msg = r.message;
        if (r && r.code) code = r.code;
      } catch (e) {
        if (xhr.responseText) msg = xhr.responseText;
      }
      // Przepustka wygasła -> odśwież weryfikację i poczekaj na nową.
      if (xhr.status === 403 && code === "pass") {
        uploadPass.value = "";
        passExp.value = 0;
        entry.status = "waiting";
        entry.error = "";
        refreshTurnstile();
        return;
      }
      entry.status = "error";
      entry.error = msg;
    }
  };

  xhr.onerror = () => {
    entry.status = "error";
    entry.error = "Błąd połączenia. Spróbuj ponownie.";
  };

  xhr.send(form);
}

function retry(entry) {
  maybeUpload(entry);
}

function removeEntry(id) {
  const i = queue.findIndex((e) => e.id === id);
  if (i !== -1) {
    if (queue[i].preview) URL.revokeObjectURL(queue[i].preview);
    queue.splice(i, 1);
  }
}

async function loadGallery() {
  loadingGallery.value = true;
  galleryError.value = "";
  try {
    const res = await fetch("/api/list");
    if (!res.ok) throw new Error(`status ${res.status}`);
    const data = await res.json();
    items.value = Array.isArray(data.items) ? data.items : [];
  } catch (e) {
    galleryError.value = "Nie udało się wczytać galerii.";
    items.value = [];
  } finally {
    loadingGallery.value = false;
  }
}

const maxMb = computed(() => Math.round(MAX_FILE_BYTES / (1024 * 1024)));

// Wspólny album Google Photos (dłuższe filmy / dodatkowe materiały).
const photosUrl = computed(() => gallery.photosAlbumUrl || "");
const hasPhotos = computed(() => /^https?:\/\//i.test(photosUrl.value));

function isVideo(it) {
  return it.kind === "video" || /\.(mp4|mov)$/i.test(it.url || "");
}
</script>

<template>
  <section class="px-4 py-10">
    <div class="mx-auto max-w-4xl">
      <h1 class="sr-only">{{ gallery.heading }}</h1>
      <SectionTitle eyebrow="Wasze wspomnienia" :title="gallery.heading" />

      <p class="text-center max-w-xl mx-auto mb-8 text-[color:var(--color-ink)]/90">
        {{ gallery.intro }}
      </p>

      <!-- Formularz -->
      <div
        class="rounded-3xl bg-[color:var(--color-tint-1)]/80 border border-[color:var(--color-blush-100)] p-5 sm:p-8 shadow-sm"
      >
        <label
          for="guestName"
          class="block text-sm font-cinzel text-[color:var(--color-plum)] mb-1"
        >
          Twoje imię (opcjonalnie)
        </label>
        <input
          id="guestName"
          v-model="guestName"
          @blur="saveName"
          type="text"
          maxlength="60"
          placeholder="np. Kasia i Tomek"
          class="w-full mb-5 px-4 py-3 rounded-xl border border-[color:var(--color-blush-200)] bg-white/70 outline-none focus:border-[color:var(--color-blush-500)] focus:ring-2 focus:ring-[color:var(--color-blush-200)]"
        />

        <!-- Strefa drop — dostępna z klawiatury: <label> + sr-only <input> -->
        <label
          @dragover.prevent="dragOver = true"
          @dragleave.prevent="dragOver = false"
          @drop.prevent="onDrop"
          :class="[
            'block cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-colors focus-within:ring-2 focus-within:ring-[color:var(--color-blush-500)] focus-within:border-[color:var(--color-blush-500)]',
            dragOver
              ? 'border-[color:var(--color-blush-500)] bg-[color:var(--color-blush-50)]'
              : 'border-[color:var(--color-blush-300)] hover:bg-[color:var(--color-blush-50)]',
          ]"
        >
          <div class="text-4xl mb-2" aria-hidden="true">📸</div>
          <p class="font-cinzel text-[color:var(--color-plum)]">
            Kliknij, naciśnij Enter lub przeciągnij pliki tutaj
          </p>
          <p class="mt-1 text-xs text-[color:var(--color-ink)]/80">
            Zdjęcia i filmy: jpg, png, heic, mp4, mov · max {{ maxMb }} MB / plik
          </p>
          <input
            type="file"
            class="sr-only"
            multiple
            :accept="ACCEPT_ATTR"
            aria-label="Wybierz zdjęcia lub filmy do przesłania"
            @change="onInputChange"
          />
        </label>

        <!-- Turnstile (antyspam) — renderuje się tylko, gdy podano site key -->
        <div v-if="turnstileEnabled" class="mt-4 flex flex-col items-center gap-2">
          <div ref="turnstileEl"></div>
          <p v-if="passError" class="text-xs text-[color:var(--color-blush-800)]">
            {{ passError }}
          </p>
        </div>

        <!-- Kolejka / status -->
        <ul v-if="queue.length" class="mt-6 space-y-3">
          <li
            v-for="entry in queue"
            :key="entry.id"
            class="flex items-center gap-3 rounded-xl border border-[color:var(--color-blush-100)] bg-white/60 p-3"
          >
            <div
              class="h-14 w-14 shrink-0 rounded-lg overflow-hidden bg-[color:var(--color-blush-50)] flex items-center justify-center"
            >
              <img
                v-if="entry.preview && entry.kind === 'image'"
                :src="entry.preview"
                class="h-full w-full object-cover"
                alt=""
              />
              <span v-else class="text-2xl">🎬</span>
            </div>
            <div class="min-w-0 flex-1">
              <p class="truncate text-sm font-medium text-[color:var(--color-plum)]">
                {{ entry.name }}
              </p>
              <p class="text-xs text-[color:var(--color-ink)]/70">
                {{ humanSize(entry.size) }}
              </p>

              <div
                v-if="entry.status === 'uploading'"
                class="mt-2 h-2 w-full rounded-full bg-[color:var(--color-blush-100)] overflow-hidden"
              >
                <div
                  class="h-full bg-[color:var(--color-blush-500)] transition-all"
                  :style="{ width: entry.progress + '%' }"
                ></div>
              </div>

              <p
                v-if="entry.status === 'waiting'"
                class="mt-1 text-xs text-[color:var(--color-ink)]/70"
              >
                ⏳ Czekam na weryfikację antyspamową…
              </p>
              <p
                v-else-if="entry.status === 'error'"
                class="mt-1 text-xs text-[color:var(--color-blush-800)]"
              >
                ⚠️ {{ entry.error }}
              </p>
              <p
                v-else-if="entry.status === 'done'"
                class="mt-1 text-xs text-green-700"
              >
                ✓ Przesłano — dziękujemy!
              </p>
            </div>

            <button
              v-if="entry.status === 'error'"
              type="button"
              @click="retry(entry)"
              class="text-xs px-3 py-1 rounded-full bg-[color:var(--color-blush-600)] text-white"
            >
              Ponów
            </button>
            <button
              type="button"
              @click="removeEntry(entry.id)"
              class="text-xs px-2 py-1 rounded-full text-[color:var(--color-blush-700)] hover:bg-[color:var(--color-blush-100)]"
              aria-label="Usuń z listy"
            >
              ✕
            </button>
          </li>
        </ul>
      </div>

      <!-- Dłuższe filmy / wspólny album Google Photos -->
      <div
        class="mt-6 rounded-2xl border border-[color:var(--color-blush-200)] bg-[color:var(--color-tint-2)] p-5 text-center"
      >
        <p class="font-cinzel text-[color:var(--color-plum)]">
          🎬 Masz dłuższy film (powyżej {{ maxMb }} MB) lub chcesz dorzucić więcej?
        </p>
        <p class="mt-1 text-sm text-[color:var(--color-ink)]/85">
          Skorzystaj z naszego wspólnego albumu Google Photos — każdy może dodawać
          zdjęcia i filmy bez limitu rozmiaru (wymaga konta Google).
        </p>
        <a
          v-if="hasPhotos"
          :href="photosUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-block mt-3 font-cinzel text-sm px-6 py-3 rounded-full bg-[color:var(--color-orchid)] text-white shadow-sm hover:opacity-90 transition-opacity"
        >
          Otwórz wspólny album Google Photos ↗
        </a>
        <p v-else class="mt-3 text-xs italic text-[color:var(--color-ink)]/60">
          (Link do albumu pojawi się wkrótce.)
        </p>
      </div>

      <!-- Galeria przesłanych mediów -->
      <div class="mt-12">
        <h3
          class="font-cinzel text-xl text-[color:var(--color-blush-700)] mb-5 text-center"
        >
          Co już wrzucili goście
        </h3>

        <div v-if="loadingGallery" class="text-center text-[color:var(--color-ink)]/70 py-8">
          Wczytywanie…
        </div>
        <div
          v-else-if="galleryError"
          class="text-center text-[color:var(--color-blush-800)] py-8"
        >
          {{ galleryError }}
        </div>
        <div v-else-if="!items.length" class="text-center text-[color:var(--color-ink)]/70 py-8">
          Jeszcze nikt nic nie dodał — bądź pierwszy/pierwsza! 🩷
        </div>

        <div
          v-else
          class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3"
        >
          <div
            v-for="it in items"
            :key="it.id"
            class="group relative aspect-square overflow-hidden rounded-xl bg-[color:var(--color-blush-50)] border border-[color:var(--color-blush-100)]"
          >
            <video
              v-if="isVideo(it)"
              :src="it.url"
              class="h-full w-full object-cover"
              controls
              preload="metadata"
            ></video>
            <img
              v-else
              :src="it.url"
              :alt="it.guestName || 'Zdjęcie gościa'"
              loading="lazy"
              class="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
            <div
              v-if="it.guestName"
              class="absolute bottom-0 inset-x-0 bg-black/65 text-white text-[11px] px-2 py-1 truncate"
            >
              {{ it.guestName }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
