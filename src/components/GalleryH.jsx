import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue } from "motion/react";
import { GALLERY } from "../data.js";

const CAPTIONS = ["фиолетовое настроение", "французская классика", "смелое омбре", "детали решают"];

// Лента работ: НЕ едет сама — тянется мышкой или свайпается пальцем
export default function GalleryH({ onBook }) {
  const wrapRef = useRef(null);
  const trackRef = useRef(null);
  const [limit, setLimit] = useState(0);
  const x = useMotionValue(0);

  useEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      const wrap = wrapRef.current;
      if (!track || !wrap) return;
      const overflow = track.scrollWidth - wrap.clientWidth;
      setLimit(Math.min(0, -overflow - 24));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <section id="works">
      <div className="container">
        <div className="section-head">
          <div className="section-eyebrow">Портфолио</div>
          <h2 className="section-title">
            Лента работ — <span className="accent">тяни её сама</span>
          </h2>
          <p className="section-note">
            Лента не крутится сама: тянешь мышкой — она едет. Свайпаешь пальцем — то же самое.
          </p>
        </div>
      </div>

      <div className="tape" ref={wrapRef}>
        <motion.div
          className="tape-track"
          ref={trackRef}
          drag="x"
          dragConstraints={{ left: limit, right: 0 }}
          dragElastic={0.09}
          dragTransition={{ power: 0.25, timeConstant: 220 }}
          style={{ x }}
        >
          {GALLERY.map((g, i) => (
            <div className="htile" key={g.src}>
              <img src={g.src} alt={g.alt} loading="lazy" draggable={false} />
              <div className="htile-cap">
                <span className="htile-num">0{i + 1}</span>
                <span className="htile-text">{CAPTIONS[i]}</span>
              </div>
            </div>
          ))}
          <div className="htile htile-cta">
            <div>
              <div className="htile-cta-title">
                Хочешь <em>такую же?</em>
              </div>
              <button className="btn btn-primary btn-lg" onClick={() => onBook()}>
                Записаться ✦
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      <p className="tape-hint">
        <span aria-hidden="true">← </span>потяни ленту<span aria-hidden="true"> →</span>
      </p>
      <div className="container">
        <p className="master-note">* демо-фото — на живом сайте работы мастеров студии</p>
      </div>
    </section>
  );
}
