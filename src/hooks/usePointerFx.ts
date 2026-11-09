import { useCallback, useRef, type PointerEvent as ReactPointerEvent } from 'react';
import { useFinePointer, useReducedMotionPref } from './useMediaQuery';

/**
 * Cursor spotlight (+ optional 3D tilt) for cards. Writes CSS variables only,
 * so there are no React re-renders while the pointer moves.
 */
export function usePointerFx<T extends HTMLElement>({ tilt = 0 }: { tilt?: number } = {}) {
  const ref = useRef<T>(null);
  const fine = useFinePointer();
  const reduce = useReducedMotionPref();
  const frame = useRef(0);

  const onPointerMove = useCallback(
    (e: ReactPointerEvent<T>) => {
      const el = ref.current;
      if (!el || !fine) return;
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => {
        el.style.setProperty('--mx', `${x}px`);
        el.style.setProperty('--my', `${y}px`);
        el.style.setProperty('--spot', '1');
        if (tilt && !reduce) {
          const rx = ((y / r.height) - 0.5) * -tilt;
          const ry = ((x / r.width) - 0.5) * tilt;
          el.style.transform = `perspective(900px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
        }
      });
    },
    [fine, reduce, tilt],
  );

  const onPointerLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    cancelAnimationFrame(frame.current);
    el.style.setProperty('--spot', '0');
    if (tilt) el.style.transform = '';
  }, [tilt]);

  return { ref, onPointerMove, onPointerLeave };
}
