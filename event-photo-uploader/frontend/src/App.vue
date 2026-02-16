<script setup lang="ts">
import Header from './components/Header.vue';
import ImageUploader from './components/ImageUploader.vue';
</script>

<template>
  <div class="min-h-screen bg-gray-900 text-gray-100 font-sans">
    <Header />
    <main class="container mx-auto px-4 py-8">
      <p class="text-center text-gray-400 mb-8 max-w-lg mx-auto">
        Share your moments from the event! Photos are automatically compressed and securely uploaded.
      </p>
      <ImageUploader />
    </main>
  </div>
</template>
