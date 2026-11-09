import { AnimatePresence, LayoutGroup, m, useReducedMotion } from 'framer-motion';
import { Check, Mail, Zap } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Reveal, SectionHeading } from '../components/Reveal';
import { profile, projects } from '../data/profile';
import { cn } from '../lib/utils';

const fullstackCount = projects.filter((p) => p.categories.includes('fullstack')).length;

const RULES: { id: string; label: string; fact: string; evidence: string[] }[] = [
  {
    id: 'backend',
    label: 'Backend at scale',
    fact: 'backend',
    evidence: [
      'Migrated a fee-exemption benefit onto an event-driven discount platform (S3 → SQS → rules engine).',
      'Raised microservice throughput by 30% with Redis caching and concurrent job queues.',
    ],
  },
  {
    id: 'aws',
    label: 'AWS & infrastructure',
    fact: 'aws',
    evidence: [
      'Region migration of a customer-facing service: IAM across 3 AWS accounts, 512 EC2 instances, 511 resources replicated.',
      'Zero-overlap cutover of 5 benefits across 2 CDK pipelines.',
    ],
  },
  {
    id: 'rules',
    label: 'Rules engines',
    fact: 'rules',
    evidence: ['Wrote the Drools rules behind a discount platform.', 'Rules-based eligibility engine with 45+ marketplace-specific configs.'],
  },
  {
    id: 'data',
    label: 'Data pipelines',
    fact: 'data',
    evidence: [
      'Moved eligibility out of SQL batch pipelines; the pipeline shrank to 3 jobs.',
      'Built an S3 → DynamoDB Glue job and SEV-3 alarms on critical pipeline jobs.',
    ],
  },
  {
    id: 'tools',
    label: 'Developer tooling',
    fact: 'tooling',
    evidence: ['Python CLI that root-causes P0 tickets: 5–6 hours → ~30 minutes (~90%), adopted team-wide.'],
  },
  {
    id: 'ai',
    label: 'AI agents',
    fact: 'ai',
    evidence: [
      'Decision Memory: Rovo agent, MCP server and Teamwork Graph connector (Codegeist 2026).',
      'Haggl: Gemini agents that negotiate within code-enforced limits, settled with PayPal.',
    ],
  },
  {
    id: 'fullstack',
    label: 'Full-stack product',
    fact: 'fullstack',
    evidence: [
      'Next.js + Prisma compliance features at Komplai; KYB automation cut onboarding time by 30%.',
      `${fullstackCount} full-stack projects on GitHub (React, Next.js, Express, Go).`,
    ],
  },
  {
    id: 'reliability',
    label: 'Reliability & security',
    fact: 'reliability',
    evidence: [
      'Peak-readiness hardening: timeout alarms, emergency deploy blocking, bake times, CSP headers.',
      'CloudWatch monitoring for 24 APIs; fixed log-injection and sensitive-data issues.',
    ],
  },
  {
    id: 'launch',
    label: 'Big launches',
    fact: 'launch',
    evidence: ['Key contributor to a global launch across 8 marketplaces (NA, EU, JP); led beta and production UAT.'],
  },
];

export function FitFinder() {
  const [on, setOn] = useState<Set<string>>(() => new Set(['backend', 'aws', 'ai']));
  const reduce = useReducedMotion();
  const fired = useMemo(() => RULES.filter((r) => on.has(r.id)), [on]);
  const toggle = (id: string) =>
    setOn((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  const mailto = `mailto:${profile.email}?subject=${encodeURIComponent('Role fit: ' + fired.map((r) => r.label).join(', '))}`;

  return (
    <section id="fit" aria-labelledby="fit-title" className="relative mx-auto max-w-6xl px-5 py-20 sm:px-8 md:py-28">
      <SectionHeading id="fit" eyebrow="Hiring?" title={<>Run my <span className="text-gradient">rules engine</span> on your role.</>}>
        I’ve written a lot of eligibility rules, so here’s one for me. Assert what your team needs and watch which rules fire, each one
        backed by evidence.
      </SectionHeading>

      <div className="grid gap-5 lg:grid-cols-[1fr_1.25fr]">
        <Reveal>
          <div className="card h-full p-5 sm:p-6">
            <p className="font-mono text-[11px] text-subtle">insert facts → working memory</p>
            <div role="group" aria-label="What your role needs" className="mt-4 flex flex-wrap gap-2">
              {RULES.map((r) => {
                const active = on.has(r.id);
                return (
                  <button
                    key={r.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => toggle(r.id)}
                    className={cn(
                      'inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-all',
                      active
                        ? 'border-accent/60 bg-accent/15 text-fg shadow-[0_0_24px_-8px] shadow-accent'
                        : 'border-line bg-surface text-muted hover:border-accent/40 hover:text-fg',
                    )}
                  >
                    <span
                      className={cn('grid h-4 w-4 place-items-center rounded border', active ? 'border-accent bg-accent text-white' : 'border-line')}
                      aria-hidden="true"
                    >
                      {active && <Check size={11} strokeWidth={3} />}
                    </span>
                    {r.label}
                  </button>
                );
              })}
            </div>

            <div className="mt-6 rounded-xl border border-line bg-[#0b0b12] p-4 font-mono text-[12px] leading-relaxed text-white/75" aria-hidden="true">
              <p className="text-white/40">// working memory</p>
              {fired.length === 0 && <p className="text-white/40">(empty: toggle a fact)</p>}
              {fired.map((r) => (
                <p key={r.id}>
                  insert(<span className="text-[#79c0ff]">new</span> Need(<span className="text-[#a5d6ff]">"{r.fact}"</span>));
                </p>
              ))}
              <p className="mt-2 text-white/40">kieSession.fireAllRules();</p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="card h-full overflow-hidden">
            <div className="flex items-center justify-between border-b border-line bg-surface px-5 py-3 font-mono text-[11px] text-subtle">
              <span>agenda</span>
              <span aria-live="polite">
                <span className="text-accent-2">{fired.length}</span> / {RULES.length} rules fired
              </span>
            </div>
            <div className="max-h-[30rem] space-y-3 overflow-y-auto p-5">
              {fired.length === 0 && <p className="py-12 text-center text-sm text-subtle">No facts asserted yet. Toggle what your role needs.</p>}
              <LayoutGroup>
                <AnimatePresence initial={false} mode="popLayout">
                  {fired.map((r) => (
                    <m.article
                      key={r.id}
                      layout={!reduce}
                      initial={reduce ? false : { opacity: 0, y: 12, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="rounded-xl border border-line bg-surface p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-mono text-[12px]">
                          <span className="text-accent">rule</span> <span className="text-fg">"{r.label}"</span>
                        </p>
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 font-mono text-[10px] text-emerald-600 dark:text-emerald-300">
                          <Zap size={10} aria-hidden="true" /> fired
                        </span>
                      </div>
                      <ul className="mt-3 space-y-1.5">
                        {r.evidence.map((ev) => (
                          <li key={ev} className="flex gap-2.5 text-sm leading-relaxed text-muted">
                            <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-br from-accent to-accent-2" />
                            {ev}
                          </li>
                        ))}
                      </ul>
                    </m.article>
                  ))}
                </AnimatePresence>
              </LayoutGroup>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-5 py-4">
              <p className="text-sm text-muted">{fired.length > 0 ? 'Looks like a match.' : 'Waiting for facts…'}</p>
              <a
                href={mailto}
                className="inline-flex h-10 items-center gap-2 rounded-full bg-fg px-4 text-sm font-semibold text-bg transition-opacity hover:opacity-90"
              >
                <Mail size={15} aria-hidden="true" /> Send me this match
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
