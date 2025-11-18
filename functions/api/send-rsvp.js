// Cloudflare Pages Function (Worker)
// Ścieżka: /api/send-rsvp

export async function onRequestPost({ request, env }) {
  console.log("Received RSVP request");

  try {
    // 1. Walidacja metody i pobranie danych
    if (request.headers.get("content-type") !== "application/json") {
      return new Response(JSON.stringify({ error: "Expected JSON" }), {
        status: 400,
      });
    }

    const data = await request.json();

    const { name, guestCount, comment } = data;

    // Prosta walidacja
    if (!name || typeof guestCount !== "number" || guestCount < 1) {
      return new Response(
        JSON.stringify({
          error: "Missing or invalid data: name or guestCount is required.",
        }),
        { status: 400 }
      );
    }

    // 2. Użycie Resend
    const RESEND_API_KEY = env.RESEND_API_KEY; // Pobieranie klucza z Cloudflare Secrets

    if (!RESEND_API_KEY) {
      // Zmieniamy komunikat błędu, by wiedzieć, czy to jest problem
      return new Response(
        JSON.stringify({
          error: "CONFIG_ERROR: RESEND_API_KEY is missing in env.",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Sprawdź, czy reszta kodu działa poprawnie, wstawiając inny test
    if (name === "TEST_KEY") {
      return new Response(
        JSON.stringify({ message: "Success! Key check passed." }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    // Dane do wysłania
    const emailData = {
      // ZMIEŃ ADRESY E-MAIL PONIŻEJ!
      from: "onboarding@resend.dev", // Musi być zweryfikowany w Resend, dla testów użyj "onboarding@resend.dev"
      to: "chow.marcin@gmail.com", // Adres e-mail, na który ma przyjść powiadomienie (np. Panny Młodej)
      subject: `🎉 NOWE POTWIERDZENIE RSVP od ${name}`,
      html: `
                <h2>Potwierdzenie Przybycia na Wesele</h2>
                <hr>
                <p><strong>Imię i Nazwisko Gościa/Gości:</strong> ${name}</p>
                <p><strong>Liczba Potwierdzanych Osób:</strong> ${guestCount}</p>
                <p><strong>Komentarz / Uwagi:</strong></p>
                <p style="border-left: 3px solid #ccc; padding-left: 10px;">${
                  comment || "Brak komentarza."
                }</p>
                <hr>
                <p>Wysłano przez formularz RSVP.</p>
            `,
    };

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify(emailData),
    });

    const resendResult = await resendResponse.json();

    if (resendResponse.ok) {
      console.log("Resend success:", resendResult);
      return new Response(
        JSON.stringify({
          message: "RSVP confirmed and email sent!",
          id: resendResult.id,
        }),
        { status: 200 }
      );
    } else {
      console.error("Resend error:", resendResult);
      // Zwracamy ogólny błąd do front-endu, logujemy szczegóły na serwerze
      return new Response(
        JSON.stringify({ error: "Failed to send email via Resend." }),
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Global Worker Error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
