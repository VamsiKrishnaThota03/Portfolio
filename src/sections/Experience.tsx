import { AnimatePresence, m, useReducedMotion, useScroll, useSpring } from 'framer-motion';
import { ChevronDown, MapPin } from 'lucide-react';
import { useId, useRef, useState } from 'react';
import { Reveal, SectionHeading } from '../components/Reveal';
import { experience, type Experience as Exp } from '../data/profile';
import { usePointerFx } from '../hooks/usePointerFx';
import { cn } from '../lib/utils';

function period(e: Exp) {
  return e.start === e.end ? e.start : `${e.start} – ${e.end}`;
}

const hasDetails = (e: Exp) => e.highlights.length > 0;

function Item({ e, index, defaultOpen }: { e: Exp; index: number; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const fx = usePointerFx<HTMLDivElement>();
  const panelId = useId();
  const reduce = useReducedMotion();
  const current = e.end === 'Present';
  const details = hasDetails(e);

  return (
    <li className="relative pl-10 sm:pl-16">
      <span
        aria-hidden="true"
        className={cn(
          'absolute top-7 left-[11px] grid h-[18px] w-[18px] place-items-center rounded-full border-2 sm:left-[23px]',
          current ? 'border-accent bg-bg' : 'border-line bg-bg-2',
        )}
      >
        {current && <span className="animate-pulse-ring absolute h-3 w-3 rounded-full bg-accent" />}
        <span className={cn('h-2 w-2 rounded-full', current ? 'bg-accent' : 'bg-subtle')} />
      </span>

      <Reveal delay={index * 0.05}>
        <div {...fx} className="card spotlight overflow-hidden">
          <div className="relative z-10 p-5 sm:p-7">
            <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-2">
              <div>
                <p className="font-mono text-xs tracking-wider text-accent uppercase">
                  {period(e)}
                  {current && (
                    <span className="ml-2 rounded-full bg-accent/15 px-2 py-0.5 text-[10px] text-accent">{e.incoming ? 'Incoming' : 'Now'}</span>
                  )}
                </p>
                <h3 className="mt-2 font-display text-xl font-semibold tracking-tight sm:text-2xl">
                  {e.role} <span className="text-muted">·</span> {e.company}
                </h3>
                {e.team && <p className="mt-0.5 text-sm text-muted">{e.team}</p>}
              </div>
              {e.location && (
                <p className="inline-flex items-center gap-1 text-sm text-subtle">
                  <MapPin size={14} aria-hidden="true" />
                  {e.location}
                </p>
              )}
            </div>

            {e.summary && <p className="mt-4 max-w-3xl leading-relaxed text-muted">{e.summary}</p>}

            {details && (
            <>
            <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Tech stack">
              {e.stack.map((s) => (
                <li key={s} className="chip">
                  {s}
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls={panelId}
              className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-line bg-surface-2 px-3.5 py-1.5 text-sm font-medium text-fg transition-colors hover:border-accent/50"
            >
              {open ? 'Hide highlights' : `Show ${e.highlights.length} highlights`}
              <ChevronDown size={16} aria-hidden="true" className={cn('transition-transform', open && 'rotate-180')} />
            </button>

            <AnimatePresence initial={false}>
              {open && (
                <m.div
                  id={panelId}
                  initial={reduce ? false : { height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <ul className="mt-5 space-y-3 border-t border-line pt-5">
                    {e.highlights.map((h, i) => (
                      <m.li
                        key={i}
                        initial={reduce ? false : { opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.04 * i }}
                        className="flex gap-3 text-[15px] leading-relaxed text-muted"
                      >
                        <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-br from-accent to-accent-2" />
                        <span>{h}</span>
                      </m.li>
                    ))}
                  </ul>
                </m.div>
              )}
            </AnimatePresence>
            </>
            )}
          </div>
        </div>
      </Reveal>
    </li>
  );
}

export function Experience() {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 60%'] });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <section id="experience" aria-labelledby="experience-title" className="relative mx-auto max-w-6xl px-5 py-20 sm:px-8 md:py-28">
      <SectionHeading id="experience" eyebrow="Experience" title={<>Where I’ve <span className="text-gradient">shipped</span>.</>}>
        From microservice throughput to global launches, and next, Google. Expand any role for the details.
      </SectionHeading>

      <ol ref={ref} className="relative space-y-6">
        <span aria-hidden="true" className="absolute top-2 bottom-2 left-[19px] w-px bg-line sm:left-[31px]" />
        <m.span
          aria-hidden="true"
          style={{ scaleY: fill }}
          className="absolute top-2 bottom-2 left-[19px] w-px origin-top bg-gradient-to-b from-accent via-accent-2 to-accent-3 sm:left-[31px]"
        />
        {experience.map((e, i) => (
          <Item key={`${e.company}-${e.start}`} e={e} index={i} defaultOpen={e === experience.find(hasDetails)} />
        ))}
      </ol>
    </section>
  );
}
