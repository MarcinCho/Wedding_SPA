<script setup>
import { about, couple } from "../data/site.js";
import SectionTitle from "../components/SectionTitle.vue";
</script>

<template>
  <section class="px-4 py-10">
    <div class="mx-auto max-w-2xl">
      <h1 class="sr-only">O nas — {{ about.heading }}</h1>
      <SectionTitle eyebrow="Para Młoda" :title="about.heading" />

      <div
        class="rounded-3xl bg-[color:var(--color-tint-1)]/80 border border-[color:var(--color-blush-100)] p-6 sm:p-10 shadow-sm"
      >
        <div
          v-if="about.photo"
          class="mx-auto mb-6 h-48 w-48 overflow-hidden rounded-full border-4 border-[color:var(--color-blush-200)]"
        >
          <img
            :src="about.photo"
            alt="Ola i Marcin"
            class="h-full w-full object-cover"
          />
        </div>
        <div
          v-else
          class="mx-auto mb-6 h-40 w-40 flex items-center justify-center rounded-full border-4 border-[color:var(--color-blush-200)] bg-[color:var(--color-blush-50)] font-amsterdam text-4xl text-[color:var(--color-blush-600)]"
        >
          {{ couple.bride[0] }}&amp;{{ couple.groom[0] }}
        </div>

        <div class="space-y-8 text-center">
          <div v-for="(sec, i) in about.story" :key="i" class="space-y-3">
            <h3
              v-if="sec.title"
              class="font-cinzel text-lg sm:text-xl text-[color:var(--color-blush-700)]"
            >
              {{ sec.title }}
            </h3>
            <p
              v-for="(p, j) in sec.paragraphs"
              :key="j"
              class="text-base leading-relaxed text-[color:var(--color-ink)]/90"
            >
              {{ p }}
            </p>
            <ul
              v-if="sec.bullets && sec.bullets.length"
              class="list-disc pl-6 space-y-1 text-base leading-relaxed text-[color:var(--color-ink)]/90"
            >
              <li v-for="(b, k) in sec.bullets" :key="k">{{ b }}</li>
            </ul>
          </div>
        </div>

        <p
          class="mt-8 text-center font-amsterdam text-3xl text-[color:var(--color-blush-700)]"
        >
          <!-- {{ couple.bride }} &amp; {{ couple.groom }} -->
        </p>
      </div>
    </div>
  </section>
</template>
