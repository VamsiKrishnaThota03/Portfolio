import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { Reveal, SectionHeading } from '../components/Reveal';

const Terminal = lazy(() => import('../components/Terminal'));

export function TerminalSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [mount, setMount] = useState(false);

  // Only fetch the terminal chunk when the section is about to scroll into view.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setMount(true);
          io.disconnect();
        }
      },
      { rootMargin: '600px 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section id="terminal" aria-labelledby="terminal-title" className="relative mx-auto max-w-6xl px-5 py-16 sm:px-8 md:py-24">
      <div className="grid items-center gap-10 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <SectionHeading id="terminal" eyebrow="Playground" title={<>Prefer a <span className="text-gradient">shell</span>?</>}>
            Explore this site from a tiny terminal. Try <code className="font-mono text-fg">help</code>,{' '}
            <code className="font-mono text-fg">projects</code> or <code className="font-mono text-fg">resume</code>. Arrow keys
            walk your history and Tab completes.
          </SectionHeading>
        </div>
        <Reveal className="lg:col-span-3">
          <div ref={ref} className="min-h-[28rem]">
            {mount && (
              <Suspense fallback={<div className="h-[28rem] animate-pulse rounded-2xl border border-line bg-surface" />}>
                <Terminal />
              </Suspense>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
