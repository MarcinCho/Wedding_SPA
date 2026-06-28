<script setup>
import { schedule, locations, dressCode } from "../data/site.js";
import SectionTitle from "../components/SectionTitle.vue";

function mapSrc(query) {
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
}
</script>

<template>
  <section class="px-4 py-10">
    <div class="mx-auto max-w-3xl">
      <h1 class="sr-only">Co i gdzie</h1>
      <SectionTitle eyebrow="Praktyczne informacje" title="Co i gdzie" />

      <!-- Harmonogram -->
      <h3
        class="font-cinzel text-xl text-[color:var(--color-blush-700)] mb-4 text-center"
      >
        Harmonogram dnia
      </h3>
      <ol class="relative border-l-2 border-[color:var(--color-blush-200)] ml-3 mb-12">
        <li v-for="(item, i) in schedule" :key="i" class="mb-8 ml-6">
          <span
            class="absolute -left-[11px] flex h-5 w-5 items-center justify-center rounded-full bg-[color:var(--color-blush-500)] ring-4 ring-[color:var(--color-tint-1)]"
          ></span>
          <div
            class="rounded-2xl bg-[color:var(--color-tint-1)]/80 border border-[color:var(--color-blush-100)] p-4 shadow-sm"
          >
            <div class="flex items-baseline gap-3">
              <span
                class="font-cinzel text-lg font-bold text-[color:var(--color-blush-700)]"
                >{{ item.time }}</span
              >
              <span class="font-cinzel text-base text-[color:var(--color-plum)]">{{
                item.title
              }}</span>
            </div>
            <p class="mt-1 text-sm opacity-80">{{ item.description }}</p>
            <p class="mt-1 text-sm text-[color:var(--color-blush-600)]">
              📍 {{ item.place }}
            </p>
          </div>
        </li>
      </ol>

      <!-- Lokalizacje + mapy -->
      <h3
        class="font-cinzel text-xl text-[color:var(--color-blush-700)] mb-4 text-center"
      >
        Lokalizacje
      </h3>
      <div class="grid gap-6 sm:grid-cols-2 mb-12">
        <div
          v-for="(loc, i) in locations"
          :key="i"
          class="rounded-2xl overflow-hidden bg-[color:var(--color-tint-1)]/80 border border-[color:var(--color-blush-100)] shadow-sm flex flex-col"
        >
          <div class="aspect-video bg-[color:var(--color-blush-50)]">
            <iframe
              :src="mapSrc(loc.mapQuery)"
              class="w-full h-full border-0"
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
              :title="`Mapa: ${loc.name}`"
            ></iframe>
          </div>
          <div class="p-4">
            <h4 class="font-cinzel text-base text-[color:var(--color-plum)]">
              {{ loc.name }}
            </h4>
            <p class="mt-1 text-sm opacity-80">{{ loc.address }}</p>
            <p class="mt-2 text-xs text-[color:var(--color-blush-600)]">{{ loc.note }}</p>
          </div>
        </div>
      </div>

      <!-- Dress code -->
      <h3
        class="font-cinzel text-xl text-[color:var(--color-blush-700)] mb-4 text-center"
      >
        {{ dressCode.title }}
      </h3>
      <div
        class="rounded-2xl bg-[color:var(--color-tint-1)]/80 border border-[color:var(--color-blush-100)] p-6 shadow-sm text-center"
      >
        <p class="font-cinzel text-lg text-[color:var(--color-plum)]">
          {{ dressCode.text }}
        </p>
        <div class="mt-4 flex justify-center gap-4 flex-wrap">
          <div
            v-for="c in dressCode.palette"
            :key="c.name"
            class="flex flex-col items-center"
          >
            <span
              class="h-10 w-10 rounded-full border border-black/10 shadow-inner"
              :style="{ backgroundColor: c.color }"
            ></span>
            <span class="mt-1 text-xs opacity-70">{{ c.name }}</span>
          </div>
        </div>
        <p class="mt-4 text-sm opacity-80">{{ dressCode.note }}</p>
      </div>
    </div>
  </section>
</template>
