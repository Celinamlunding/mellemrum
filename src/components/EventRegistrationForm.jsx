import { useState } from "react";

import {
  createRegistration,
  getRegistrationByUserAndEvent,
} from "../services/registrations";
import { createUser, getUsersByEmail } from "../services/users";
import {
  getInvalidEmailErrorMessage,
  getMissingEmailErrorMessage,
  getRegistrationErrorMessage,
  isValidEmail,
} from "../utils/registrationValidation";
import styles from "./EventRegistrationForm.module.css";

export default function EventRegistrationForm({ event }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState("success");

  function validateEmailField(value) {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      setEmailError(getMissingEmailErrorMessage());
      return false;
    }

    if (!isValidEmail(trimmedValue)) {
      setEmailError(getInvalidEmailErrorMessage());
      return false;
    }

    setEmailError("");
    return true;
  }

  async function handleSubmit(eventSubmit) {
    eventSubmit.preventDefault();

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      setStatusMessage("");
      setEmailError("");
      return;
    }

    if (!trimmedEmail) {
      setStatusMessage("");
      setEmailError(getMissingEmailErrorMessage());
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      setStatusMessage("");
      setEmailError(getInvalidEmailErrorMessage());
      return;
    }

    setEmailError("");
    setStatusMessage("");

    try {
      const matchingUsers = await getUsersByEmail(trimmedEmail);
      let user = matchingUsers[0] ?? null;

      if (matchingUsers.length > 0) {
        for (const existingUser of matchingUsers) {
          const existingRegistration = await getRegistrationByUserAndEvent(
            existingUser.id,
            event.id,
          );

          if (existingRegistration) {
            setStatusType("error");
            setStatusMessage("Du er allerede tilmeldt dette event.");
            setEmailError("Du er allerede tilmeldt dette event.");
            return;
          }
        }
      }

      if (!user) {
        user = await createUser({ name: trimmedName, email: trimmedEmail });
      }

      if (!user || !user.id) {
        throw new Error("Kunne ikke oprette eller finde bruger.");
      }

      const registration = {
        name: user?.name || trimmedName,
        userId: user.id,
        eventId: event.id,
        status: "Ny",
      };

      await createRegistration(registration);

      setName("");
      setEmail("");
      setStatusType("success");
      setStatusMessage(
        "Din tilmelding er nu sendt. Vi glæder os til at se dig!",
      );
      setEmailError("");
    } catch (error) {
      const friendlyMessage = getRegistrationErrorMessage(error?.message ?? "");

      setStatusType("error");
      setStatusMessage("");
      setEmailError(friendlyMessage);
    }
  }

  return (
    <section className={styles.signupPanel}>
      <div>
        <p className="eyebrow dark">Tilmelding</p>
        <h2>Reserver din plads</h2>

        <p className={styles.formText}>
          Udfyld formularen, så sender vi din tilmelding til arrangøren.
        </p>
      </div>

      <form noValidate onSubmit={handleSubmit}>
        <label>
          Navn
          <input
            value={name}
            onChange={(inputEvent) => {
              setName(inputEvent.target.value);
              setStatusMessage("");
            }}
            required
          />
        </label>

        <label>
          E-mail
          <input
            type="email"
            value={email}
            onChange={(inputEvent) => {
              const nextValue = inputEvent.target.value;
              setEmail(nextValue);
              setStatusMessage("");

              if (
                emailError &&
                nextValue.trim() &&
                isValidEmail(nextValue.trim())
              ) {
                setEmailError("");
              }
            }}
            onBlur={() => validateEmailField(email)}
            placeholder="dig@example.com"
            className={emailError ? styles.inputError : ""}
            aria-invalid={emailError ? "true" : "false"}
            aria-describedby={emailError ? "email-error" : undefined}
          />
          {emailError && (
            <span id="email-error" className={styles.inlineError} role="alert">
              {emailError}
            </span>
          )}
        </label>

        <button type="submit">Tilmeld mig</button>

        {statusMessage && statusType === "success" && (
          <p className={styles.successBanner} role="status" aria-live="polite">
            {statusMessage}
          </p>
        )}
      </form>
    </section>
  );
}
