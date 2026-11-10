import { useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useReducedMotionPref } from '../hooks/useMediaQuery';

const GLYPHS = '!<>-_\\/[]{}=+*^?#@$%&';

/**
 * Decrypt effect: characters flicker through random glyphs and settle
 * left-to-right the first time the element scrolls into view.
 */
export function Scramble({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotionPref();
  const inView = useInView(ref, { once: true, margin: '-5% 0px' });
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    if (!inView || reduce) return;
    let frame = 0;
    const id = window.setInterval(() => {
      frame += 1;
      const revealed = Math.floor(frame / 2);
      if (revealed >= text.length) {
        setDisplay(text);
        window.clearInterval(id);
        return;
      }
      setDisplay(
        Array.from(text)
          .map((ch, i) => (i < revealed || ch === ' ' ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
          .join(''),
      );
    }, 30);
    return () => window.clearInterval(id);
  }, [inView, reduce, text]);

  return (
    <span ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{display}</span>
    </span>
  );
}
