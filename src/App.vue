<script setup lang="ts">
import coutdown from './components/coutdown.vue'
import Navbar from './components/navbar.vue'
</script>

<template>
  <body>
    <Navbar />

    <coutdown targetDate="2025-10-26T02:00:00" />
  </body>
</template>

<style scoped></style>
