import { AnimatePresence, LayoutGroup, m, useReducedMotion, useScroll, useSpring, useTransform, useVelocity } from 'framer-motion';
import { ArrowUpRight, Play } from 'lucide-react';
import { lazy, Suspense, useMemo, useState } from 'react';
import { GithubIcon } from '../components/BrandIcons';
import { GitHubPulse } from '../components/GitHubPulse';
import { ProjectCover } from '../components/ProjectCover';
import { SectionHeading } from '../components/Reveal';
import { projectFilters, projects, type Project, type ProjectCategory } from '../data/profile';
import { usePointerFx } from '../hooks/usePointerFx';
import { cn } from '../lib/utils';

const ProjectModal = lazy(() => import('../components/ProjectModal'));

function Card({ p, onOpen }: { p: Project; onOpen: (p: Project) => void }) {
  const fx = usePointerFx<HTMLElement>({ tilt: p.featured ? 4 : 6 });
  const titleId = `project-${p.slug}`;
  return (
    <article
      {...fx}
      data-cursor="View"
      aria-labelledby={titleId}
      className="card spotlight group flex h-full flex-col overflow-hidden transition-[transform,border-color] duration-300 ease-out will-change-transform hover:border-accent/40"
    >
      <div className={cn('relative overflow-hidden border-b border-line bg-bg-2', p.featured ? 'aspect-[16/9]' : 'aspect-[16/10]')}>
        <ProjectCover p={p} sizes={p.featured ? '(min-width: 768px) 50vw, 100vw' : undefined} className="transition-transform duration-700 ease-out group-hover:scale-[1.04]" />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-bg/70 via-transparent to-transparent" />
        {p.badge && (
          <span className="glass absolute top-3 left-3 rounded-full border border-line px-2.5 py-1 text-[11px] font-semibold text-fg">
            {p.badge}
          </span>
        )}
        {p.video && (
          <span className="glass absolute top-3 right-3 inline-flex items-center gap-1 rounded-full border border-line px-2.5 py-1 text-[11px] font-medium text-fg">
            <Play size={11} aria-hidden="true" /> Demo video
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 id={titleId} className={cn('font-display font-semibold tracking-tight', p.featured ? 'text-2xl' : 'text-lg')}>
          {/* Stretched button: the whole card opens the details modal. */}
          <button
            type="button"
            onClick={() => onOpen(p)}
            className="text-left after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:rounded-2xl focus-visible:after:outline-2 focus-visible:after:outline-[var(--ring)]"
            aria-haspopup="dialog"
          >
            {p.title}
          </button>
        </h3>
        <p className="mt-1 text-sm font-medium text-accent">{p.tagline}</p>
        <p className={cn('mt-3 text-sm leading-relaxed text-muted', p.featured ? 'line-clamp-4' : 'line-clamp-3')}>{p.description}</p>
        <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Tech stack">
          {p.stack.slice(0, p.featured ? 7 : 4).map((s) => (
            <li key={s} className="chip">
              {s}
            </li>
          ))}
          {p.stack.length > (p.featured ? 7 : 4) && <li className="chip">+{p.stack.length - (p.featured ? 7 : 4)}</li>}
        </ul>
        <div className="mt-auto flex items-center gap-2 pt-5">
          <a
            href={p.github}
            target="_blank"
            rel="noopener noreferrer"
            className="relative z-20 inline-flex h-9 items-center gap-1.5 rounded-full border border-line bg-surface-2 px-3 text-xs font-medium text-fg transition-colors hover:border-accent/50"
          >
            <GithubIcon size={14} /> Code<span className="sr-only"> for {p.title} on GitHub (opens in a new tab)</span>
          </a>
          {p.live && (
            <a
              href={p.live}
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-20 inline-flex h-9 items-center gap-1.5 rounded-full border border-line bg-surface-2 px-3 text-xs font-medium text-fg transition-colors hover:border-accent/50"
            >
              <ArrowUpRight size={14} aria-hidden="true" /> Live<span className="sr-only"> demo of {p.title} (opens in a new tab)</span>
            </a>
          )}
          <span aria-hidden="true" className="ml-auto text-xs text-subtle transition-colors group-hover:text-fg">
            Details →
          </span>
        </div>
      </div>
    </article>
  );
}

export function Projects() {
  const [filter, setFilter] = useState<'all' | ProjectCategory>('all');
  const [selected, setSelected] = useState<Project | null>(null);
  const reduce = useReducedMotion();

  // Fast scrolling shears the grid slightly; it springs back to rest.
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(velocity, { stiffness: 250, damping: 50 });
  const skewY = useTransform(smoothVelocity, [-1500, 1500], [-1.6, 1.6]);

  const list = useMemo(() => (filter === 'all' ? projects : projects.filter((p) => p.categories.includes(filter))), [filter]);
  const counts = useMemo(() => {
    const c: Record<string, number> = { all: projects.length };
    for (const p of projects) for (const k of p.categories) c[k] = (c[k] ?? 0) + 1;
    return c;
  }, []);

  return (
    <section id="projects" aria-labelledby="projects-title" className="relative mx-auto max-w-6xl px-5 py-20 sm:px-8 md:py-28">
      <SectionHeading id="projects" eyebrow="Selected work" title={<>Things I’ve <span className="text-gradient">built</span>.</>}>
        Agents, full-stack apps and APIs. Open any card for screenshots, stack and links.
      </SectionHeading>

      <GitHubPulse />

      <div role="group" aria-label="Filter projects" className="-mx-1 mb-8 flex gap-2 overflow-x-auto px-1 pb-1">
        <LayoutGroup id="project-filters">
          {projectFilters.map((f) => (
            <button
              key={f.key}
              type="button"
              aria-pressed={filter === f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                'relative isolate inline-flex h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors',
                filter === f.key ? 'border-transparent text-bg' : 'border-line bg-surface text-muted hover:text-fg',
              )}
            >
              {filter === f.key && (
                <m.span layoutId="filter-pill" className="absolute inset-0 -z-10 rounded-full bg-fg" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />
              )}
              {f.label}
              <span className={cn('font-mono text-[11px]', filter === f.key ? 'text-bg/70' : 'text-subtle')}>{counts[f.key] ?? 0}</span>
            </button>
          ))}
        </LayoutGroup>
      </div>

      <p className="sr-only" aria-live="polite">
        Showing {list.length} projects
      </p>

      <m.ul layout={!reduce} style={reduce ? undefined : { skewY }} className="grid grid-cols-1 gap-4 md:grid-cols-6 md:gap-5">
        <AnimatePresence mode="popLayout" initial={false}>
          {list.map((p) => (
            <m.li
              key={p.slug}
              layout={!reduce}
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className={cn(p.featured ? 'md:col-span-3' : 'md:col-span-3 lg:col-span-2')}
            >
              <Card p={p} onOpen={setSelected} />
            </m.li>
          ))}
        </AnimatePresence>
      </m.ul>

      <div className="mt-10 text-center">
        <a
          href="https://github.com/VamsiKrishnaThota03?tab=repositories"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-5 py-2.5 text-sm font-medium text-fg transition-colors hover:border-accent/50"
        >
          <GithubIcon size={16} /> More on GitHub <ArrowUpRight size={14} aria-hidden="true" />
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      </div>

      <Suspense fallback={null}>
        <AnimatePresence>{selected && <ProjectModal key={selected.slug} project={selected} onClose={() => setSelected(null)} />}</AnimatePresence>
      </Suspense>
    </section>
  );
}
