import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";

import EventRegistrationForm from "../components/EventRegistrationForm";
import Footer from "../components/Footer";
import { getEvent } from "../services/events";
import { formatDate } from "../utils/formatDate";
import styles from "./EventPage.module.css";

// Selve siden for et bestemt event
export default function EventPage() {
  // Henter eventets ID fra URL'en
  // Fx hvis URL'en er /events/5, så er eventId = 5
  const { eventId } = useParams();

  // Her gemmer vi det event vi henter fra Supabase
  const [event, setEvent] = useState(null);

  // Her gemmer vi om eventet stadig bliver hentet
  const [loading, setLoading] = useState(true);

  // Her gemmer vi en fejlbesked hvis eventet ikke kan hentes
  const [error, setError] = useState("");

  // Henter eventet når siden bliver åbnet
  useEffect(() => {
    // Henter eventet fra Supabase
    async function loadEvent() {
      // Minimumstid (ms) vi vil vise skeleton/loading for at brugeren kan nå at se den
      const MIN_SKELETON_MS = 500;
      const start = Date.now();
      let timeoutId;

      try {
        const data = await getEvent(eventId);
        // Gemmer eventet i state
        setEvent(data);
      } catch (error) {
        // Gemmer fejlbeskeden i state
        setError("Eventet kunne ikke hentes.");
        console.error("Kunne ikke hente event:", error);
      } finally {
        // Beregn hvor lang tid der er gået og vent evt. tilbageværende tid
        const elapsed = Date.now() - start;
        const remaining = MIN_SKELETON_MS - elapsed;

        if (remaining > 0) {
          // Vent den resterende tid før vi stopper loading
          timeoutId = setTimeout(() => setLoading(false), remaining);
        } else {
          setLoading(false);
        }
      }

      // Ryd op hvis komponenten unmountes inden timeout
      return () => clearTimeout(timeoutId);
    }

    // Kører funktionen
    const cleanup = loadEvent();

    // Hvis eventId ændrer sig, henter vi det nye event
    return () => {
      if (typeof cleanup === "function") cleanup();
    };
  }, [eventId]);

  // Hvis eventet ikke er hentet endnu, viser vi ikke siden
  if (loading) {
    return <Skeleton />;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!event) {
    return <p>Eventet blev ikke fundet.</p>;
  }

  return (
    <>
      <main className={styles.eventPage}>
        {/* Link tilbage til alle events */}
        <Link className={styles.backLink} to="/">
          ← Alle events
        </Link>

        {/* Viser information om det valgte event */}
        <section className={styles.eventDetail}>
          {/* Eventets billede */}
          <img
            src={event.image}
            alt={`${event.title} - billedet illustrerer arrangementet`}
          />

          <div className={styles.eventDetailContent}>
            {/* Eventets kategori */}
            <p className="event-category">{event.category}</p>

            {/* Eventets titel */}
            <h1>{event.title}</h1>

            {/* Den korte beskrivelse af eventet */}
            <p className="lead">{event.summary}</p>

            {/* Her viser vi de vigtigste detaljer om eventet */}
            <div className={styles.detailList}>
              {/* Dato og tidspunkt */}
              <p>
                <strong>Dato</strong>
                {formatDate(event.date)}
              </p>

              {/* Stedet hvor eventet foregår */}
              <p>
                <strong>Sted</strong>
                <span>
                  {event.venues?.name}
                  <br />
                  {event.venues?.address}, {event.venues?.postal_code}{" "}
                  {event.venues?.city}
                  {event.venues?.website && (
                    <>
                      <br />
                      <a href={event.venues.website}>Besøg venue</a>
                    </>
                  )}
                </span>
              </p>
              {/* Prisen på eventet */}
              <p>
                <strong>Pris</strong>

                {/* Hvis prisen er 0, skriver vi "Gratis" */}
                {event.price === 0 ? "Gratis" : `${event.price} kr.`}
              </p>
            </div>

            {/* Den lange beskrivelse af eventet */}
            <p>{event.description}</p>
          </div>
        </section>

        <EventRegistrationForm event={event} />
      </main>
      <Footer />
    </>
  );
}

// Simple skeleton loader for the Event page while loading
function Skeleton() {
  return (
    <main className={styles.eventPage}>
      <section className={`${styles.eventDetail} ${styles.skeleton}`}>
        <div className={styles.skeletonImage} />

        <div className={styles.eventDetailContent}>
          <p className={`${styles.skeletonLine} ${styles.skeletonShort}`} />
          <h1 className={`${styles.skeletonLine} ${styles.skeletonTitle}`} />
          <p className={`${styles.skeletonLine} ${styles.skeletonLead}`} />

          <div className={styles.detailList}>
            <p className={styles.skeletonLine} />
            <p className={styles.skeletonLine} />
            <p className={styles.skeletonLine} />
          </div>

          <p className={styles.skeletonLine} />
        </div>
      </section>

      <section className={`${styles.signupPanel} ${styles.skeletonSignup}`}>
        <div>
          <p className={`${styles.eyebrow} ${styles.skeletonLine}`} />
          <h2 className={styles.skeletonLine} />
          <p className={styles.skeletonLine} />
        </div>

        <form>
          <label>
            Navn
            <div className={styles.skeletonInput} />
          </label>

          <label>
            E-mail
            <div className={styles.skeletonInput} />
          </label>

          <div className={styles.skeletonButton} />
        </form>
      </section>
    </main>
  );
}
