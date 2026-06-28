<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { couple } from "./data/site.js";
import HomeView from "./views/HomeView.vue";
import DetailsView from "./views/DetailsView.vue";
import AboutView from "./views/AboutView.vue";
import GalleryView from "./views/GalleryView.vue";
import AdminView from "./views/AdminView.vue";

const routes = [
  { id: "home", label: "Główna", hash: "#/", component: HomeView },
  { id: "details", label: "Co i gdzie", hash: "#/co-i-gdzie", component: DetailsView },
  { id: "about", label: "O nas", hash: "#/o-nas", component: AboutView },
  { id: "gallery", label: "Galeria gości", hash: "#/galeria", component: GalleryView },
];

// Ukryta trasa moderacji — poza nawigacją.
const adminRoute = { id: "admin", hash: "#/admin", component: AdminView };

const currentHash = ref(window.location.hash || "#/");

function syncHash() {
  currentHash.value = window.location.hash || "#/";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

const activeRoute = computed(() => {
  if (currentHash.value === adminRoute.hash) return adminRoute;
  return routes.find((r) => r.hash === currentHash.value) || routes[0];
});

onMounted(() => window.addEventListener("hashchange", syncHash));
onBeforeUnmount(() => window.removeEventListener("hashchange", syncHash));

const menuOpen = ref(false);
function go(hash) {
  window.location.hash = hash;
  menuOpen.value = false;
}
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <!-- Nawigacja -->
    <header
      class="sticky top-0 z-30 backdrop-blur-md bg-[color:var(--color-tint-1)]/80 border-b border-[color:var(--color-blush-200)]"
    >
      <nav class="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between gap-3">
        <button
          type="button"
          class="flex items-center gap-2 shrink-0"
          @click="go('#/')"
          aria-label="Strona główna"
        >
          <span
            class="font-amsterdam text-2xl sm:text-3xl text-[color:var(--color-blush-700)] leading-none"
            >{{ couple.bride }} &amp; {{ couple.groom }}</span
          >
        </button>

        <!-- Linki desktop -->
        <ul class="hidden md:flex items-center gap-1">
          <li v-for="r in routes" :key="r.id">
            <button
              type="button"
              @click="go(r.hash)"
              :class="[
                'font-cinzel text-sm px-3 py-2 rounded-full transition-colors',
                activeRoute.id === r.id
                  ? 'bg-[color:var(--color-blush-600)] text-white'
                  : 'text-[color:var(--color-plum)] hover:bg-[color:var(--color-blush-100)]',
              ]"
            >
              {{ r.label }}
            </button>
          </li>
        </ul>

        <!-- Hamburger mobile -->
        <button
          type="button"
          class="md:hidden p-2 rounded-lg text-[color:var(--color-plum)] hover:bg-[color:var(--color-blush-100)]"
          @click="menuOpen = !menuOpen"
          :aria-expanded="menuOpen"
          aria-label="Menu"
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <template v-if="!menuOpen">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </template>
            <template v-else>
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="6" y1="18" x2="18" y2="6" />
            </template>
          </svg>
        </button>
      </nav>

      <!-- Menu mobile rozwijane -->
      <transition name="fade">
        <ul
          v-if="menuOpen"
          class="md:hidden px-4 pb-3 flex flex-col gap-1 border-t border-[color:var(--color-blush-100)]"
        >
          <li v-for="r in routes" :key="r.id">
            <button
              type="button"
              @click="go(r.hash)"
              :class="[
                'w-full text-left font-cinzel text-base px-3 py-3 rounded-lg transition-colors',
                activeRoute.id === r.id
                  ? 'bg-[color:var(--color-blush-600)] text-white'
                  : 'text-[color:var(--color-plum)] hover:bg-[color:var(--color-blush-100)]',
              ]"
            >
              {{ r.label }}
            </button>
          </li>
        </ul>
      </transition>
    </header>

    <!-- Treść -->
    <main class="flex-1 w-full">
      <component :is="activeRoute.component" />
    </main>

    <!-- Stopka -->
    <footer
      class="mt-12 py-8 text-center text-sm text-[color:var(--color-gray-500,#6b7280)]"
    >
      <div class="font-amsterdam text-3xl text-[color:var(--color-blush-700)]">
        {{ couple.bride }} &amp; {{ couple.groom }}
      </div>
      <p class="mt-1 font-cinzel tracking-wide text-[color:var(--color-plum)]">
        {{ couple.weddingDateLabel }}
      </p>
      <p class="mt-3 text-xs opacity-70">Zrobione z 🩷</p>
    </footer>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.18s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
