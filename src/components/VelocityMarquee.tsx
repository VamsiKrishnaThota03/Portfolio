import { m, useAnimationFrame, useMotionValue, useScroll, useSpring, useTransform, useVelocity } from 'framer-motion';
import { useRef } from 'react';
import { useReducedMotionPref } from '../hooks/useMediaQuery';

const wrapRange = (min: number, max: number, v: number) => min + ((((v - min) % (max - min)) + (max - min)) % (max - min));

/**
 * Infinite marquee that reacts to scroll: scrolling faster accelerates it,
 * scrolling up reverses its direction. Purely decorative (aria-hidden).
 */
export function VelocityMarquee({ items, baseVelocity = -2.6 }: { items: readonly string[]; baseVelocity?: number }) {
  const reduce = useReducedMotionPref();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 });
  const factor = useTransform(smooth, [0, 1000], [0, 3.5], { clamp: false });
  const dir = useRef(1);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    let moveBy = dir.current * baseVelocity * (delta / 1000);
    const f = factor.get();
    if (f < 0) dir.current = -1;
    else if (f > 0) dir.current = 1;
    moveBy += dir.current * moveBy * Math.abs(f);
    baseX.set(baseX.get() + moveBy);
  });

  const x = useTransform(baseX, (v) => `${wrapRange(-25, 0, v)}%`);

  const chunk = (copy: number) =>
    items.map((it, i) => (
      <span key={`${copy}-${i}`} className="inline-flex items-center">
        <span className={i % 2 ? 'text-outline' : 'text-fg/75'}>{it}</span>
        <span className="mx-6 text-[0.4em] text-accent sm:mx-9">✦</span>
      </span>
    ));

  return (
    <div aria-hidden="true" className="pointer-events-none relative overflow-hidden py-8 select-none md:py-10">
      <m.div
        className="inline-flex whitespace-nowrap font-display text-[clamp(1.8rem,4.5vw,3.4rem)] font-semibold tracking-tight uppercase will-change-transform"
        style={{ x }}
      >
        {chunk(0)}
        {chunk(1)}
        {chunk(2)}
        {chunk(3)}
      </m.div>
      <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-bg to-transparent sm:w-32" />
      <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-bg to-transparent sm:w-32" />
    </div>
  );
}
