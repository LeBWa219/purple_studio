import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Magnetic } from "./ui.jsx";
import { STUDIO } from "../data.js";

const LINKS = [
  { href: "#services", label: "Услуги" },
  { href: "#works", label: "Работы" },
  { href: "#contacts", label: "Контакты" },
];

export default function Header({ onBook }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    fn();
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("locked", menuOpen);
  }, [menuOpen]);

  return (
    <>
      <motion.header
        className={`header ${scrolled ? "scrolled" : ""}`}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="container header-inner">
          <a href="#top" className="logo">
            <span className="logo-dot" />
            Фиолетовая студия
          </a>

          <nav className="nav">
            {LINKS.map((l) => (
              <a key={l.href} href={l.href}>
                {l.label}
              </a>
            ))}
          </nav>

          <div className="header-actions">
            <Magnetic strength={0.2}>
              <button className="btn btn-primary btn-sm" onClick={() => onBook()}>
                Записаться
              </button>
            </Magnetic>
            <button
              className="burger"
              aria-label="Меню"
              onClick={() => setMenuOpen(true)}
            >
              ☰
            </button>
          </div>
        </div>
      </motion.header>

      {menuOpen && (
        <motion.div
          className="mobile-menu"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {LINKS.map((l, i) => (
            <motion.a
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * i }}
            >
              {l.label}
            </motion.a>
          ))}
          <motion.a
            href={STUDIO.phoneHref}
            className="btn btn-primary"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            {STUDIO.phone}
          </motion.a>
          <button
            className="booking-close"
            style={{ position: "absolute", top: 24, right: 24 }}
            aria-label="Закрыть"
            onClick={() => setMenuOpen(false)}
          >
            ✕
          </button>
        </motion.div>
      )}
    </>
  );
}
