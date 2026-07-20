<script setup>
import { couple, hero } from "../data/site.js";
import Countdown from "../components/Countdown.vue";
import SectionTitle from "../components/SectionTitle.vue";
import RsvpForm from "../components/RsvpForm.vue";

function goGallery() {
  window.location.hash = "#/galeria";
}
function goDetails() {
  window.location.hash = "#/co-i-gdzie";
}
function goRsvp() {
  const el = document.getElementById("rsvp");
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}
</script>

<template>
  <section class="px-4 pt-10 sm:pt-16 pb-12">
    <div class="mx-auto max-w-3xl text-center">
      <h1
        class="font-amsterdam text-5xl sm:text-7xl text-[color:var(--color-blush-700)] leading-tight"
      >
        {{ couple.bride }} &amp; {{ couple.groom }}
      </h1>

      <p
        class="mt-5 font-cinzel text-lg sm:text-2xl text-[color:var(--color-plum)]"
      >
        {{ hero.intro }}
      </p>

      <p
        class="mt-2 font-cinzel text-base sm:text-xl text-[color:var(--color-blush-700)]"
      >
        {{ couple.weddingDateLabel }}
      </p>

      <p class="mt-4 text-sm sm:text-base max-w-xl mx-auto opacity-80">
        {{ hero.subtitle }}
      </p>

      <!-- Licznik -->
      <div class="mt-10">
        <p
          class="font-cinzel text-sm uppercase tracking-[0.2em] text-[color:var(--color-blush-600)] mb-4"
        >
          Do ślubu pozostało
        </p>
        <Countdown :target="couple.weddingDate" />
      </div>

      <!-- CTA -->
      <!-- <div class="mt-10 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          @click="goRsvp"
          class="font-cinzel text-sm px-6 py-3 rounded-full bg-[color:var(--color-blush-600)] text-white shadow-sm hover:bg-[color:var(--color-blush-700)] transition-colors"
        >
          Potwierdź obecność
        </button>
        <button
          type="button"
          @click="goDetails"
          class="font-cinzel text-sm px-6 py-3 rounded-full border border-[color:var(--color-blush-400)] text-[color:var(--color-blush-700)] hover:bg-[color:var(--color-blush-100)] transition-colors"
        >
          Co i gdzie
        </button>
        <button
          type="button"
          @click="goGallery"
          class="font-cinzel text-sm px-6 py-3 rounded-full border border-[color:var(--color-blush-400)] text-[color:var(--color-blush-700)] hover:bg-[color:var(--color-blush-100)] transition-colors"
        >
          Galeria gości
        </button>
      </div> -->

      <p
        v-if="couple.hashtag"
        class="mt-8 font-amsterdam text-2xl text-[color:var(--color-mauve)] break-words max-w-full px-2"
      >
        {{ couple.hashtag }}
      </p>
    </div>

    <!-- RSVP na stronie głównej -->
    <div id="rsvp" class="mx-auto max-w-lg mt-16 scroll-mt-24">
      <SectionTitle title="Potwierdzenie obecności" />
      <p class="text-center text-[color:var(--color-ink)]/85 mb-8">
        Dajcie nam znać, czy będziecie — pomoże nam to wszystko przygotować.
      </p>
      <RsvpForm />
    </div>
  </section>
</template>
