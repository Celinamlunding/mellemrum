// Henter de funktioner vi skal bruge til at snakke med Supabase
import { eventsUrl, request } from "../lib/supabase";

// Henter alle events fra Supabase
export async function listEvents() {
  const url = eventsUrl();
  url.searchParams.set("select", "*,venues(*)");
  url.searchParams.set("order", "id.desc");

  const data = await request(url);

  return Array.isArray(data) ? data : [];
}

// Henter ét bestemt event
export async function getEvent(id) {
  const url = eventsUrl();
  url.searchParams.set("select", "*,venues(*)");
  url.searchParams.set("id", `eq.${id}`);

  const data = await request(url);

  return Array.isArray(data) ? (data[0] ?? null) : null;
}
