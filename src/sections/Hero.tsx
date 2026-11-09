import { AnimatePresence, m, useReducedMotion } from 'framer-motion';
import { ArrowDown, ArrowRight, Download, MapPin } from 'lucide-react';
import { lazy, Suspense, useEffect, useState } from 'react';
import { SocialIcon } from '../components/BrandIcons';
import { MagneticButton } from '../components/MagneticButton';
import { SystemMap } from '../components/SystemMap';
import { profile, socials } from '../data/profile';
import { useApp } from '../lib/app-context';
import { isMac, scrollToId } from '../lib/utils';

const HeroCanvas = lazy(() => import('../components/HeroCanvas'));

const ease = [0.22, 1, 0.36, 1] as const;

// background-clip:text does not reach transformed children, so each letter
// paints its own slice of one shared gradient.
const gradientLetter = (i: number, n: number) => ({
  backgroundImage: 'linear-gradient(100deg, var(--accent) 0%, var(--accent-2) 55%, var(--accent-3) 100%)',
  backgroundSize: `${n * 100}% 100%`,
  backgroundPosition: `${n > 1 ? (i / (n - 1)) * 100 : 0}% 0`,
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
});

function KineticLine({ text, delay, className, gradient }: { text: string; delay: number; className?: string; gradient?: boolean }) {
  const reduce = useReducedMotion();
  return (
    <span className={`block overflow-hidden pb-[0.08em] ${className ?? ''}`}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="inline-block">
        {Array.from(text).map((ch, i) => (
          <m.span
            key={i}
            className="inline-block transition-transform duration-300 ease-out will-change-transform hover:-translate-y-[0.08em]"
            style={gradient ? gradientLetter(i, text.length) : undefined}
            initial={reduce ? false : { y: '110%', rotate: 6 }}
            animate={{ y: '0%', rotate: 0 }}
            transition={{ duration: 0.9, delay: delay + i * 0.035, ease }}
          >
            {ch === ' ' ? ' ' : ch}
          </m.span>
        ))}
      </span>
    </span>
  );
}

function RotatingWord({ words }: { words: readonly string[] }) {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  useEffect(() => {
    if (reduce) return;
    const t = window.setInterval(() => setI((n) => (n + 1) % words.length), 2200);
    return () => window.clearInterval(t);
  }, [reduce, words.length]);
  return (
    <span className="relative inline-grid align-bottom">
      {/* Reserve width for the longest word to avoid layout shift. */}
      <span className="invisible col-start-1 row-start-1" aria-hidden="true">
        {words.reduce((a, b) => (b.length > a.length ? b : a))}
      </span>
      <AnimatePresence mode="popLayout" initial={false}>
        <m.span
          key={words[i]}
          className="text-gradient col-start-1 row-start-1 font-semibold"
          initial={{ y: '70%', opacity: 0, filter: 'blur(6px)' }}
          animate={{ y: '0%', opacity: 1, filter: 'blur(0px)' }}
          exit={{ y: '-70%', opacity: 0, filter: 'blur(6px)' }}
          transition={{ duration: 0.5, ease }}
        >
          {words[i]}
        </m.span>
      </AnimatePresence>
    </span>
  );
}

