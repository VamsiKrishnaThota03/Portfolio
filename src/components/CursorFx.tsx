import { AnimatePresence, m, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useFinePointer, useReducedMotionPref } from '../hooks/useMediaQuery';

type Mode = 'default' | 'link' | 'label' | 'text' | 'hidden';

/**
 * Contextual cursor: a fast dot plus a springy ring that grows over
 * interactive elements and morphs into a labelled pill over elements
 * with a `data-cursor="…"` attribute. Mouse-only; never rendered for
 * touch or reduced motion, so the native cursor stays untouched there.
 */
export function CursorFx() {
  const fine = useFinePointer();
  const reduce = useReducedMotionPref();
  if (!fine || reduce) return null;
  return <Cursor />;
}

function Cursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 320, damping: 26, mass: 0.55 });
  const ry = useSpring(y, { stiffness: 320, damping: 26, mass: 0.55 });
  const [mode, setMode] = useState<Mode>('hidden');
  const [label, setLabel] = useState('');
  const [down, setDown] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add('cursor-fx');

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      x.set(e.clientX);
      y.set(e.clientY);
      const t = e.target;
      if (!(t instanceof Element)) return setMode('default');
      if (t.closest('input, textarea, select, [contenteditable="true"]')) return setMode('text');
      const labelled = t.closest<HTMLElement>('[data-cursor]');
      if (labelled?.dataset.cursor) {
        setLabel(labelled.dataset.cursor);
        return setMode('label');
      }
      if (t.closest('a, button, [role="button"], [role="tab"], summary, label')) return setMode('link');
      setMode('default');
    };
    const onLeave = () => setMode('hidden');
    const onDown = () => setDown(true);
    const onUp = () => setDown(false);

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('pointerup', onUp, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      document.documentElement.classList.remove('cursor-fx');
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, [x, y]);

  const ringVisible = mode === 'default' || mode === 'link';
  const size = mode === 'link' ? 52 : 32;

  return (
    <>
      {/* Trailing ring / label pill */}
      <m.div aria-hidden="true" className="pointer-events-none fixed top-0 left-0 z-[95]" style={{ x: rx, y: ry }}>
        <m.div
          className="absolute rounded-full border border-white mix-blend-difference"
          animate={{
            width: size,
            height: size,
            opacity: ringVisible ? 1 : 0,
            scale: down ? 0.8 : 1,
            backgroundColor: mode === 'link' ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0)',
          }}
          transition={{ type: 'spring', stiffness: 380, damping: 26 }}
          style={{ translateX: '-50%', translateY: '-50%' }}
        />
        <AnimatePresence>
          {mode === 'label' && (
            <m.span
              key={label}
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: down ? 0.92 : 1, opacity: 1 }}
              exit={{ scale: 0.4, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 28 }}
              className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-fg px-4 py-2 font-mono text-[11px] font-semibold tracking-wider whitespace-nowrap text-bg uppercase"
            >
              {label}
            </m.span>
          )}
        </AnimatePresence>
      </m.div>
      {/* Precise dot */}
      <m.div
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[95] h-1.5 w-1.5 rounded-full bg-white mix-blend-difference"
        style={{ x, y, translateX: '-50%', translateY: '-50%' }}
        animate={{ opacity: mode === 'hidden' || mode === 'text' || mode === 'label' ? 0 : 1, scale: down ? 0.6 : 1 }}
        transition={{ duration: 0.15 }}
      />
    </>
  );
}
