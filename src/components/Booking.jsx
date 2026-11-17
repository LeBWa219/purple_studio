import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { STUDIO, SERVICES, MASTERS, BOOKING_STEPS } from "../data.js";

const MON = ["янв", "фев", "мар", "апр", "мая", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"];
const DOW = ["вс", "пн", "вт", "ср", "чт", "пт", "сб"];

// «Псевдозанятость» окон — детерминированная, чтобы слоты не прыгали при перерисовке.
// При подключении реального Dikidi API здесь будет живой запрос свободных окон.
const slotBusy = (dateIdx, slotIdx) => (dateIdx * 7 + slotIdx * 3 + 5) % 9 === 0;

function buildDates() {
  const dates = [];
  const now = new Date();
  for (let i = 0; i < 14; i++) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
    dates.push({
      idx: i,
      dow: DOW[d.getDay()],
      num: d.getDate(),
      mon: MON[d.getMonth()],
      label: `${d.getDate()} ${MON[d.getMonth()]}`,
      weekend: d.getDay() === 0 || d.getDay() === 6,
    });
  }
  return dates;
}

function buildSlots(dateIdx) {
  const slots = [];
  const h0 = 9;
  for (let i = 0; i < 21; i++) {
    const h = h0 + Math.floor(i / 2);
    const m = i % 2 === 0 ? "00" : "30";
    slots.push({
      label: `${h}:${m}`,
      busy: slotBusy(dateIdx, i),
    });
  }
  return slots;
}

const fmtPrice = (p) => `${p.toLocaleString("ru-RU")} ₽`;
const normalizePhone = (v) => v.replace(/\D/g, "");

