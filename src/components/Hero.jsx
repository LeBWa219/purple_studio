import { motion } from "motion/react";
import { Magnetic, KineticLine } from "./ui.jsx";
import { STUDIO } from "../data.js";
import LiveFeed from "./LiveFeed.jsx";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] } },
};

export default function Hero({ onBook }) {
  return (
    <section className="hero" id="top">
      <div className="container">
        <div className="hero-content">
          <motion.div
            className="hero-badge"
            variants={item}
            initial="hidden"
            animate="show"
          >
            <span className="pulse" />
            Онлайн-запись открыта · {STUDIO.city}
          </motion.div>

          <h1 className="hero-title-xl">
            <KineticLine text="Фиолетовая" baseDelay={0.35} step={0.045} />
            <KineticLine text="студия" baseDelay={0.85} step={0.05} className="hline-italic" />
          </h1>

          <motion.div className="hero-row" variants={container} initial="hidden" animate="show">
            <div className="hero-left">
              <motion.p className="hero-sub" variants={item}>
                брови и ногти на Аткарской, 27/165. Свободные окна видишь сразу —
                запись занимает 30 секунд, а напоминание придёт само.
              </motion.p>

              <motion.div className="hero-cta" variants={item}>
                <Magnetic strength={0.3}>
                  <button className="btn btn-primary btn-lg" onClick={() => onBook()}>
                    Записаться онлайн ✦
                  </button>
                </Magnetic>
                <Magnetic strength={0.15}>
                  <a className="btn btn-ghost btn-lg" href="#works">
                    Смотреть работы
                  </a>
                </Magnetic>
              </motion.div>

              <motion.div className="hero-meta" variants={item}>
                <div className="hero-meta-item">
                  <div className="hero-meta-value">
                    <span className="star">★</span> {STUDIO.rating.toFixed(1)}
                  </div>
                  <div className="hero-meta-label">рейтинг {STUDIO.ratingSource}</div>
                </div>
                <div className="hero-meta-item">
                  <div className="hero-meta-value">5+</div>
                  <div className="hero-meta-label">лет мастерства</div>
                </div>
                <div className="hero-meta-item">
                  <div className="hero-meta-value">{STUDIO.hours}</div>
                  <div className="hero-meta-label">без выходных</div>
                </div>
              </motion.div>

              <LiveFeed />
            </div>

            {/* коллаж из работ */}
            <motion.div
              className="hero-collage"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="collage-main">
                <img src="img/photo-f78564686-960.webp" alt="Фиолетовый маникюр с цветочным дизайном — работа студии (демо-фото)" />
              </div>
            <div className="collage-small">
              <img src="img/photo-f102310929-960.webp" alt="Французский маникюр с блёстками — работа студии (демо-фото)" />
            </div>
              <div className="collage-card">
                <div className="collage-card-title">Свободно сегодня</div>
                <div className="collage-card-value">
                  18:30 · <em>окно на брови</em>
                </div>
              </div>
              <span className="collage-sparkle collage-sparkle-1">✨</span>
              <span className="collage-sparkle collage-sparkle-2">💜</span>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className="scroll-hint">
        Листай вниз
        <div className="scroll-hint-line" />
      </div>
    </section>
  );
}
