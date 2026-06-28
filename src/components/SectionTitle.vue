<script setup>
defineProps({
  eyebrow: { type: String, default: "" },
  title: { type: String, required: true },
});
</script>

<template>
  <div class="text-center mb-8">
    <p
      v-if="eyebrow"
      class="font-amsterdam text-2xl sm:text-3xl text-[color:var(--color-blush-600)]"
    >
      {{ eyebrow }}
    </p>
    <h2
      class="font-cinzel text-2xl sm:text-4xl text-[color:var(--color-plum)] tracking-wide"
    >
      {{ title }}
    </h2>
    <div
      class="mx-auto mt-3 h-px w-24 bg-gradient-to-r from-transparent via-[color:var(--color-blush-400)] to-transparent"
    ></div>
  </div>
</template>
