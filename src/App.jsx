import { Suspense, lazy, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router";
import Navbar from "./components/Navbar";

const HomePage = lazy(() => import("./pages/HomePage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const EventPage = lazy(() => import("./pages/EventPage"));
const RegistrationsPage = lazy(() => import("./pages/RegistrationsPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/events/:eventId" element={<EventPage />} />
          <Route path="/om" element={<AboutPage />} />
          <Route path="/tilmeldinger" element={<RegistrationsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </>
  );
}
