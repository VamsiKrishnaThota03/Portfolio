import { ArrowUp, ArrowUpRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useFinePointer, useReducedMotionPref } from '../hooks/useMediaQuery';
import { profile, socials } from '../data/profile';
import { scrollToId } from '../lib/utils';
import { SocialIcon } from './BrandIcons';

/**
 * Big display type whose letters gain weight near the cursor (variable
 * font 'wght' axis), like light falling on the text. Pointer-only; writes
 * styles directly so nothing re-renders while the mouse moves.
 */
function ProximityTitle({ text }: { text: string }) {
  const letters = useRef<(HTMLSpanElement | null)[]>([]);
  const frame = useRef(0);
  const fine = useFinePointer();
  const reduce = useReducedMotionPref();
  const active = fine && !reduce;

  const onMove = (e: React.PointerEvent) => {
    if (!active) return;
    const cx = e.clientX;
    const cy = e.clientY;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      for (const el of letters.current) {
        if (!el) continue;
        const r = el.getBoundingClientRect();
        const d = Math.hypot(cx - (r.left + r.width / 2), cy - (r.top + r.height / 2));
        const t = Math.max(0, 1 - d / 260);
        el.style.fontVariationSettings = `'wght' ${Math.round(370 + t * t * 330)}`;
      }
    });
  };
  const onLeave = () => {
    cancelAnimationFrame(frame.current);
    for (const el of letters.current) if (el) el.style.fontVariationSettings = "'wght' 370";
  };

  let idx = 0;
  const words = text.split(' ');
  return (
    <span onPointerMove={onMove} onPointerLeave={onLeave} className="block">
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, w) => (
          // The joining space must live OUTSIDE the inline-block, or the
          // browser trims it and the words run together.
          <span key={w}>
            <span className="inline-block whitespace-nowrap">
              {Array.from(word).map((ch) => {
                const i = idx++;
                return (
                  <span
                    key={i}
                    ref={(el) => {
                      letters.current[i] = el;
                    }}
                    className="inline-block transition-[font-variation-settings] duration-300 ease-out"
                    style={{ fontVariationSettings: "'wght' 370" }}
                  >
                    {ch}
                  </span>
                );
              })}
            </span>
            {w < words.length - 1 ? ' ' : null}
          </span>
        ))}
      </span>
    </span>
  );
}

function LocalTime() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 15_000);
    return () => window.clearInterval(id);
  }, []);
  const time = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: profile.timezone,
  }).format(now);
  return (
    <span className="inline-flex items-center gap-2 font-mono text-xs text-subtle">
      <span className="relative grid h-2 w-2 place-items-center" aria-hidden="true">
        <span className="animate-pulse-ring absolute h-2 w-2 rounded-full bg-emerald-400" />
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
      </span>
      Bangalore · {time} IST
    </span>
  );
}

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 left-1/2 h-[26rem] w-[40rem] -translate-x-1/2 rounded-full bg-accent/10 blur-[120px]"
      />
      <div className="mx-auto max-w-6xl px-5 pt-16 pb-8 sm:px-8 md:pt-24">
        <p className="font-mono text-xs tracking-[0.2em] text-accent uppercase">What’s next</p>
        <a
          href="#contact"
          data-cursor="Say hi"
          onClick={(e) => {
            e.preventDefault();
            scrollToId('contact');
          }}
          className="group mt-5 block font-display text-[clamp(2.4rem,7.5vw,5.75rem)] leading-[1.04] font-semibold tracking-[-0.03em] text-fg"
        >
          <ProximityTitle text="Let’s build something great." />
          <span className="mt-2 inline-flex items-center gap-2 text-base font-normal tracking-normal text-muted transition-colors group-hover:text-fg sm:text-lg">
            Get in touch <ArrowUpRight size={18} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
          </span>
        </a>

        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3">
          <a
            href={`mailto:${profile.email}`}
            className="relative font-mono text-sm text-muted transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-300 hover:text-fg hover:after:scale-x-100"
          >
            {profile.email}
          </a>
          <LocalTime />
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-6 border-t border-line pt-6 sm:flex-row">
          <div className="text-center sm:text-left">
            <p className="font-display font-semibold">{profile.name}</p>
            <p className="mt-1 text-sm text-subtle">
              © {new Date().getFullYear()} · Built with React, TypeScript, Tailwind and Framer Motion.
            </p>
          </div>
          <div className="flex items-center gap-1">
            {socials.map((s) => (
              <a
                key={s.key}
                href={s.href}
                target={s.key === 'email' ? undefined : '_blank'}
                rel="noopener noreferrer"
                aria-label={s.key === 'email' ? `Email ${profile.email}` : `${s.label} (opens in a new tab)`}
                className="grid h-10 w-10 place-items-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-fg"
              >
                <SocialIcon k={s.key} size={17} />
              </a>
            ))}
            <button
              type="button"
              onClick={() => scrollToId('top')}
              className="ml-2 grid h-10 w-10 place-items-center rounded-full border border-line bg-surface text-fg transition-colors hover:border-accent/50"
              aria-label="Back to top"
            >
              <ArrowUp size={16} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
