<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from "vue";

const props = defineProps({
  target: { type: String, required: true },
});

const now = ref(Date.now());
let timer = null;

onMounted(() => {
  timer = setInterval(() => (now.value = Date.now()), 1000);
});
onBeforeUnmount(() => clearInterval(timer));

const diff = computed(() => new Date(props.target).getTime() - now.value);
const finished = computed(() => diff.value <= 0);

const parts = computed(() => {
  const d = Math.max(0, diff.value);
  const total = Math.floor(d / 1000);
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: Math.floor(total % 60),
  };
});

const units = computed(() => [
  { label: "Dni", value: parts.value.days },
  { label: "Godz.", value: parts.value.hours },
  { label: "Min.", value: parts.value.minutes },
  { label: "Sek.", value: parts.value.seconds },
]);

const pad = (n) => String(n).padStart(2, "0");
</script>

<template>
  <div v-if="!finished" class="flex flex-wrap justify-center gap-3 sm:gap-4">
    <div
      v-for="u in units"
      :key="u.label"
      class="flex flex-col items-center justify-center rounded-2xl bg-[color:var(--color-tint-1)]/80 border border-[color:var(--color-blush-200)] shadow-sm w-16 h-20 sm:w-24 sm:h-28"
    >
      <span
        class="font-cinzel text-2xl sm:text-4xl font-bold text-[color:var(--color-plum)] leading-none"
        >{{ pad(u.value) }}</span
      >
      <span
        class="mt-1 text-[10px] sm:text-xs uppercase tracking-[0.15em] text-[color:var(--color-blush-700)]"
        >{{ u.label }}</span
      >
    </div>
  </div>
  <div
    v-else
    class="font-amsterdam text-3xl sm:text-4xl text-[color:var(--color-blush-700)]"
  >
    Już po ślubie — dziękujemy, że byliście z nami! 🩷
  </div>
</template>
