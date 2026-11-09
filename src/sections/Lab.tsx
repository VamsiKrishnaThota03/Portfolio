import { lazy, Suspense, useRef } from 'react';
import { Reveal, SectionHeading } from '../components/Reveal';
import { useInView } from '../hooks/useLazyInView';

const IncidentReplay = lazy(() => import('../components/IncidentReplay'));

export function Lab() {
  const ref = useRef<HTMLDivElement>(null);
  const show = useInView(ref, '500px');
  return (
    <section id="lab" aria-labelledby="lab-title" className="relative mx-auto max-w-6xl px-5 py-20 sm:px-8 md:py-28">
      <SectionHeading id="lab" eyebrow="Lab · incident replay" title={<>Watch a P0 get <span className="text-gradient">root-caused</span>.</>}>
        The tool I’m proudest of turned a 5–6 hour investigation into about 30 minutes. This replay shows how it works: walk the
        dependent pipeline jobs, stream their outputs, isolate the break, then have an LLM explain it.
      </SectionHeading>
      <Reveal>
        <div ref={ref} className="min-h-[32rem]">
          {show && (
            <Suspense fallback={<div className="h-[32rem] animate-pulse rounded-2xl border border-line bg-surface" />}>
              <IncidentReplay />
            </Suspense>
          )}
        </div>
      </Reveal>
    </section>
  );
}
