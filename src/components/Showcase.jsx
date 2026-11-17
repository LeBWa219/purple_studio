import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { SERVICES } from "../data.js";

const useIsDesktop = () => {
  const [is, setIs] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(min-width: 1021px)").matches
  );
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1021px)");
    const fn = (e) => setIs(e.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);
  return is;
};

const SLIDES = [
  {
    word: "Ногти",
    photo: "/img/photo-f78564686-960.webp",
    alt: "Фиолетовый маникюр с цветочным дизайном (демо-фото)",
    text: "Аппаратный маникюр и покрытие, которое живёт 3–4 недели. Стерилизация в сухожаре — как в клинике.",
    serviceId: "nail-classic",
  },
  {
    word: "Дизайн",
    photo: "/img/photo-f102310929-960.webp",
    alt: "Французский маникюр с блёстками (демо-фото)",
    text: "Френч, втирка, слайдеры, роспись. Приноси референс из Pinterest — повторим или сделаем лучше.",
    serviceId: "nail-design",
  },
  {
    word: "Брови",
    photo: "/img/photo-f194440279-500.webp",
    alt: "Красота взгляда в деталях (демо-фото)",
    text: "Коррекция по форме лица, окрашивание краской или хной, ламинирование с фиксацией формы.",
    serviceId: "brow-correction",
  },
];

function Slide({ s, progress, index, total, onBook }) {
  const start = index / total;
  const end = (index + 1) / total;
  const isLast = index === total - 1;
  // слайд виден только в своём отрезке: быстрый fade-in, плато, fade-out
  const stops = isLast ? [start, start + 0.06, 1] : [start, start + 0.06, end - 0.06, end];
  const values = isLast ? [0, 1, 1] : [0, 1, 1, 0];
  const opacity = useTransform(progress, stops, values);
  const y = useTransform(progress, [start, start + 0.1], [70, 0]);
  const photoY = useTransform(progress, [start, end], [-30, 30]);
  return (
    <motion.div className="showcase-slide" style={{ opacity, y }}>
      <div className="showcase-left">
        <div className="showcase-word">{s.word}</div>
        <p className="showcase-text">{s.text}</p>
        <button
          className="btn btn-ghost"
          onClick={() => onBook(SERVICES.find((x) => x.id === s.serviceId))}
        >
          Записаться ✦
        </button>
      </div>
      <motion.div className="showcase-photo" style={{ y: photoY }}>
        <img src={s.photo} alt={s.alt} />
      </motion.div>
    </motion.div>
  );
}

export default function Showcase({ onBook }) {
  const isDesktop = useIsDesktop();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  if (!isDesktop) {
    // мобильный fallback — простые карточки
    return (
      <section className="showcase-fallback" id="services">
        <div className="container">
          {SLIDES.map((s) => (
            <div className="showcase-fb-card" key={s.word}>
              <div className="showcase-word-sm">{s.word}</div>
              <img src={s.photo} alt={s.alt} loading="lazy" />
              <p>{s.text}</p>
              <button
                className="btn btn-ghost"
                onClick={() => onBook(SERVICES.find((x) => x.id === s.serviceId))}
              >
                Записаться ✦
              </button>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="showcase" id="services" ref={ref}>
      <div className="showcase-sticky">
        <div className="showcase-sticky-head">Что мы делаем · листай</div>
        {SLIDES.map((s, i) => (
          <Slide
            key={s.word}
            s={s}
            progress={scrollYProgress}
            index={i}
            total={SLIDES.length}
            onBook={onBook}
          />
        ))}
      </div>
    </section>
  );
}
