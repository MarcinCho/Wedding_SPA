<script setup>
import { ref, onMounted } from "vue";

const token = ref("");
const authed = ref(false);
const items = ref([]);
const loading = ref(false);
const msg = ref("");
const busyKey = ref("");

onMounted(() => {
  try {
    const t = sessionStorage.getItem("adminToken");
    if (t) {
      token.value = t;
      authed.value = true;
      loadItems();
    }
  } catch (e) {}
});

function enter() {
  if (!token.value.trim()) return;
  try {
    sessionStorage.setItem("adminToken", token.value.trim());
  } catch (e) {}
  authed.value = true;
  loadItems();
}

function logout() {
  try {
    sessionStorage.removeItem("adminToken");
  } catch (e) {}
  token.value = "";
  authed.value = false;
  items.value = [];
}

function keyFromUrl(url) {
  return (url || "").replace(/^\/api\/media\//, "");
}

async function loadItems() {
  loading.value = true;
  msg.value = "";
  try {
    const res = await fetch("/api/list");
    const data = await res.json();
    items.value = Array.isArray(data.items) ? data.items : [];
  } catch (e) {
    msg.value = "Nie udało się wczytać listy.";
  } finally {
    loading.value = false;
  }
}

function isVideo(it) {
  return it.kind === "video" || /\.(mp4|mov)$/i.test(it.url || "");
}

async function remove(it) {
  const key = keyFromUrl(it.url);
  if (!key) return;
  if (!confirm("Usunąć ten plik na stałe?")) return;
  busyKey.value = key;
  msg.value = "";
  try {
    const res = await fetch("/api/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.value.trim()}`,
      },
      body: JSON.stringify({ key }),
    });
    if (res.status === 401) {
      msg.value = "Błędny token. Zaloguj się ponownie.";
      authed.value = false;
      return;
    }
    if (!res.ok) {
      const r = await res.json().catch(() => ({}));
      msg.value = r.message || `Błąd (${res.status}).`;
      return;
    }
    items.value = items.value.filter((x) => x.url !== it.url);
    msg.value = "Usunięto.";
  } catch (e) {
    msg.value = "Błąd połączenia.";
  } finally {
    busyKey.value = "";
  }
}
</script>

<template>
  <section class="px-4 py-10">
    <div class="mx-auto max-w-4xl">
      <h1 class="font-cinzel text-2xl text-[color:var(--color-plum)] text-center mb-6">
        Moderacja galerii
      </h1>

      <!-- Logowanie -->
      <div
        v-if="!authed"
        class="mx-auto max-w-sm rounded-2xl bg-[color:var(--color-tint-1)] border border-[color:var(--color-blush-100)] p-6 shadow-sm"
      >
        <label
          for="adminToken"
          class="block text-sm font-cinzel text-[color:var(--color-plum)] mb-1"
        >
          Token administratora
        </label>
        <input
          id="adminToken"
          v-model="token"
          type="password"
          autocomplete="off"
          placeholder="wklej ADMIN_TOKEN"
          class="w-full px-4 py-3 rounded-xl border border-[color:var(--color-blush-200)] bg-white/80 outline-none focus:border-[color:var(--color-blush-500)] focus:ring-2 focus:ring-[color:var(--color-blush-200)]"
          @keyup.enter="enter"
        />
        <button
          type="button"
          @click="enter"
          class="mt-4 w-full font-cinzel text-sm px-6 py-3 rounded-full bg-[color:var(--color-blush-600)] text-white hover:bg-[color:var(--color-blush-700)] transition-colors"
        >
          Wejdź
        </button>
        <p class="mt-3 text-xs text-[color:var(--color-ink)]/70 text-center">
          Token sprawdzany jest po stronie serwera przy usuwaniu.
        </p>
      </div>

      <!-- Panel -->
      <div v-else>
        <div class="flex items-center justify-between mb-4">
          <p class="text-sm text-[color:var(--color-ink)]/80">
            Plików: {{ items.length }}
          </p>
          <div class="flex gap-2">
            <button
              type="button"
              @click="loadItems"
              class="text-sm px-4 py-2 rounded-full border border-[color:var(--color-blush-400)] text-[color:var(--color-blush-700)] hover:bg-[color:var(--color-blush-100)]"
            >
              Odśwież
            </button>
            <button
              type="button"
              @click="logout"
              class="text-sm px-4 py-2 rounded-full text-[color:var(--color-ink)]/70 hover:bg-[color:var(--color-blush-100)]"
            >
              Wyloguj
            </button>
          </div>
        </div>

        <p v-if="msg" class="mb-4 text-sm text-[color:var(--color-blush-800)]">{{ msg }}</p>

        <div v-if="loading" class="text-center text-[color:var(--color-ink)]/70 py-8">
          Wczytywanie…
        </div>
        <div
          v-else-if="!items.length"
          class="text-center text-[color:var(--color-ink)]/70 py-8"
        >
          Galeria jest pusta.
        </div>

        <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          <div
            v-for="it in items"
            :key="it.url"
            class="relative aspect-square overflow-hidden rounded-xl bg-[color:var(--color-blush-50)] border border-[color:var(--color-blush-100)]"
          >
            <video
              v-if="isVideo(it)"
              :src="it.url"
              class="h-full w-full object-cover"
              preload="metadata"
            ></video>
            <img
              v-else
              :src="it.url"
              :alt="it.guestName || 'Zdjęcie'"
              loading="lazy"
              class="h-full w-full object-cover"
            />
            <div
              v-if="it.guestName"
              class="absolute top-0 inset-x-0 bg-black/65 text-white text-[11px] px-2 py-1 truncate"
            >
              {{ it.guestName }}
            </div>
            <button
              type="button"
              :disabled="busyKey === keyFromUrl(it.url)"
              @click="remove(it)"
              class="absolute bottom-2 right-2 text-xs px-3 py-1 rounded-full bg-red-600 text-white shadow disabled:opacity-50"
            >
              {{ busyKey === keyFromUrl(it.url) ? "…" : "Usuń" }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
