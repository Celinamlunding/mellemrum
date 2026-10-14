// Henter de funktioner vi skal bruge til at snakke med Supabase
import { registrationsUrl, request } from "../lib/supabase";

// Tjekker om en bruger allerede er tilmeldt til et bestemt event
export async function getRegistrationByUserAndEvent(userId, eventId) {
  const url = registrationsUrl();

  url.searchParams.set("userId", `eq.${userId}`);
  url.searchParams.set("eventId", `eq.${eventId}`);

  const data = await request(url);

  return Array.isArray(data) ? (data[0] ?? null) : null;
}

// Gemmer en ny tilmelding i registrations-tabellen
export function createRegistration(registration) {
  // Sender tilmeldingen til Supabase
  return request(registrationsUrl(), {
    // POST betyder at vi opretter noget nyt
    method: "POST",

    // Laver tilmeldingen om til JSON
    // så Supabase kan modtage den
    body: JSON.stringify(registration),
  });
}
