import { ArrowUp } from 'lucide-react';
import { profile, socials } from '../data/profile';
import { scrollToId } from '../lib/utils';
import { SocialIcon } from './BrandIcons';

export function Footer() {
  return (
    <footer className="relative border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-5 py-10 sm:flex-row sm:px-8">
        <div className="text-center sm:text-left">
          <p className="font-display font-semibold">{profile.name}</p>
          <p className="mt-1 text-sm text-subtle">
            © {new Date().getFullYear()} · Built with React, TypeScript, Tailwind and Framer Motion.
          </p>
        </div>
        <div className="flex items-center gap-1">
          {socials.map((s) => (
            <a
              key={s.key}
              href={s.href}
              target={s.key === 'email' ? undefined : '_blank'}
              rel="noopener noreferrer"
              aria-label={s.key === 'email' ? `Email ${profile.email}` : `${s.label} (opens in a new tab)`}
              className="grid h-10 w-10 place-items-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-fg"
            >
              <SocialIcon k={s.key} size={17} />
            </a>
          ))}
          <button
            type="button"
            onClick={() => scrollToId('top')}
            className="ml-2 grid h-10 w-10 place-items-center rounded-full border border-line bg-surface text-fg transition-colors hover:border-accent/50"
            aria-label="Back to top"
          >
            <ArrowUp size={16} aria-hidden="true" />
          </button>
        </div>
      </div>
    </footer>
  );
}
