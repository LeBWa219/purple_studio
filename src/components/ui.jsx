import { useEffect, useRef, useState } from "react";
import { motion, useInView, animate } from "motion/react";

// Появление блока при скролле — во всех секциях
export function Reveal({ children, delay = 0, y = 28, className, ...rest }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

// Кнопка «примагничивается» к курсору (как на модных сайтах)
export function Magnetic({ children, strength = 0.25, className }) {
  const ref = useRef(null);

  const handleMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    el.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
  };

  const handleLeave = () => {
    if (ref.current) ref.current.style.transform = "translate(0, 0)";
  };

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ transition: "transform 0.35s cubic-bezier(0.22,1,0.36,1)", display: "inline-flex" }}
    >
      {children}
    </div>
  );
}

// Подсветка курсора внутри карточек услуг
export function spotlight(e) {
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
  el.style.setProperty("--my", `${e.clientY - rect.top}px`);
}

export function SectionHead({ eyebrow, title, note }) {
  return (
    <Reveal className="section-head">
      <div className="section-eyebrow">{eyebrow}</div>
      <h2 className="section-title">{title}</h2>
      {note && <p className="section-note">{note}</p>}
    </Reveal>
  );
}

// Счётчик, оживающий при появлении на экране
export function CountUp({ to, decimals = 0, suffix = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-20%" });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, {
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setVal(v),
    });
    return () => c.stop();
  }, [inView, to]);

  return (
    <span ref={ref}>
      {val.toFixed(decimals)}
      {suffix}
    </span>
  );
}

// Посимвольное появление строки (кинетическая типографика)
export function KineticLine({ text, baseDelay = 0, step = 0.03, className }) {
  return (
    <span className={`hline ${className || ""}`}>
      {text.split("").map((ch, i) => (
        <span className="hchar" key={i} aria-hidden="true">
          <motion.span
            initial={{ y: "115%" }}
            animate={{ y: 0 }}
            transition={{ delay: baseDelay + i * step, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            {ch === " " ? "\u00A0" : ch}
          </motion.span>
        </span>
      ))}
      {/* настоящая строка для скринридеров */}
      <span className="visually-hidden">{text}</span>
    </span>
  );
}
