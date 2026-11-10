import { AnimatePresence, m, useInView, useReducedMotion } from 'framer-motion';
import { ArrowRight, MapPin } from 'lucide-react';
import { useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { Reveal, SectionHeading } from '../components/Reveal';
import { experience, type Experience as Exp } from '../data/profile';
import { cn } from '../lib/utils';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const toIndex = (s: string) => {
  const [mon, yr] = s.split(' ');
  return Number(yr) * 12 + MONTHS.indexOf(mon);
};

// Axis: Jan 2023 to Jun 2027 so the current role has room to "run".
const AXIS_START = toIndex('Jan 2023');
const AXIS_END = toIndex('Jun 2027');
const span = AXIS_END - AXIS_START;
const pct = (i: number) => ((i - AXIS_START) / span) * 100;

function spanOf(e: Exp) {
  const start = toIndex(e.start);
  if (e.end === 'Present') return { start, end: AXIS_END, months: 0 };
  const end = toIndex(e.end);
  return { start, end: end + 1, months: end - start + 1 };
}

function fmtDuration(m: number) {
  if (m <= 0) return 'starting';
  const y = Math.floor(m / 12);
  const r = m % 12;
  return [y ? `${y}y` : '', r ? `${r}m` : ''].filter(Boolean).join(' ');
}

const period = (e: Exp) => (e.start === e.end ? e.start : `${e.start} – ${e.end}`);
const hues = [210, 265, 35, 160, 330];

/** One row of the trace: a company span, or a team span nested inside one. */
type Row = { exp: Exp; depth: number; hue: number };

function buildRows(list: Exp[]): Row[] {
  const rows: Row[] = [];
  list.forEach((e, i) => {
    const hue = hues[i % hues.length];
    rows.push({ exp: e, depth: 0, hue });
    e.teams?.forEach((t, j) => rows.push({ exp: t, depth: 1, hue: (hue + 28 * (j + 1)) % 360 }));
  });
  return rows;
}

export function Experience() {
  const rows = useMemo(() => buildRows(experience), []);
  const spans = useMemo(() => rows.map((r) => spanOf(r.exp)), [rows]);
  // Open on the company span that holds teams, so the panel leads with the
  // full tenure (Amazon: Jul 2025 – Nov 2026) rather than one team's dates.
  const [sel, setSel] = useState(() => {
    const company = rows.findIndex((r) => r.exp.teams?.length);
    if (company !== -1) return company;
    const detailed = rows.findIndex((r) => r.exp.highlights.length > 0);
    return detailed === -1 ? 0 : detailed;
  });
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const reduce = useReducedMotion();
  const totalMonths = toIndex('Nov 2026') - toIndex('Jun 2023');
  const e = rows[sel].exp;

  // One trigger for the whole trace, which then staggers every bar. Observing
  // each bar individually is unreliable: a bar at scaleX 0 has no area.
  const traceRef = useRef<HTMLDivElement>(null);
  const traceInView = useInView(traceRef, { once: true, margin: '0px 0px -10% 0px' });
  const play = reduce || traceInView;

  const select = (i: number) => {
    setSel(i);
    tabs.current[i]?.focus();
  };

  const onKey = (ev: KeyboardEvent<HTMLButtonElement>, i: number) => {
    let n: number;
    if (ev.key === 'ArrowDown' || ev.key === 'ArrowRight') n = (i + 1) % rows.length;
    else if (ev.key === 'ArrowUp' || ev.key === 'ArrowLeft') n = (i - 1 + rows.length) % rows.length;
    else if (ev.key === 'Home') n = 0;
    else if (ev.key === 'End') n = rows.length - 1;
    else return;
    ev.preventDefault();
    select(n);
  };

  return (
    <section id="experience" aria-labelledby="experience-title" className="relative mx-auto max-w-6xl px-5 py-20 sm:px-8 md:py-28">
      <SectionHeading id="experience" eyebrow="Experience" title={<>My career, as a <span className="text-gradient">distributed trace</span>.</>}>
        Each role is a span, and a team inside a company is a child span. Pick one to see its attributes, metrics and events.
      </SectionHeading>

      <Reveal>
        <div className="card overflow-hidden">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 border-b border-line bg-surface px-4 py-3 font-mono text-[11px] text-subtle sm:px-6">
            <span>
              <span className="text-accent">trace</span> career.vamsi
            </span>
            <span>spans: {rows.length}</span>
            <span>duration: {fmtDuration(totalMonths)}</span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true" /> status: OK
            </span>
          </div>

          <div className="hidden grid-cols-[16rem_1fr] border-b border-line px-6 py-2 font-mono text-[10px] text-subtle md:grid" aria-hidden="true">
            <span>span</span>
            <div className="relative h-4">
              {[2023, 2024, 2025, 2026, 2027].map((y) => (
                <span key={y} className={cn('absolute', y === 2023 ? '' : '-translate-x-1/2')} style={{ left: `${pct(y * 12)}%` }}>
                  {y}
                </span>
              ))}
            </div>
          </div>

          <div ref={traceRef} role="tablist" aria-label="Roles and teams" aria-orientation="vertical">
            {rows.map((row, i) => {
              const x = row.exp;
              const s = spans[i];
              const selected = i === sel;
              const child = row.depth > 0;
              return (
                <button
                  key={`${x.company}-${x.team ?? x.role}-${x.start}`}
                  ref={(b) => {
                    tabs.current[i] = b;
                  }}
                  type="button"
                  role="tab"
                  id={`span-tab-${i}`}
                  aria-selected={selected}
                  aria-controls="span-panel"
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setSel(i)}
                  onKeyDown={(ev) => onKey(ev, i)}
                  className={cn(
                    'grid w-full grid-cols-1 gap-2 border-b border-line px-4 py-3.5 text-left transition-colors last:border-b-0 sm:px-6 md:grid-cols-[16rem_1fr] md:items-center md:gap-0',
                    selected ? 'bg-surface-2' : 'hover:bg-surface',
                  )}
                >
                  <span className={cn('min-w-0 pr-4', child && 'pl-4')}>
                    <span className="flex items-center gap-2">
                      {/* Nesting guide: a small elbow marks a child span. */}
                      {child && (
                        <span aria-hidden="true" className="-ml-3 h-3 w-2.5 shrink-0 rounded-bl-[4px] border-b border-l border-line" />
                      )}
                      <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: `hsl(${row.hue} 85% 62%)` }} aria-hidden="true" />
                      <span className={cn('truncate font-display font-semibold', child ? 'text-[14px]' : 'text-[15px]')}>
                        {child ? x.team : x.company}
                      </span>
                      {x.incoming && (
                        <span className="rounded-full bg-accent/15 px-1.5 py-0.5 font-mono text-[9px] text-accent uppercase">current</span>
                      )}
                    </span>
                    <span className="mt-0.5 block truncate pl-4 text-xs text-subtle">
                      {x.teams ? `${x.teams.length} teams` : child ? x.role : (x.team ?? x.role)} · {period(x)}
                    </span>
                  </span>
                  <span className="relative block h-7" aria-hidden="true">
                    {[2024, 2025, 2026, 2027].map((y) => (
                      <span key={y} className="absolute inset-y-0 w-px bg-line" style={{ left: `${pct(y * 12)}%` }} />
                    ))}
                    <m.span
                      className={cn(
                        'absolute top-1/2 flex -translate-y-1/2 items-center overflow-hidden rounded-md px-2 font-mono text-[10px] whitespace-nowrap text-white',
                        child ? 'h-4' : 'h-5',
                        selected && 'ring-2 ring-white/50',
                      )}
                      style={{
                        left: `${pct(s.start)}%`,
                        width: `max(${pct(s.end) - pct(s.start)}%, 6px)`,
                        background: x.incoming
                          ? `repeating-linear-gradient(135deg, hsl(${row.hue} 85% 52% / 0.9) 0 6px, hsl(${row.hue} 85% 52% / 0.45) 6px 12px)`
                          : `linear-gradient(90deg, hsl(${row.hue} 80% 48%), hsl(${(row.hue + 40) % 360} 80% 52%))`,
                        // A parent span is the envelope of its children, so it
                        // reads as a container rather than work of its own.
                        opacity: x.teams ? 0.55 : 1,
                        transformOrigin: 'left center',
                      }}
                      initial={reduce ? false : { scaleX: 0 }}
                      animate={play ? { scaleX: 1 } : { scaleX: 0 }}
                      transition={{ duration: 0.9, delay: 0.1 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                    >
                      {s.months >= 5 && <span className="hidden sm:inline">{fmtDuration(s.months)}</span>}
                      {x.incoming && <span className="hidden sm:inline">now →</span>}
                    </m.span>
                  </span>
                </button>
              );
            })}
          </div>

          <div id="span-panel" role="tabpanel" aria-labelledby={`span-tab-${sel}`} className="border-t border-line p-5 sm:p-7">
            <AnimatePresence mode="wait" initial={false}>
              <m.div
                key={sel}
                initial={reduce ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-xs tracking-wider text-accent uppercase">{period(e)}</p>
                    <h3 className="mt-1.5 font-display text-2xl font-semibold tracking-tight">
                      {e.role} <span className="text-muted">·</span> {e.company}
                    </h3>
                    {e.team && <p className="mt-0.5 text-sm text-muted">{e.team}</p>}
                  </div>
                  {e.location && (
                    <p className="inline-flex items-center gap-1 text-sm text-subtle">
                      <MapPin size={14} aria-hidden="true" /> {e.location}
                    </p>
                  )}
                </div>

                {e.incoming ? (
                  <p className="mt-5 max-w-xl text-muted">Software Engineer at Google since November 2026.</p>
                ) : (
                  <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.6fr]">
                    <div className="space-y-5">
                      {e.summary && <p className="leading-relaxed text-muted">{e.summary}</p>}
                      {e.metrics && (
                        <dl className="grid grid-cols-2 gap-2">
                          {e.metrics.map((mt) => (
                            <div key={mt.k} className="rounded-xl border border-line bg-surface px-3 py-2.5">
                              <dt className="font-mono text-[10px] text-subtle">{mt.k}</dt>
                              <dd className="mt-0.5 font-display text-lg font-semibold text-fg">{mt.v}</dd>
                            </div>
                          ))}
                        </dl>
                      )}
                      <ul className="flex flex-wrap gap-1.5" aria-label="Tech stack">
                        {e.stack.map((t) => (
                          <li key={t} className="chip">
                            {t}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      {e.teams ? (
                        <>
                          <p className="mb-3 font-mono text-[11px] text-subtle">child spans ({e.teams.length})</p>
                          <ul className="space-y-2.5">
                            {e.teams.map((t) => {
                              const target = rows.findIndex((r) => r.exp === t);
                              return (
                                <li key={t.team}>
                                  <button
                                    type="button"
                                    onClick={() => select(target)}
                                    className="group flex w-full items-start gap-3 rounded-xl border border-line bg-surface px-4 py-3 text-left transition-colors hover:border-accent/50 hover:bg-surface-2"
                                  >
                                    <span
                                      aria-hidden="true"
                                      className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
                                      style={{ background: `hsl(${rows[target]?.hue ?? 265} 85% 62%)` }}
                                    />
                                    <span className="min-w-0 flex-1">
                                      <span className="flex flex-wrap items-center gap-x-2">
                                        <span className="font-display text-[15px] font-semibold">{t.team}</span>
                                        <span className="font-mono text-[10px] text-subtle">
                                          {period(t)} · {fmtDuration(spanOf(t).months)}
                                        </span>
                                      </span>
                                      <span className="mt-1 block text-sm leading-relaxed text-muted">{t.summary}</span>
                                    </span>
                                    <ArrowRight
                                      size={15}
                                      aria-hidden="true"
                                      className="mt-1 shrink-0 text-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-fg"
                                    />
                                  </button>
                                </li>
                              );
                            })}
                          </ul>
                        </>
                      ) : (
                        <>
                          <p className="mb-3 font-mono text-[11px] text-subtle">events ({e.highlights.length})</p>
                          <ol className="relative space-y-3 border-l border-line pl-5">
                            {e.highlights.map((h, i) => (
                              <m.li
                                key={i}
                                initial={reduce ? false : { opacity: 0, x: -6 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.03 * i }}
                                className="relative text-[15px] leading-relaxed text-muted"
                              >
                                <span
                                  aria-hidden="true"
                                  className="absolute top-2 -left-[25px] h-2.5 w-2.5 rounded-full border-2 border-bg-2 bg-gradient-to-br from-accent to-accent-2"
                                />
                                {h}
                              </m.li>
                            ))}
                          </ol>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </m.div>
            </AnimatePresence>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