// Живой виджет Dikidi: если в data.js вставлена ссылка виджета —
// все кнопки «Записаться» открывают настоящий виджет с услугами из CRM.
// Принимает и готовый URL, и весь HTML-код кнопки из кабинета Dikidi:
// из кода автоматически вытаскиваем первый адрес виджета.
const extractDikidiUrl = (raw) => {
  if (!raw || raw.startsWith("#")) return null;
  if (raw.includes("<")) {
    const m =
      raw.match(/(?:src|href)=["'](https?:\/\/[^"']+)["']/i) ||
      raw.match(/(https?:\/\/[^\s"'<>]+dikidi[^\s"'<>]*)/i) ||
      raw.match(/(https?:\/\/[^\s"'<>]+)/i);
    return m ? m[1] : null;
  }
  return raw.trim();
};
const DIKIDI_WIDGET = extractDikidiUrl(STUDIO.dikidiWidget);

export default function Booking({ open, onClose, preset }) {
  const [step, setStep] = useState(0); // индекс по BOOKING_STEPS
  const [service, setService] = useState(null);
  const [master, setMaster] = useState(null);
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [touched, setTouched] = useState(false);
  const bodyRef = useRef(null);

  const dates = useMemo(buildDates, []);
  const slots = useMemo(() => (date !== null ? buildSlots(date) : []), [date]);

  // сброс и блокировка скролла при открытии; preset — визит из конструктора
  useEffect(() => {
    if (open) {
      setStep(0);
      setService(preset ?? null);
      setMaster(null);
      setDate(null);
      setTime(null);
      setName("");
      setPhone("");
      setTouched(false);
      document.body.classList.add("locked");
    } else {
      document.body.classList.remove("locked");
    }
    return () => document.body.classList.remove("locked");
  }, [open]);

  // Esc закрывает
  useEffect(() => {
    if (!open) return;
    const fn = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [open, onClose]);

  const canNext = [
    service !== null,
    master !== null,
    date !== null,
    time !== null,
    name.trim().length >= 2 && normalizePhone(phone).length >= 11,
  ][step];

  const next = () => {
    if (step === 4 && !canNext) {
      setTouched(true);
      return;
    }
    if (canNext) {
      if (step < BOOKING_STEPS.length - 1) setStep(step + 1);
      else setStep(BOOKING_STEPS.length); // экран успеха
    } else {
      setTouched(true);
    }
  };

  const back = () => (step > 0 ? setStep(step - 1) : onClose());

  const scrollBodyTop = () => bodyRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  const goNextAndScroll = () => {
    next();
    scrollBodyTop();
  };
  const goBackAndScroll = () => {
    back();
    scrollBodyTop();
  };

  const phoneValid = normalizePhone(phone).length >= 11;
  const nameValid = name.trim().length >= 2;
  const contactOk = nameValid && phoneValid;

  if (!open) return null;

  // ─── Режим живой записи Dikidi ───
  if (DIKIDI_WIDGET) {
    return (
      <AnimatePresence>
        <motion.div
          className="booking-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            className="booking-modal booking-modal--dikidi"
            initial={{ opacity: 0, scale: 0.94, y: 26 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="booking-head">
              <div>
                <div className="booking-title">Онлайн-запись</div>
                <div className="booking-sub">
                  {STUDIO.name} · все услуги и свободные окна — из расписания студии
                </div>
              </div>
              <button className="booking-close" aria-label="Закрыть" onClick={onClose}>
                ✕
              </button>
            </div>
            <iframe
              className="dikidi-frame"
              src={DIKIDI_WIDGET}
              title="Виджет онлайн-записи Dikidi"
            />
            <a
              className="dikidi-fallback"
              href={DIKIDI_WIDGET}
              target="_blank"
              rel="noreferrer"
            >
              Виджет не открылся? Записаться в новом окне ↗
            </a>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // ─── Демо-режим (пока студия не прислала ссылку виджета) ───
  const stepMeta = BOOKING_STEPS[step];
  const isSuccess = step >= BOOKING_STEPS.length;

  return (
    <AnimatePresence>
      <motion.div
        className="booking-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onMouseDown={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          className="booking-modal"
          initial={{ opacity: 0, scale: 0.94, y: 26 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* шапка */}
          <div className="booking-head">
            <div>
              <div className="booking-title">
                {isSuccess ? "Вы записаны 💜" : "Онлайн-запись"}
              </div>
              <div className="booking-sub">
                {isSuccess
                  ? "Мастер подтвердит и напомнит накануне"
                  : STUDIO.name + " · " + STUDIO.address}
              </div>
            </div>
            <button className="booking-close" aria-label="Закрыть" onClick={onClose}>
              ✕
            </button>
          </div>

          {/* прогресс */}
          {!isSuccess && (
            <div className="booking-progress">
              {BOOKING_STEPS.map((s, i) => (
                <div
                  key={s.id}
                  className={`progress-dot ${i < step ? "done" : i === step ? "current" : ""}`}
                />
              ))}
            </div>
          )}

          {/* тело */}
          <div className="booking-body" ref={bodyRef}>
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                {step === 0 && (
                  <>
                    <div className="booking-step-label">Шаг 1 · Выберите услугу</div>
                    <div className="option-list">
                      {SERVICES.map((s) => (
                        <button
                          key={s.id}
                          className={`option ${service?.id === s.id ? "selected" : ""}`}
                          onClick={() => setService(s)}
                        >
                          <div>
                            <div className="option-main">
                              {s.title} {s.hit && <span className="service-hit">ХИТ</span>}
                            </div>
                            <div className="option-sub">{s.cat} · ~{s.duration} мин</div>
                          </div>
                          <div className="option-side">
                            {service?.id === s.id ? (
                              <div className="option-check">✓</div>
                            ) : (
                              <div className="option-price">{fmtPrice(s.price)}</div>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {step === 1 && (
                  <>
                    <div className="booking-step-label">Шаг 2 · Выберите мастера</div>
                    <div className="option-list">
                      {MASTERS.map((m) => (
                        <button
                          key={m.id}
                          className={`option ${master?.id === m.id ? "selected" : ""}`}
                          onClick={() => setMaster(m)}
                        >
                          <div>
                            <div className="option-main">{m.name}</div>
                            <div className="option-sub">
                              {m.role} · {m.experience}
                            </div>
                          </div>
                          {master?.id === m.id && <div className="option-check">✓</div>}
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {step === 2 && (
                  <>
                    <div className="booking-step-label">Шаг 3 · Выберите день</div>
                    <div className="dates-row">
                      {dates.map((d) => (
                        <button
                          key={d.idx}
                          className={`date-chip ${date === d.idx ? "selected" : ""}`}
                          onClick={() => {
                            setDate(d.idx);
                            setTime(null);
                          }}
                        >
                          <span className="date-dow">{d.dow}</span>
                          <span className="date-num">{d.num}</span>
                          <span className="date-mon">{d.mon}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {step === 3 && (
                  <>
                    <div className="booking-step-label">Шаг 4 · Выберите время</div>
                    <div className="time-grid">
                      {slots.map((t, i) => (
                        <button
                          key={i}
                          className={`time-chip ${time === i ? "selected" : ""} ${
                            t.busy ? "disabled" : ""
                          }`}
                          disabled={t.busy}
                          onClick={() => setTime(i)}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                    <p className="option-sub" style={{ marginTop: 16 }}>
                      Зачёркнутое время уже занято. Не нашли своё? Позвоните — подберём{" "}
                      <a href={STUDIO.phoneHref} style={{ color: "var(--violet-soft)" }}>
                        {STUDIO.phone}
                      </a>
                    </p>
                  </>
                )}

                {step === 4 && (
                  <>
                    <div className="booking-step-label">Шаг 5 · Осталось пару полей</div>
                    <label className="field-label">Как вас зовут?</label>
                    <input
                      className="field-input"
                      placeholder="Ваше имя"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    {touched && !nameValid && (
                      <div className="field-error">Напишите имя — хотя бы пару букв 🙂</div>
                    )}

                    <label className="field-label">Телефон для напоминания</label>
                    <input
                      className="field-input"
                      placeholder="+7 900 000-00-00"
                      inputMode="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                    {touched && !phoneValid && (
                      <div className="field-error">Проверьте номер: нужно 11 цифр, например +7…</div>
                    )}

                    <div className="booking-summary">
                      <div className="summary-row">
                        <span>Услуга</span>
                        <span>{service.title}</span>
                      </div>
                      <div className="summary-row">
                        <span>Мастер</span>
                        <span>{master.name}</span>
                      </div>
                      <div className="summary-row">
                        <span>Когда</span>
                        <span>
                          {dates[date].label} в {slots[time].label}
                        </span>
                      </div>
                      <div className="summary-row">
                        <span>Стоимость</span>
                        <span>{fmtPrice(service.price)}</span>
                      </div>
                    </div>
                  </>
                )}

                {isSuccess && (
                  <div className="booking-success">
                    <motion.div
                      className="success-icon"
                      initial={{ scale: 0, rotate: -30 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 260, damping: 14 }}
                    >
                      ✓
                    </motion.div>
                    <div className="success-title">{name.trim()}, вы красотка — запись создана!</div>
                    <p className="success-text">
                      Мастер подтвердит запись и напомнит накануне визита. Если планы изменятся —
                      просто позвоните.
                    </p>
                    <div className="success-card">
                      <div className="summary-row">
                        <span>Услуга</span>
                        <span>{service.title}</span>
                      </div>
                      <div className="summary-row">
                        <span>Мастер</span>
                        <span>{master.name}</span>
                      </div>
                      <div className="summary-row">
                        <span>Когда</span>
                        <span>
                          {dates[date].label} в {slots[time].label}
                        </span>
                      </div>
                      <div className="summary-row">
                        <span>Стоимость</span>
                        <span>{fmtPrice(service.price)}</span>
                      </div>
                    </div>
                    <a
                      className="btn btn-ghost"
                      href={STUDIO.dikidi}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => STUDIO.dikidi === "#booking" && e.preventDefault()}
                    >
                      Открыть запись в Dikidi ↗
                    </a>
                    <button className="btn btn-primary" onClick={onClose}>
                      Готово
                    </button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* низ */}
          {!isSuccess && (
            <div className="booking-foot">
              <button className="booking-back" onClick={goBackAndScroll}>
                ← {step === 0 ? "Закрыть" : "Назад"}
              </button>
              <button
                className={`btn ${canNext ? "btn-primary" : "btn-ghost"}`}
                onClick={goNextAndScroll}
                style={canNext ? {} : { opacity: 0.6 }}
              >
                {step === BOOKING_STEPS.length - 1
                  ? contactOk
                    ? "Подтвердить запись ✦"
                    : "Заполните поля"
                  : stepMeta.label === "Дата"
                  ? "Выбрать день →"
                  : step === 3
                  ? "Выбрать время →"
                  : "Далее →"}
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
