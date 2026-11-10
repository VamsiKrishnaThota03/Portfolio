import { m } from 'framer-motion';
import { useEffect } from 'react';
import { profile } from '../data/profile';

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * First-load curtain: monogram + name rise in over a progress line, then the
 * whole panel lifts to reveal the hero (whose entrance is held until then).
 * Shown once per session; never shown for reduced motion (gated in context).
 */
export function Intro({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const t = window.setTimeout(onDone, 1450);
    return () => {
      document.body.style.overflow = '';
      window.clearTimeout(t);
    };
  }, [onDone]);

  return (
    <m.div
      className="fixed inset-0 z-[98] grid place-items-center bg-bg"
      exit={{ y: '-100%' }}
      transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
      aria-hidden="true"
    >
      <div className="flex flex-col items-center gap-7">
        <m.span
          initial={{ scale: 0.5, opacity: 0, rotate: -12 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 220, damping: 18, delay: 0.1 }}
          className="grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-accent via-accent-2 to-accent-3 font-display text-xl font-bold text-white"
        >
          {profile.initials}
        </m.span>
        <span className="block overflow-hidden font-display text-xl font-semibold tracking-tight sm:text-2xl">
          <span className="inline-block">
            {Array.from(profile.name).map((ch, i) => (
              <m.span
                key={i}
                className="inline-block"
                initial={{ y: '115%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 0.7, delay: 0.25 + i * 0.022, ease }}
              >
                {ch === ' ' ? ' ' : ch}
              </m.span>
            ))}
          </span>
        </span>
        <span className="relative block h-px w-44 overflow-hidden rounded-full bg-line">
          <m.span
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-accent via-accent-2 to-accent-3"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 1.15, delay: 0.15, ease: 'easeInOut' }}
          />
        </span>
      </div>
      <m.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-8 font-mono text-[11px] tracking-[0.25em] text-subtle uppercase"
      >
        Portfolio · {new Date().getFullYear()}
      </m.p>
    </m.div>
  );
}
