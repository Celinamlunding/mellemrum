import { usersUrl, request } from "../lib/supabase";

export async function getUsersByEmail(email) {
  const url = usersUrl();
  url.searchParams.set("email", `eq.${email}`);

  const data = await request(url);

  return Array.isArray(data) ? data : [];
}

// Finder en bruger ud fra deres email
export async function getUserByEmail(email) {
  const users = await getUsersByEmail(email);

  return users[0] ?? null;
}

// Opretter en ny bruger
export async function createUser(user) {
  // Opretter en ny bruger
  const url = usersUrl();

  // Sender den nye bruger til Supabase
  const data = await request(url, {
    method: "POST",
    body: JSON.stringify(user),
    headers: {
      Prefer: "return=representation",
    },
  });

  // Supabase sender brugeren tilbage som et array
  return Array.isArray(data) ? data[0] : null;
}
