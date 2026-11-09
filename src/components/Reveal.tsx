import { m, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <m.div
      className={className}
      initial={reduce ? false : { opacity: 0, y, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </m.div>
  );
}

export function SectionHeading({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title: ReactNode;
  children?: ReactNode;
}) {
  return (
    <Reveal className="mb-10 max-w-2xl md:mb-14">
      <p className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-accent">
        <span className="h-px w-8 bg-accent/60" aria-hidden="true" />
        {eyebrow}
      </p>
      <h2 id={`${id}-title`} className="font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl md:text-5xl">
        {title}
      </h2>
      {children && <p className="mt-4 text-base text-muted text-pretty md:text-lg">{children}</p>}
    </Reveal>
  );
}
