import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { LIVE_EVENTS } from "../data.js";

export default function LiveFeed() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % LIVE_EVENTS.length), 3200);
    return () => clearInterval(t);
  }, []);

  const ev = LIVE_EVENTS[idx];

  return (
    <motion.div
      className="live-feed"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.1, duration: 0.7 }}
    >
      <div className="live-dot" />
      <AnimatePresence mode="wait">
        <motion.p
          key={idx}
          className="live-text"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.35 }}
        >
          <b>{ev.name}</b> {ev.action}
          <span className="live-ago"> · {ev.ago}</span>
        </motion.p>
      </AnimatePresence>
    </motion.div>
  );
}
