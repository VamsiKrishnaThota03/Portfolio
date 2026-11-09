import type { Project } from '../data/profile';
import { cn } from '../lib/utils';

/** Screenshot when available; otherwise a generated, on-brand code cover. */
export function ProjectCover({
  p,
  className,
  eager,
  sizes = '(min-width: 1024px) 380px, (min-width: 768px) 50vw, 100vw',
}: {
  p: Project;
  className?: string;
  eager?: boolean;
  sizes?: string;
}) {
  if (p.image) {
    return (
      <img
        src={p.image}
        srcSet={`${p.image.replace(/\.webp$/, '-640.webp')} 640w, ${p.image} 1200w`}
        sizes={sizes}
        alt={p.imageAlt ?? `${p.title} screenshot`}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        width={1200}
        height={750}
        className={cn('h-full w-full object-cover object-top dark:brightness-[0.88]', className)}
      />
    );
  }
  return (
    <div
      role="img"
      aria-label={`${p.title} cover`}
      className={cn('relative h-full w-full overflow-hidden', className)}
      style={{
        background: `radial-gradient(120% 120% at 0% 0%, hsl(${p.hue} 80% 55% / 0.45), transparent 55%), radial-gradient(120% 120% at 100% 100%, hsl(${(p.hue + 60) % 360} 80% 55% / 0.35), transparent 55%), var(--bg-2)`,
      }}
    >
      <div className="grid-bg absolute inset-0 opacity-50" />
      <div className="absolute inset-0 flex items-center p-6" aria-hidden="true">
      <pre className="font-mono text-[11px] leading-relaxed text-fg/85 sm:text-xs">
        <span className="text-accent-2">GET</span>{'   '}/api/gadgets?status=Available{'\n'}
        <span className="text-accent-2">POST</span>{'  '}/api/gadgets{'\n'}
        <span className="text-accent-3">POST</span>{'  '}/api/gadgets/:id/self-destruct{'\n'}
        {'\n'}
        <span className="text-muted">{'{'} "codename": "The Phoenix",</span>{'\n'}
        <span className="text-muted">{'  '}"missionSuccessProbability": 85 {'}'}</span>
      </pre>
      </div>
    </div>
  );
}
