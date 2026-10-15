export function isValidEmail(email) {
  const trimmedValue = String(email ?? "").trim();

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedValue);
}

export function getMissingEmailErrorMessage() {
  return "Udfyld venligst en gyldig e-mailadresse.";
}

export function getInvalidEmailErrorMessage() {
  return "E-mailadressen er ugyldig. Skriv den i formatet navn@eksempel.dk.";
}

export function getRegistrationErrorMessage(message = "") {
  const loweredMessage = String(message).toLowerCase();

  if (
    loweredMessage.includes("duplicate") ||
    loweredMessage.includes("unique") ||
    loweredMessage.includes("registrations_user_event_unique")
  ) {
    return "Du er allerede tilmeldt dette event.";
  }

  return "Kunne ikke tilmelde dig lige nu. Prøv igen.";
}
