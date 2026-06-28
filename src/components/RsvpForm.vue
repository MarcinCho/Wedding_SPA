<script setup>
import { reactive, ref } from "vue";

const form = reactive({
  name: "",
  attending: "Tak",
  guestCount: 1,
  comment: "",
  website: "", // honeypot — ukryte
});

const loading = ref(false);
const message = ref("");
const success = ref(false);

async function submit() {
  loading.value = true;
  message.value = "";
  try {
    const res = await fetch("/api/send-rsvp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data.success) {
      success.value = true;
      message.value =
        form.attending === "Nie"
          ? "Dziękujemy za informację — będzie nam Was brakowało. 🤍"
          : "Dziękujemy! Potwierdzenie zostało wysłane. Do zobaczenia! 🥂";
      form.name = "";
      form.attending = "Tak";
      form.guestCount = 1;
      form.comment = "";
    } else {
      success.value = false;
      message.value = data.error || "Nie udało się wysłać potwierdzenia.";
    }
  } catch (e) {
    success.value = false;
    message.value = "Wystąpił błąd sieci. Spróbuj ponownie później.";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <form
    @submit.prevent="submit"
    class="rounded-3xl bg-[color:var(--color-tint-1)]/80 border border-[color:var(--color-blush-100)] p-6 sm:p-8 shadow-sm space-y-5 text-left"
  >
    <!-- Imię -->
    <div>
      <label
        for="rsvpName"
        class="block text-sm font-cinzel text-[color:var(--color-plum)] mb-1"
      >
        Imię i nazwisko gościa / gości
      </label>
      <input
        id="rsvpName"
        v-model="form.name"
        type="text"
        required
        maxlength="120"
        placeholder="np. Anna i Jan Kowalscy"
        class="w-full px-4 py-3 rounded-xl border border-[color:var(--color-blush-200)] bg-white/70 outline-none focus:border-[color:var(--color-blush-500)] focus:ring-2 focus:ring-[color:var(--color-blush-200)]"
      />
    </div>

    <!-- Obecność -->
    <div>
      <span class="block text-sm font-cinzel text-[color:var(--color-plum)] mb-1">
        Czy będziecie z nami?
      </span>
      <div class="flex gap-3">
        <label
          v-for="opt in ['Tak', 'Nie']"
          :key="opt"
          :class="[
            'flex-1 text-center px-4 py-3 rounded-xl border cursor-pointer transition-colors font-cinzel',
            form.attending === opt
              ? 'bg-[color:var(--color-blush-600)] text-white border-[color:var(--color-blush-600)]'
              : 'border-[color:var(--color-blush-200)] text-[color:var(--color-plum)] hover:bg-[color:var(--color-blush-50)]',
          ]"
        >
          <input
            type="radio"
            class="sr-only"
            name="attending"
            :value="opt"
            v-model="form.attending"
          />
          {{ opt === "Tak" ? "Będziemy 🎉" : "Nie damy rady" }}
        </label>
      </div>
    </div>

    <!-- Liczba osób -->
    <div v-if="form.attending === 'Tak'">
      <label
        for="rsvpCount"
        class="block text-sm font-cinzel text-[color:var(--color-plum)] mb-1"
      >
        Liczba osób
      </label>
      <input
        id="rsvpCount"
        v-model.number="form.guestCount"
        type="number"
        min="1"
        max="50"
        class="w-full px-4 py-3 rounded-xl border border-[color:var(--color-blush-200)] bg-white/70 outline-none focus:border-[color:var(--color-blush-500)] focus:ring-2 focus:ring-[color:var(--color-blush-200)]"
      />
    </div>

    <!-- Komentarz -->
    <div>
      <label
        for="rsvpComment"
        class="block text-sm font-cinzel text-[color:var(--color-plum)] mb-1"
      >
        Komentarz / uwagi (opcjonalnie)
      </label>
      <textarea
        id="rsvpComment"
        v-model="form.comment"
        rows="3"
        maxlength="1000"
        placeholder="np. dieta wegetariańska, ulubiona piosenka…"
        class="w-full px-4 py-3 rounded-xl border border-[color:var(--color-blush-200)] bg-white/70 outline-none focus:border-[color:var(--color-blush-500)] focus:ring-2 focus:ring-[color:var(--color-blush-200)]"
      ></textarea>
    </div>

    <!-- Honeypot (ukryty przed ludźmi) -->
    <input
      v-model="form.website"
      type="text"
      tabindex="-1"
      autocomplete="off"
      class="hidden"
      aria-hidden="true"
    />

    <button
      type="submit"
      :disabled="loading"
      class="w-full font-cinzel tracking-wide px-6 py-3 rounded-full bg-[color:var(--color-blush-600)] text-white shadow-sm hover:bg-[color:var(--color-blush-700)] disabled:opacity-60 transition-colors"
    >
      {{ loading ? "Wysyłanie…" : "Potwierdź" }}
    </button>

    <p
      v-if="message"
      :class="[
        'text-sm text-center rounded-xl p-3',
        success
          ? 'bg-[color:var(--color-ok-bg)] text-green-800'
          : 'bg-[color:var(--color-err-bg)] text-[color:var(--color-blush-800)]',
      ]"
    >
      {{ message }}
    </p>
  </form>
</template>
