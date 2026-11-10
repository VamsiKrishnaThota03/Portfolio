import { AnimatePresence, m, useScroll, useSpring } from 'framer-motion';
import { Command, Menu, Moon, Sun, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { profile, sections } from '../data/profile';
import { useActiveSection } from '../hooks/useActiveSection';
import { useApp } from '../lib/app-context';
import { cn, isMac, scrollToId } from '../lib/utils';

const ids = sections.map((s) => s.id);

export function Navbar() {
  const active = useActiveSection(ids);
  const { theme, toggleTheme, setPaletteOpen } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mac] = useState(isMac);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    scrollToId(id);
    history.replaceState(null, '', `#${id}`);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <m.div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[2px] origin-left bg-gradient-to-r from-accent via-accent-2 to-accent-3"
        style={{ scaleX: progress }}
      />
      <nav
        aria-label="Primary"
        className={cn(
          'mx-auto mt-3 flex h-14 max-w-6xl items-center justify-between gap-3 rounded-full border px-3 transition-all duration-300 sm:px-4',
          'w-[calc(100%-1.5rem)]',
          scrolled ? 'glass border-line shadow-lg shadow-black/10' : 'border-transparent',
        )}
      >
        <a
          href="#top"
          onClick={go('top')}
          className="flex items-center gap-2 rounded-full pl-1 pr-2 font-display font-semibold tracking-tight"
        >
          <span aria-hidden="true" className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-accent via-accent-2 to-accent-3 text-[13px] font-bold text-white">
            {profile.initials}
          </span>
          <span className="sr-only sm:not-sr-only">Vamsi Krishna</span>
          <span className="sr-only">, back to top</span>
        </a>

        <ul className="hidden items-center gap-0.5 lg:flex">
          {sections.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                onClick={go(s.id)}
                aria-current={active === s.id ? 'true' : undefined}
                className={cn(
                  'relative isolate rounded-full px-3.5 py-1.5 text-sm transition-colors',
                  active === s.id ? 'text-fg' : 'text-muted hover:text-fg',
                )}
              >
                {active === s.id && (
                  <m.span
                    layoutId="nav-pill"
                    className="absolute inset-0 -z-10 rounded-full border border-line bg-surface-2"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                {s.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setPaletteOpen(true)}
            className="hidden h-9 items-center gap-2 rounded-full border border-line bg-surface px-3 text-xs text-muted transition-colors hover:text-fg sm:inline-flex"
            aria-keyshortcuts={mac ? 'Meta+K' : 'Control+K'}
          >
            <Command size={14} aria-hidden="true" />
            <span>Search</span>
            <span className="sr-only"> (command palette)</span>
            <kbd aria-hidden="true" className="rounded border border-line px-1.5 font-mono text-[10px]">{mac ? '⌘K' : 'Ctrl K'}</kbd>
          </button>
          <button
            type="button"
            onClick={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              toggleTheme({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
            }}
            className="grid h-9 w-9 place-items-center rounded-full border border-line bg-surface text-muted transition-colors hover:text-fg"
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            <AnimatePresence mode="wait" initial={false}>
              <m.span
                key={theme}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {theme === 'dark' ? <Sun size={16} aria-hidden="true" /> : <Moon size={16} aria-hidden="true" />}
              </m.span>
            </AnimatePresence>
          </button>
          <button
            type="button"
            onClick={() => setPaletteOpen(true)}
            className="grid h-9 w-9 place-items-center rounded-full border border-line bg-surface text-muted sm:hidden"
            aria-label="Open command palette"
          >
            <Command size={16} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="grid h-9 w-9 place-items-center rounded-full border border-line bg-surface text-fg lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            {open ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <m.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="glass mx-auto mt-2 w-[calc(100%-1.5rem)] max-w-6xl rounded-3xl border border-line p-2 shadow-2xl lg:hidden"
          >
            <ul>
              {sections.map((s, i) => (
                <m.li key={s.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
                  <a
                    href={`#${s.id}`}
                    onClick={go(s.id)}
                    aria-current={active === s.id ? 'true' : undefined}
                    className={cn(
                      'flex items-center justify-between rounded-2xl px-4 py-3 font-display text-lg',
                      active === s.id ? 'bg-surface-2 text-fg' : 'text-muted',
                    )}
                  >
                    {s.label}
                    <span className="font-mono text-xs text-subtle">0{i + 1}</span>
                  </a>
                </m.li>
              ))}
            </ul>
          </m.div>
        )}
      </AnimatePresence>
    </header>
  );
}
