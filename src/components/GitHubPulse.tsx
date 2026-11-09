import { ArrowUpRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useInView } from '../hooks/useLazyInView';
import { GithubIcon } from './BrandIcons';

type Repo = { name: string; html_url: string; language: string | null; stargazers_count: number; pushed_at: string; fork: boolean };
type Stats = { repos: number; stars: number; langs: [string, number][]; recent: Repo[] };

const USER = 'VamsiKrishnaThota03';
const CACHE = 'gh-pulse-v2';
const LANG_COLORS: Record<string, string> = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  Java: '#b07219',
  Go: '#00ADD8',
  'C++': '#f34b7d',
  HTML: '#e34c26',
  CSS: '#663399',
  PHP: '#4F5D95',
  Apex: '#1797c0',
};

function ago(iso: string) {
  const d = (Date.now() - new Date(iso).getTime()) / 86400000;
  if (d < 1) return 'today';
  if (d < 2) return 'yesterday';
  if (d < 30) return `${Math.floor(d)}d ago`;
  if (d < 365) return `${Math.floor(d / 30)}mo ago`;
  return `${Math.floor(d / 365)}y ago`;
}

/** Live public GitHub stats, fetched client-side from the public REST API. Hides itself on failure. */
export function GitHubPulse() {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, '300px');
  const [stats, setStats] = useState<Stats | null>(() => {
    try {
      const c = sessionStorage.getItem(CACHE);
      return c ? (JSON.parse(c) as Stats) : null;
    } catch {
      return null;
    }
  });
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!seen || stats) return;
    const ctrl = new AbortController();
    fetch(`https://api.github.com/users/${USER}/repos?per_page=100&sort=pushed`, { signal: ctrl.signal, headers: { Accept: 'application/vnd.github+json' } })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((repos: Repo[]) => {
        const own = repos.filter((r) => !r.fork && r.name !== USER);
        const counts = new Map<string, number>();
        own.forEach((r) => r.language && counts.set(r.language, (counts.get(r.language) ?? 0) + 1));
        const s: Stats = {
          repos: own.length,
          stars: own.reduce((a, r) => a + r.stargazers_count, 0),
          langs: [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6),
          recent: own.slice(0, 3),
        };
        setStats(s);
        try {
          sessionStorage.setItem(CACHE, JSON.stringify(s));
        } catch {
          /* ignore */
        }
      })
      .catch((e) => {
        if ((e as Error).name !== 'AbortError') setFailed(true);
      });
    return () => ctrl.abort();
  }, [seen, stats]);

  if (failed) return <div ref={ref} />;
  const total = stats?.langs.reduce((a, [, n]) => a + n, 0) ?? 1;

  return (
    <div ref={ref} className="card mb-8 grid gap-5 p-5 sm:p-6 md:grid-cols-[auto_1fr_1.2fr] md:items-center">
      <div className="flex items-center gap-4">
        <span className="relative grid h-11 w-11 place-items-center rounded-xl border border-line bg-surface-2">
          <GithubIcon size={20} />
          <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-bg" aria-hidden="true" />
        </span>
        <div>
          <p className="font-mono text-[10px] tracking-widest text-subtle uppercase">Live from GitHub</p>
          <p className="font-display text-2xl font-semibold tabular-nums">
            {stats ? stats.repos : '—'} <span className="text-sm font-normal text-muted">public repos</span>
          </p>
        </div>
      </div>

      <div className="min-w-0">
        <div className="flex h-2.5 overflow-hidden rounded-full bg-line" role="img" aria-label={stats ? `Languages: ${stats.langs.map(([l, n]) => `${l} ${n}`).join(', ')}` : 'Loading languages'}>
          {stats?.langs.map(([l, n]) => (
            <span key={l} style={{ width: `${(n / total) * 100}%`, background: LANG_COLORS[l] ?? '#8a8aa3' }} />
          ))}
        </div>
        <ul className="mt-2.5 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted">
          {stats?.langs.map(([l, n]) => (
            <li key={l} className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ background: LANG_COLORS[l] ?? '#8a8aa3' }} aria-hidden="true" />
              {l} <span className="text-subtle">{n}</span>
            </li>
          ))}
          {!stats && <li className="text-subtle">loading…</li>}
        </ul>
      </div>

      <ul className="space-y-1.5 text-sm" aria-label="Recently pushed repositories">
        {stats?.recent.map((r) => (
          <li key={r.name}>
            <a href={r.html_url} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2 text-muted hover:text-fg">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-2" aria-hidden="true" />
              <span className="truncate font-mono text-xs">{r.name}</span>
              <span className="ml-auto shrink-0 text-xs text-subtle">pushed {ago(r.pushed_at)}</span>
              <ArrowUpRight size={12} className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
