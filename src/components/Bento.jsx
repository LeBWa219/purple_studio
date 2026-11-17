import { Reveal } from "./ui.jsx";
import { CountUp } from "./ui.jsx";
import { STUDIO } from "../data.js";

export default function Bento({ onBook }) {
  return (
    <section id="why">
      <div className="container">
        <Reveal className="section-head">
          <div className="section-eyebrow">Почему к нам возвращаются</div>
          <h2 className="section-title">
            Маленькая студия — <span className="accent">большие привычки</span>
          </h2>
        </Reveal>

        <div className="bento">
          <Reveal className="bento-cell bento-big" delay={0}>
            <div className="bento-num">
              <CountUp to={30} /> сек
            </div>
            <div className="bento-title">занимает запись</div>
            <p className="bento-text">
              Ни звонков, ни «а есть завтра?» — услуга, мастер, время прямо на сайте.
              Dikidi напомнит о визите накануне.
            </p>
            <button className="btn btn-primary" onClick={() => onBook()}>
              Попробовать ✦
            </button>
          </Reveal>

          <Reveal className="bento-cell" delay={0.08}>
            <div className="bento-num bento-num-violet">
              ★ <CountUp to={5} decimals={1} />
            </div>
            <div className="bento-title">рейтинг {STUDIO.ratingSource}</div>
            <p className="bento-text">Ни одной оценки ниже пяти.</p>
          </Reveal>

          <Reveal className="bento-cell" delay={0.16}>
            <div className="bento-emoji">🔔</div>
            <div className="bento-title">Напоминания сами</div>
            <p className="bento-text">
              Клиент не забывает визит — расписание не сыпется.
            </p>
          </Reveal>

          <Reveal className="bento-cell bento-wide" delay={0.24}>
            <div className="bento-emoji">📸</div>
            <div className="bento-title">Портфолио живёт тут</div>
            <p className="bento-text">
              Работы мастеров прямо на сайте — клиент видит уровень до записи,
              а мастер не отправляет 50 фото в личку.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
