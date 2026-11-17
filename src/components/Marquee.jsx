export default function Marquee() {
  const items = [
    "коррекция бровей",
    "ламинирование",
    "маникюр",
    "гель-лак",
    "дизайн ногтей",
    "педикюр",
    "хна",
    "восковая коррекция",
  ];
  const row = [...items, ...items];
  return (
    <div className="marquee">
      <div className="marquee-track">
        {row.map((t, i) => (
          <span className="marquee-item" key={i}>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
