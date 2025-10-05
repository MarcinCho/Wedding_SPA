<template>
  <!-- Main container - no styling -->
  <div>
    <div>
      <h1>Odliczanie do Ślubu Oli i Marcina</h1>

      <div v-if="!isFinished">
        <!-- Time units container -->
        <div>
          <!-- Days -->
          <div>
            <span>{{ days.toString().padStart(2, "0") }}</span>
          </div>
          <span>Days</span>
        </div>

        <!-- Hours -->
        <div>
          <div>
            <span>{{ hours.toString().padStart(2, "0") }}</span>
          </div>
          <span>Hours</span>
        </div>

        <!-- Minutes -->
        <div>
          <div>
            <span>{{ minutes.toString().padStart(2, "0") }}</span>
          </div>
          <span>Minutes</span>
        </div>

        <!-- Seconds -->
        <div>
          <div>
            <span>{{ seconds.toString().padStart(2, "0") }}</span>
          </div>
          <span>Seconds</span>
        </div>
      </div>

      <div v-else>The countdown has finished!</div>
    </div>
  </div>
</template>

<script>
// NOTE: The import for 'backgroundImageUrl' has been removed as it is no longer used for styling.

export default {
  // Component Name
  name: "Countdown",

  // Use a prop for the target date, making the component reusable.
  props: {
    targetDate: {
      type: String,
      required: true,
      default: "2026-09-12T16:00:00",
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
    };
  },

  mounted() {
    // Start the countdown timer when the component is mounted.
    this.interval = setInterval(this.updateCountdown, 1000);
    this.updateCountdown(); // Call once immediately to avoid a 1-second delay
  },

  beforeUnmount() {
    // Clear the interval when the component is destroyed to prevent memory leaks.
    clearInterval(this.interval);
  },

  methods: {
    updateCountdown() {
      const target = new Date(this.targetDate);
      const now = new Date();
      const difference = target.getTime() - now.getTime(); // Difference in milliseconds

      // Check if the countdown has finished.
      if (difference <= 0) {
        clearInterval(this.interval);
        this.isFinished = true;
        this.days = 0;
        this.hours = 0;
        this.minutes = 0;
        this.seconds = 0;
        return;
      }

      // Calculate time components
      const totalSeconds = Math.floor(difference / 1000);

      this.days = Math.floor(totalSeconds / (60 * 60 * 24));
      this.hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
      this.minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
      this.seconds = Math.floor(totalSeconds % 60);
    },
  },
};
</script>

<!-- The <style scoped> block was removed -->
