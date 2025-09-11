<script>
export default {
  props: {
    targetDate: {
      type: String,
      required: true,
      // Default to a future date to show the countdown in action.
      // e.g., "2025-10-26T02:00:00" is a good example of a time when DST ends in Europe
      // (the clock goes back one hour).
      default: '2025-10-26T02:00:00',
    },
  },
  data() {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isFinished: false,
      interval: null,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    }
  },
  mounted() {
    // Start the countdown timer when the component is mounted.
    this.interval = setInterval(this.updateCountdown, 1000)
    this.updateCountdown() // Call once immediately to avoid a 1-second delay
  },
  beforeUnmount() {
    // Clear the interval when the component is destroyed to prevent memory leaks.
    clearInterval(this.interval)
  },
  methods: {
    updateCountdown() {
      // Create a new Date object from the prop to ensure reactivity and correct time parsing.
      const target = new Date(this.targetDate)
      const now = new Date()
      const difference = target.getTime() - now.getTime()

      // Check if the countdown has finished.
      if (difference <= 0) {
        clearInterval(this.interval)
        this.isFinished = true
        this.days = 0
        this.hours = 0
        this.minutes = 0
        this.seconds = 0
        return
      }

      this.days = Math.floor(difference / (1000 * 60 * 60 * 24))
      this.hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      this.minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      this.seconds = Math.floor((difference % (1000 * 60)) / 1000)
    },
  },
}
</script>

<template>
  <div class="bg-[url('../img/flowers.jpg')] h-48">
    <div class="bg-white/75 text-center p-4">
      <hgroup>
        <h1 class="text-4xl">Odliczanie do Ślubu Oli i Marcina</h1>
        <p class="text-sm">Mam nadzieje ze dziala tak jak powinien.</p>
      </hgroup>
      <div v-if="!isFinished">
        <article>
          <h2 class="text-4xl">{{ days }} Dni {{ hours }} Godzin i {{ minutes }} Minut</h2>
        </article>
      </div>
      <div v-else class="text-2xl">Whoohoo! To zaczynamy!</div>
    </div>
  </div>
</template>
