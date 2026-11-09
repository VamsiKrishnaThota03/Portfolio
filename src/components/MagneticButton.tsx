import { m, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { useRef, type ReactNode, type PointerEvent } from 'react';
import { cn } from '../lib/utils';

type Props = {
  href: string;
  children: ReactNode;
  variant?: 'primary' | 'ghost';
  download?: boolean;
  external?: boolean;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  className?: string;
};

/** Link-button that leans towards the cursor (disabled for touch and reduced motion). */
export function MagneticButton({ href, children, variant = 'primary', download, external, onClick, className }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 15, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 15, mass: 0.4 });

  const onMove = (e: PointerEvent<HTMLAnchorElement>) => {
    if (reduce || e.pointerType !== 'mouse' || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.3);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.4);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <m.a
      ref={ref}
      href={href}
      onClick={onClick}
      download={download}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={{ x: sx, y: sy }}
      whileTap={{ scale: 0.97 }}
      className={cn(
        'group relative inline-flex h-12 items-center justify-center gap-2 overflow-hidden rounded-full px-6 text-sm font-semibold transition-colors',
        variant === 'primary'
          ? 'bg-fg text-bg shadow-[0_10px_40px_-10px] shadow-accent/60 hover:shadow-accent'
          : 'border border-line bg-surface text-fg hover:border-accent/50 hover:bg-surface-2',
        className,
      )}
    >
      {variant === 'primary' && (
        <span
          aria-hidden="true"
          className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full"
        />
      )}
      <span className="relative inline-flex items-center gap-2">{children}</span>
    </m.a>
  );
}