export function Hero() {
  const { setPaletteOpen } = useApp();
  const [mac] = useState(isMac);
  const reduce = useReducedMotion();
  const fade = (d: number) =>
    reduce ? {} : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, delay: d, ease } };

  return (
    <section id="top" aria-label="Introduction" className="relative isolate flex min-h-[100svh] items-center overflow-hidden pt-24 pb-16">
      {/* Background layers */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="absolute -top-40 left-1/2 h-[42rem] w-[42rem] -translate-x-[70%] rounded-full bg-accent/25 blur-[120px]" />
        <div className="absolute top-20 right-0 h-[30rem] w-[30rem] translate-x-1/4 rounded-full bg-accent-2/15 blur-[120px]" />
        <div className="absolute bottom-0 left-10 h-[22rem] w-[22rem] rounded-full bg-accent-3/10 blur-[110px]" />
        <div className="grid-bg absolute inset-0 opacity-60" />
        <Suspense fallback={null}>
          <HeroCanvas />
        </Suspense>
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-bg" />
      </div>

      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[1.15fr_1fr] lg:gap-6">
        <div>
        <m.div {...fade(0.05)} className="mb-7 flex flex-wrap items-center gap-2">
          <span className="glass inline-flex items-center gap-2 rounded-full border border-line py-1.5 pr-3.5 pl-2.5 text-xs font-medium text-fg sm:text-sm">
            <span className="relative grid h-2.5 w-2.5 place-items-center" aria-hidden="true">
              <span className="animate-pulse-ring absolute h-2.5 w-2.5 rounded-full bg-emerald-400" />
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            {profile.status}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full px-2 py-1.5 text-xs text-muted sm:text-sm">
            <MapPin size={14} aria-hidden="true" /> {profile.location}
          </span>
        </m.div>

        <h1 className="font-display text-[clamp(3rem,10vw,7.25rem)] lg:text-[clamp(4rem,7vw,7.25rem)] leading-[0.92] font-semibold tracking-[-0.045em]">
          <KineticLine text="Thota Vamsi" delay={0.15} />
          <KineticLine text="Krishna." delay={0.45} gradient />
        </h1>

        <m.p {...fade(0.5)} className="mt-7 max-w-2xl text-lg text-muted sm:text-xl md:text-2xl">
          <span className="text-fg">{profile.headline}.</span> I build{' '}
          <span className="sr-only">{profile.roles.join(', ')}.</span>
          <span aria-hidden="true">
            <RotatingWord words={profile.roles} />
          </span>
        </m.p>

        <p className="mt-4 max-w-xl text-sm leading-relaxed text-subtle sm:text-base">
          Previously at Amazon: shipped a global fee-incentive launch across 8 marketplaces and tooling that cut P0 investigations by ~90%.
        </p>

        <m.div {...fade(0.6)} className="mt-9 flex flex-wrap items-center gap-3">
          <MagneticButton
            href="#projects"
            onClick={(e) => {
              e.preventDefault();
              scrollToId('projects');
            }}
          >
            View work <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </MagneticButton>
          <MagneticButton href={profile.resume} variant="ghost" download>
            <Download size={16} aria-hidden="true" /> Download résumé
          </MagneticButton>
          <ul className="ml-1 flex items-center gap-1" aria-label="Social links">
            {socials
              .filter((s) => s.key !== 'email')
              .map((s) => (
                <li key={s.key}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="grid h-11 w-11 place-items-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-fg"
                    aria-label={`${s.label} (opens in a new tab)`}
                  >
                    <SocialIcon k={s.key} size={18} />
                  </a>
                </li>
              ))}
          </ul>
        </m.div>
        </div>

        <m.div {...fade(0.4)} className="lg:-mr-6">
          <SystemMap />
        </m.div>

        <m.div {...fade(0.8)} className="flex items-center justify-between gap-4 text-xs text-subtle lg:col-span-2">
          <button
            type="button"
            onClick={() => setPaletteOpen(true)}
            className="hidden items-center gap-2 rounded-full transition-colors hover:text-fg sm:inline-flex"
          >
            Press
            <kbd className="rounded-md border border-line bg-surface px-1.5 py-0.5 font-mono text-[11px] text-fg">{mac ? '⌘' : 'Ctrl'}</kbd>
            <kbd className="rounded-md border border-line bg-surface px-1.5 py-0.5 font-mono text-[11px] text-fg">K</kbd>
            to jump anywhere
          </button>
          <a
            href="#about"
            onClick={(e) => {
              e.preventDefault();
              scrollToId('about');
            }}
            className="inline-flex items-center gap-2 rounded-full transition-colors hover:text-fg"
          >
            <m.span
              animate={reduce ? undefined : { y: [0, 5, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              className="grid h-8 w-5 place-items-start justify-center rounded-full border border-line pt-1.5"
              aria-hidden="true"
            >
              <span className="h-1.5 w-1 rounded-full bg-fg/60" />
            </m.span>
            Scroll to explore <ArrowDown size={12} aria-hidden="true" />
          </a>
        </m.div>
      </div>
    </section>
  );
}
