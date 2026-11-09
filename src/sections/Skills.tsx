import { m } from 'framer-motion';
import { Bot, Cloud, Code2, Database, Monitor, type LucideIcon } from 'lucide-react';
import { lazy, Suspense, useRef, useState } from 'react';
import { GROUP_HUES } from '../components/skillHues';
import { useInView } from '../hooks/useLazyInView';

const SkillField = lazy(() => import('../components/SkillField'));
import { Reveal, SectionHeading } from '../components/Reveal';
import { skills } from '../data/profile';
import { usePointerFx } from '../hooks/usePointerFx';
import { cn } from '../lib/utils';

const icons: Record<string, LucideIcon> = {
  lang: Code2,
  backend: Database,
  cloud: Cloud,
  frontend: Monitor,
  ai: Bot,
};

function GroupCard({ g, active, onSelect, index }: { g: (typeof skills)[number]; active: boolean; onSelect: () => void; index: number }) {
  const fx = usePointerFx<HTMLDivElement>();
  const Icon = icons[g.key] ?? Code2;
  return (
    <Reveal delay={index * 0.05} className="h-full">
      <div
        {...fx}
        className={cn(
          'card spotlight h-full p-5 transition-[border-color,opacity] duration-300',
          active ? 'border-accent/50' : 'opacity-100',
        )}
      >
        <div className="relative z-10">
          <button type="button" onClick={onSelect} aria-pressed={active} className="flex w-full items-center gap-3 rounded-lg text-left">
            <span
              className={cn(
                'grid h-10 w-10 place-items-center rounded-xl border border-line transition-colors',
                active ? 'bg-accent text-white' : 'bg-surface-2 text-accent',
              )}
            >
              <Icon size={18} aria-hidden={true} />
            </span>
            <span>
              <span className="block font-display text-lg font-semibold">{g.title}</span>
              <span className="block text-xs text-subtle">{g.blurb}</span>
            </span>
            <span className="ml-auto font-mono text-xs text-subtle">{g.items.length}</span>
          </button>
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {g.items.map((s, i) => (
              <m.li
                key={s}
                whileHover={{ y: -2 }}
                animate={active ? { scale: [1, 1.06, 1] } : { scale: 1 }}
                transition={{ delay: active ? i * 0.025 : 0, duration: 0.35 }}
                className={cn(
                  'cursor-default rounded-full border px-3 py-1 text-sm transition-colors',
                  active ? 'border-accent/50 bg-accent/10 text-fg' : 'border-line bg-surface text-muted hover:border-accent/40 hover:text-fg',
                )}
              >
                {s}
              </m.li>
            ))}
          </ul>
        </div>
      </div>
    </Reveal>
  );
}

export function Skills() {
  const [active, setActive] = useState<string | null>(null);
  const fieldRef = useRef<HTMLDivElement>(null);
  const showField = useInView(fieldRef, '400px');

  return (
    <section id="skills" aria-labelledby="skills-title" className="relative py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading id="skills" eyebrow="Toolbox" title={<>The <span className="text-gradient">stack</span> I reach for.</>}>
          Grab the bubbles, fling them, or pick a cluster. Most of my day is Java, Python and AWS; most of my weekends are TypeScript and agents.
        </SectionHeading>
      </div>

      <div className="mx-auto mb-12 max-w-6xl px-5 sm:px-8">
        <Reveal>
          <div className="card overflow-hidden">
            <div className="flex flex-wrap items-center gap-2 border-b border-line bg-surface px-4 py-3 sm:px-5">
              <span className="mr-1 font-mono text-[11px] text-subtle">cluster:</span>
              <button
                type="button"
                aria-pressed={active === null}
                onClick={() => setActive(null)}
                className={cn(
                  'h-8 rounded-full border px-3 text-xs font-medium transition-colors',
                  active === null ? 'border-fg bg-fg text-bg' : 'border-line text-muted hover:text-fg',
                )}
              >
                All
              </button>
              {skills.map((g, i) => (
                <button
                  key={g.key}
                  type="button"
                  aria-pressed={active === g.key}
                  onClick={() => setActive((a) => (a === g.key ? null : g.key))}
                  className={cn(
                    'inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-xs font-medium transition-colors',
                    active === g.key ? 'border-fg bg-fg text-bg' : 'border-line text-muted hover:text-fg',
                  )}
                >
                  <span className="h-2 w-2 rounded-full" style={{ background: `hsl(${GROUP_HUES[i]} 85% 60%)` }} aria-hidden="true" />
                  {g.title}
                </button>
              ))}
              <span className="ml-auto hidden font-mono text-[11px] text-subtle md:inline">grab · fling · hover to repel</span>
            </div>
            <div ref={fieldRef} className="bg-[radial-gradient(ellipse_at_center,color-mix(in_srgb,var(--accent)_10%,transparent),transparent_70%)]">
              {showField ? (
                <Suspense fallback={<div className="h-[30rem] sm:h-[34rem]" />}>
                  <SkillField groups={skills} active={active} onPick={(k) => setActive(k)} />
                </Suspense>
              ) : (
                <div className="h-[30rem] sm:h-[34rem]" />
              )}
            </div>
          </div>
        </Reveal>
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 px-5 sm:grid-cols-2 sm:px-8 lg:grid-cols-3">
        {skills.map((g, i) => (
          <div key={g.key} className={cn(g.key === 'backend' || g.key === 'cloud' ? 'lg:col-span-1' : '', 'h-full')}>
            <GroupCard g={g} index={i} active={active === g.key} onSelect={() => setActive((a) => (a === g.key ? null : g.key))} />
          </div>
        ))}
        <Reveal delay={0.25} className="h-full">
          <div className="card flex h-full flex-col justify-center gap-2 border-dashed p-5">
            <p className="font-display text-lg font-semibold">Always learning</p>
            <p className="text-sm leading-relaxed text-muted">
              Rules engines, event-driven systems and agent tooling (MCP) are where I’m spending my curiosity right now.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
