import { useCallback, useState } from "react";
import { motion, useScroll } from "motion/react";
import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import Marquee from "./components/Marquee.jsx";
import Showcase from "./components/Showcase.jsx";
import GalleryH from "./components/GalleryH.jsx";
import Bento from "./components/Bento.jsx";
import Contacts from "./components/Contacts.jsx";
import Booking from "./components/Booking.jsx";
import { STUDIO } from "./data.js";
import { Magnetic } from "./components/ui.jsx";

function ProgressBar() {
  const { scrollYProgress } = useScroll();
  return <motion.div className="progress-bar" style={{ scaleX: scrollYProgress }} />;
}

// Фон: белый с фиолетовыми цветами у правого края, без анимации
function StaticBackground() {
  return (
    <>
      <div className="silk-bg" aria-hidden="true" />
      <div className="silk-veil" aria-hidden="true" />
    </>
  );
}

export default function App() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [preset, setPreset] = useState(null);
  const openBooking = useCallback((p) => {
    setPreset(p ?? null);
    setBookingOpen(true);
  }, []);
  const closeBooking = useCallback(() => setBookingOpen(false), []);

  return (
    <>
      <StaticBackground />
      <ProgressBar />
      <Header onBook={openBooking} />
      <main>
        <Hero onBook={openBooking} />
        <Marquee />
        <Showcase onBook={openBooking} />
        <GalleryH onBook={openBooking} />
        <Bento onBook={openBooking} />

        <Contacts />
      </main>

      <footer className="footer">
        <div className="container footer-inner">
          <span>© {new Date().getFullYear()} {STUDIO.name} · {STUDIO.city}</span>
          <span>{STUDIO.phone} · {STUDIO.hours}</span>
        </div>
        <div className="container">
          <p className="footer-credits">
            <a href="privacy.html" className="footer-policy">
              Политика конфиденциальности (152-ФЗ)
            </a>
            <br />
            Демо-фотографии: Wikimedia Commons — Köttbulleledaren, Theknowhau, Nunolupus,
            Shixart1985 (CC BY-SA). На живом сайте заменяются работами студии.
          </p>
        </div>
      </footer>

      {/* плавающая кнопка на мобильных */}
      <div className="floating-cta">
        <button className="btn btn-primary" onClick={() => openBooking()}>
          Записаться онлайн ✦
        </button>
      </div>

      <Booking open={bookingOpen} onClose={closeBooking} preset={preset} />
    </>
  );
}
