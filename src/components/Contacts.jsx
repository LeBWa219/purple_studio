import { Reveal, SectionHead } from "./ui.jsx";
import { STUDIO } from "../data.js";

export default function Contacts() {
  return (
    <section id="contacts">
      <div className="container">
        <SectionHead
          eyebrow="Контакты"
          title={
            <>
              Аткарская, <span className="accent">27/165</span>
            </>
          }
        />
        <div className="contacts-wrap">
          <Reveal>
            <div className="contacts-panel">
              <div className="contact-row">
                <div className="contact-icon">📍</div>
                <div>
                  <div className="contact-label">Адрес</div>
                  <div className="contact-value">
                    {STUDIO.city}, {STUDIO.address}
                  </div>
                </div>
              </div>
              <div className="contact-row">
                <div className="contact-icon">📞</div>
                <div>
                  <div className="contact-label">Телефон</div>
                  <div className="contact-value">
                    <a href={STUDIO.phoneHref}>{STUDIO.phone}</a>
                  </div>
                </div>
              </div>
              <div className="contact-row">
                <div className="contact-icon">🕐</div>
                <div>
                  <div className="contact-label">Часы работы</div>
                  <div className="contact-value">{STUDIO.hours}</div>
                </div>
              </div>
              <div className="socials">
                <a
                  className="social-btn"
                  href={STUDIO.vk}
                  target="_blank"
                  rel="noreferrer"
                  title="ВКонтакте"
                >
                  ✦
                </a>
                <a
                  className="social-btn"
                  href={STUDIO.telegram}
                  target="_blank"
                  rel="noreferrer"
                  title="Telegram"
                >
                  ✈
                </a>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <div className="map-frame">
              <iframe
                src={STUDIO.mapUrl}
                title="Карта"
                loading="lazy"
                allowFullScreen
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
