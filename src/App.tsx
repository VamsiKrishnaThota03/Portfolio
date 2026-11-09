import { AnimatePresence, LazyMotion, MotionConfig } from 'framer-motion';
import { lazy, Suspense, useEffect } from 'react';
import { Footer } from './components/Footer';
import { Navbar } from './components/Navbar';
import { Toaster } from './components/Toaster';
import { useApp } from './lib/app-context';
import { About } from './sections/About';
import { Contact } from './sections/Contact';
import { Experience } from './sections/Experience';
import { Hero } from './sections/Hero';
import { Projects } from './sections/Projects';
import { Skills } from './sections/Skills';
import { TerminalSection } from './sections/TerminalSection';

const CommandPalette = lazy(() => import('./components/CommandPalette'));
// Animation features are fetched as a separate chunk after first paint.
const loadMotionFeatures = () => import('./lib/motion-features').then((r) => r.default);

export default function App() {
  const { paletteOpen, setPaletteOpen } = useApp();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen(!paletteOpen);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [paletteOpen, setPaletteOpen]);

  // Warm the palette chunk once the page is idle so the first ⌘K feels instant.
  useEffect(() => {
    const warm = () => void import('./components/CommandPalette');
    const w = window as Window & { requestIdleCallback?: (cb: () => void) => number };
    if (w.requestIdleCallback) w.requestIdleCallback(warm);
    else window.setTimeout(warm, 2500);
  }, []);

  return (
    <LazyMotion features={loadMotionFeatures} strict>
    <MotionConfig reducedMotion="user">
      <a
        href="#main"
        className="sr-only rounded-full bg-fg px-4 py-2 text-sm font-semibold text-bg focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100]"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main">
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <TerminalSection />
        <Contact />
      </main>
      <Footer />
      <Suspense fallback={null}>
        <AnimatePresence>{paletteOpen && <CommandPalette onClose={() => setPaletteOpen(false)} />}</AnimatePresence>
      </Suspense>
      <Toaster />
      <div aria-hidden="true" className="noise pointer-events-none fixed inset-0 z-[60] opacity-[0.025] mix-blend-overlay" />
    </MotionConfig>
    </LazyMotion>
  );
}
