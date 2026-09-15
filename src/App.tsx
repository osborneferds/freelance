import { AnimatePresence } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { About } from "./components/About";
import { BackToTop, Cursor, ScrollProgress } from "./components/Chrome";
import { AdminApp } from "./components/admin/AdminApp";
import { Contact } from "./components/Contact";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { FAQ } from "./components/FAQ";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { Navbar } from "./components/Navbar";
import { PortalApp } from "./components/portal/PortalApp";
import { Preloader } from "./components/Preloader";
import { Process } from "./components/Process";
import { Services } from "./components/Services";
import { Testimonials } from "./components/Testimonials";
import { Toasts } from "./components/Toasts";
import { Work } from "./components/Work";
import { trackView } from "./db/database";
import { useReveal } from "./hooks/useReveal";
import { useHashRoute } from "./hooks/useHashRoute";

const ROUTE_TITLES: Record<string, string> = {
  "/": "Home",
  "#work": "Selected work",
  "#services": "Services",
  "#about": "About",
  "#process": "Process",
  "#contact": "Contact",
  "#faq": "FAQ",
};

export default function App() {
  const route = useHashRoute();
  const isAdmin = route.startsWith("/admin");
  const isPortal = route.startsWith("/portal");

  useEffect(() => {
    if (isAdmin || isPortal) {
      window.scrollTo(0, 0);
    }
  }, [isAdmin, isPortal, route]);

  return (
    <ErrorBoundary>
      <div className="relative min-h-screen overflow-x-clip">
        <a
          href="#top"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-sm focus:font-medium focus:text-lime"
        >
          Skip to content
        </a>
        <Toasts />
        {isAdmin ? <AdminApp /> : isPortal ? <PortalApp /> : <Site key="site" />}
      </div>
    </ErrorBoundary>
  );
}

function Site() {
  const route = useHashRoute();
  const [loaded, setLoaded] = useState(() => sessionStorage.getItem("of_preloaded") === "1");
  const onDone = useCallback(() => {
    sessionStorage.setItem("of_preloaded", "1");
    setLoaded(true);
  }, []);
  useReveal();

  useEffect(() => {
    trackView(route, ROUTE_TITLES[route] ?? "Home");
  }, [route]);

  useEffect(() => {
    document.body.style.overflow = loaded ? "" : "hidden";
    if (loaded) window.scrollTo(0, 0);
  }, [loaded]);

  return (
    <>
      <AnimatePresence>{!loaded && <Preloader onDone={onDone} />}</AnimatePresence>
      <ScrollProgress />
      <Cursor />
      <Navbar ready={loaded} />
      <main>
        <Hero ready={loaded} />
        <Services />
        <Work />
        <About />
        <Process />
        <Testimonials />
        <FAQ />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
