import { ArrowUpRight, Copy, CornerDownLeft, Download, FileText, Hash, Moon, Play, Search, SquareTerminal, Sun } from 'lucide-react';
import { useMemo, useRef, useState, type ReactNode } from 'react';
import { allSections, profile, projects, socials } from '../data/profile';
import { useApp } from '../lib/app-context';
import { cn, copyText, scrollToId } from '../lib/utils';
import { SocialIcon } from './BrandIcons';
import { Dialog } from './Dialog';

type Action = {
  id: string;
  group: 'Navigate' | 'Actions' | 'Links' | 'Projects';
  label: string;
  hint?: string;
  keywords?: string;
  icon: ReactNode;
  run: () => void;
};

function score(q: string, text: string) {
  // Lightweight fuzzy match: every query char must appear in order.
  const t = text.toLowerCase();
  if (t.includes(q)) return 100 - t.indexOf(q);
  let i = 0;
  for (const ch of t) if (ch === q[i]) i++;
  return i === q.length ? 10 : -1;
}

export default function CommandPalette({ onClose }: { onClose: () => void }) {
  const { theme, toggleTheme, toast } = useApp();
  const [q, setQ] = useState('');
  const [index, setIndex] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);

  const actions = useMemo<Action[]>(() => {
    const open = (href: string) => () => window.open(href, '_blank', 'noopener,noreferrer');
    return [
      ...allSections.map<Action>((s) => ({
        id: s.id,
        group: 'Navigate',
        label: s.label,
        keywords: s.id === 'terminal' ? 'shell console cli' : s.id === 'lab' ? 'p0 incident investigator demo' : s.id === 'fit' ? 'hire rules engine role match' : undefined,
        icon: s.id === 'terminal' ? <SquareTerminal size={16} /> : <Hash size={16} />,
        run: () => scrollToId(s.id),
      })),
      {
        id: 'run-replay',
        group: 'Actions',
        label: 'Run the P0 incident replay',
        keywords: 'demo investigator lab',
        icon: <Play size={16} />,
        run: () => {
          scrollToId('lab');
          // The replay is lazy-loaded; wait for its button to appear.
          let tries = 0;
          const t = window.setInterval(() => {
            const b = document.querySelector<HTMLButtonElement>('[data-replay-run]');
            if (b || ++tries > 30) window.clearInterval(t);
            if (b && !b.disabled) b.click();
          }, 150);
        },
      },
      {
        id: 'copy-email',
        group: 'Actions',
        label: 'Copy email address',
        hint: profile.email,
        keywords: 'mail contact',
        icon: <Copy size={16} />,
        run: () => void copyText(profile.email).then((ok) => toast(ok ? 'Email copied to clipboard' : profile.email)),
      },
      {
        id: 'theme',
        group: 'Actions',
        label: theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme',
        keywords: 'theme dark light mode toggle',
        icon: theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />,
        run: toggleTheme,
      },
      {
        id: 'resume',
        group: 'Actions',
        label: 'Download résumé',
        keywords: 'resume cv pdf',
        icon: <Download size={16} />,
        run: () => {
          const a = document.createElement('a');
          a.href = profile.resume;
          a.download = '';
          a.click();
        },
      },
      { id: 'resume-view', group: 'Actions', label: 'Open résumé in a new tab', keywords: 'resume cv pdf view', icon: <FileText size={16} />, run: open(profile.resume) },
      ...socials.map<Action>((s) => ({
        id: `social-${s.key}`,
        group: 'Links',
        label: s.key === 'email' ? 'Send an email' : `Open ${s.label}`,
        hint: s.handle,
        icon: <SocialIcon k={s.key} size={16} />,
        run: s.key === 'email' ? () => (window.location.href = s.href) : open(s.href),
      })),
      ...projects.map<Action>((p) => ({
        id: `project-${p.slug}`,
        group: 'Projects',
        label: p.title,
        hint: p.live ? 'live demo' : 'GitHub',
        keywords: p.stack.join(' '),
        icon: <ArrowUpRight size={16} />,
        run: open(p.live ?? p.github),
      })),
    ];
  }, [theme, toggleTheme, toast]);

  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return actions;
    return actions
      .map((a) => {
        // Fuzzy on the label; plain substring on keywords to keep results tight.
        const extra = `${a.keywords ?? ''} ${a.hint ?? ''} ${a.group}`.toLowerCase();
        return { a, s: Math.max(score(query, a.label), extra.includes(query) ? 5 : -1) };
      })
      .filter((x) => x.s >= 0)
      .sort((x, y) => y.s - x.s)
      .map((x) => x.a);
  }, [actions, q]);

  const choose = (a: Action | undefined) => {
    if (!a) return;
    onClose();
    // Let the dialog unmount (and restore scroll) before acting.
    window.setTimeout(a.run, 30);
  };

  const move = (d: number) => {
    setIndex((i) => {
      const n = (i + d + results.length) % Math.max(results.length, 1);
      listRef.current?.querySelector<HTMLElement>(`[data-index="${n}"]`)?.scrollIntoView({ block: 'nearest' });
      return n;
    });
  };

  const active = results[index];

  return (
    <Dialog onClose={onClose} labelledBy="palette-title" position="top" className="max-w-xl overflow-hidden">
      <h2 id="palette-title" className="sr-only">
        Command palette
      </h2>
      <div className="flex items-center gap-3 border-b border-line px-4">
        <Search size={18} className="shrink-0 text-subtle" aria-hidden="true" />
        <input
          autoFocus
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setIndex(0);
          }}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              move(1);
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              move(-1);
            } else if (e.key === 'Enter') {
              e.preventDefault();
              choose(active);
            }
          }}
          role="combobox"
          aria-expanded="true"
          aria-controls="palette-list"
          aria-activedescendant={active ? `cmd-${active.id}` : undefined}
          aria-autocomplete="list"
          aria-label="Search sections, links and actions"
          placeholder="Jump to a section, open a link, copy email…"
          className="h-14 w-full bg-transparent text-base text-fg outline-none placeholder:text-subtle focus-visible:outline-none"
        />
        <kbd className="hidden rounded border border-line px-1.5 py-0.5 font-mono text-[10px] text-subtle sm:block">ESC</kbd>
      </div>

      <ul ref={listRef} id="palette-list" role="listbox" aria-label="Commands" className="max-h-[min(60vh,26rem)] overflow-y-auto p-2">
        {results.length === 0 && <li className="px-3 py-10 text-center text-sm text-subtle">No results for “{q}”.</li>}
        {results.map((a, i) => {
          const header = i === 0 || results[i - 1].group !== a.group ? a.group : null;
          return (
            <li key={a.id} role="presentation">
              {header && (
                <div role="presentation" className="px-3 pt-3 pb-1.5 font-mono text-[10px] tracking-widest text-subtle uppercase">
                  {header}
                </div>
              )}
              <div
                id={`cmd-${a.id}`}
                role="option"
                aria-selected={i === index}
                data-index={i}
                onMouseMove={() => i !== index && setIndex(i)}
                onClick={() => choose(a)}
                className={cn(
                  'flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors',
                  i === index ? 'bg-surface-2 text-fg' : 'text-muted',
                )}
              >
                <span className={cn('grid h-8 w-8 place-items-center rounded-lg border border-line', i === index ? 'text-accent' : 'text-subtle')} aria-hidden="true">
                  {a.icon}
                </span>
                <span className="flex-1 truncate">{a.label}</span>
                {a.hint && <span className="hidden truncate text-xs text-subtle sm:block">{a.hint}</span>}
                {i === index && <CornerDownLeft size={14} className="text-subtle" aria-hidden="true" />}
              </div>
            </li>
          );
        })}
      </ul>
      <div className="flex items-center justify-between border-t border-line px-4 py-2.5 text-[11px] text-subtle">
        <span className="flex items-center gap-3">
          <span>
            <kbd className="font-mono">↑↓</kbd> navigate
          </span>
          <span>
            <kbd className="font-mono">↵</kbd> select
          </span>
        </span>
        <span>{results.length} results</span>
      </div>
    </Dialog>
  );
}
