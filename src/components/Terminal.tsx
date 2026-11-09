import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { achievement, allSections as sections, education, experience, profile, projects, skills, socials } from '../data/profile';
import { useApp } from '../lib/app-context';
import { copyText, scrollToId } from '../lib/utils';

type Line = { id: number; kind: 'in' | 'out' | 'err'; content: ReactNode };

const COMMANDS: Record<string, string> = {
  help: 'list available commands',
  about: 'who I am',
  experience: 'where I have worked',
  projects: 'things I have built',
  skills: 'languages, tools and platforms',
  education: 'where I studied',
  contact: 'how to reach me',
  resume: 'download my résumé',
  socials: 'GitHub, LinkedIn, LeetCode',
  goto: 'goto <section>: scroll to a section',
  replay: 'replay a P0 investigation',
  fit: 'run the role-fit rules engine',
  theme: 'toggle light/dark theme',
  whoami: 'print the current user',
  clear: 'clear the screen',
};

const A = ({ href, children }: { href: string; children: ReactNode }) => (
  <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="text-accent-2 underline-offset-2 hover:underline">
    {children}
  </a>
);

export default function Terminal() {
  const { toggleTheme, toast } = useApp();
  const [lines, setLines] = useState<Line[]>(() => [
    { id: 0, kind: 'out', content: <span className="text-subtle">Welcome to vamsi.sh. Type <b className="text-fg">help</b> to get started.</span> },
  ]);
  const [value, setValue] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [hIndex, setHIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const id = useRef(1);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [lines]);

  const print = (content: ReactNode, kind: Line['kind'] = 'out') => setLines((l) => [...l, { id: id.current++, kind, content }]);

  const run = (raw: string) => {
    const input = raw.trim();
    setLines((l) => [...l, { id: id.current++, kind: 'in', content: input }]);
    if (!input) return;
    setHistory((h) => [input, ...h].slice(0, 50));
    const [cmd, ...args] = input.toLowerCase().split(/\s+/);

    switch (cmd) {
      case 'help':
        print(
          <div className="grid grid-cols-[auto_1fr] gap-x-4">
            {Object.entries(COMMANDS).map(([k, v]) => (
              <div key={k} className="contents">
                <span className="text-accent">{k}</span>
                <span className="text-subtle">{v}</span>
              </div>
            ))}
          </div>,
        );
        break;
      case 'about':
        print(
          <span>
            <b className="text-fg">{profile.name}</b>, {profile.headline}, {profile.location}.{'\n'}
            {profile.summary}
          </span>,
        );
        break;
      case 'whoami':
        print('guest@vamsi.sh  (you are awesome for opening a terminal on a portfolio)');
        break;
      case 'experience':
      case 'exp':
        print(
          <div className="space-y-1">
            {experience.map((e) => (
              <div key={e.company + e.start}>
                <span className="text-accent">{e.start === e.end ? e.start : `${e.start} – ${e.end}`}</span>{'  '}
                <b className="text-fg">{e.role}</b> @ {e.company}
                {e.team ? ` (${e.team})` : ''}
                {e.location ? `, ${e.location}` : ''}
                {e.incoming ? ' (current)' : ''}
              </div>
            ))}
          </div>,
        );
        break;
      case 'projects':
      case 'ls':
        print(
          <div className="space-y-0.5">
            {projects.map((p) => (
              <div key={p.slug}>
                <A href={p.live ?? p.github}>{p.slug}</A>
                <span className="text-subtle"> · {p.tagline}</span>
              </div>
            ))}
          </div>,
        );
        break;
      case 'skills':
        print(
          <div className="space-y-0.5">
            {skills.map((g) => (
              <div key={g.key}>
                <span className="text-accent">{g.title.padEnd(15, ' ')}</span>
                {g.items.join(', ')}
              </div>
            ))}
          </div>,
        );
        break;
      case 'education':
        print(`${education.school}: ${education.degree}, ${education.start} – ${education.end}, ${education.grade}\n${achievement}`);
        break;
      case 'contact':
        print(
          <span>
            Email: <A href={`mailto:${profile.email}`}>{profile.email}</A> (copied to clipboard)
          </span>,
        );
        void copyText(profile.email).then((ok) => ok && toast('Email copied'));
        break;
      case 'socials':
        print(
          <div className="space-y-0.5">
            {socials
              .filter((s) => s.key !== 'email')
              .map((s) => (
                <div key={s.key}>
                  <span className="text-accent">{s.label.padEnd(10, ' ')}</span>
                  <A href={s.href}>{s.href.replace(/^https?:\/\//, '')}</A>
                </div>
              ))}
          </div>,
        );
        break;
      case 'resume':
      case 'cv': {
        print('Downloading Thota_Vamsi_Krishna_Resume.pdf …');
        const a = document.createElement('a');
        a.href = profile.resume;
        a.download = '';
        a.click();
        break;
      }
      case 'goto':
      case 'cd': {
        const target = sections.find((s) => s.id === args[0] || s.label.toLowerCase() === args[0]);
        if (target) {
          print(`→ ${target.label}`);
          scrollToId(target.id);
        } else print(`usage: goto <${sections.map((s) => s.id).join('|')}>`, 'err');
        break;
      }
      case 'replay':
      case 'lab':
        print('→ Opening the incident replay…');
        scrollToId('lab');
        break;
      case 'fit':
        print('→ Loading the rules engine…');
        scrollToId('fit');
        break;
      case 'theme':
        toggleTheme();
        print('Theme toggled.');
        break;
      case 'clear':
        setLines([]);
        break;
      case 'sudo':
        print('Nice try. This incident will be reported to /dev/null.', 'err');
        break;
      case 'hire':
      case 'hireme':
        print(
          <span>
            Great choice. <A href={`mailto:${profile.email}?subject=Let%E2%80%99s%20talk`}>Say hello →</A>
          </span>,
        );
        break;
      default:
        print(`command not found: ${cmd}. Try 'help'.`, 'err');
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      run(value);
      setValue('');
      setHIndex(-1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const n = Math.min(hIndex + 1, history.length - 1);
      if (history[n] !== undefined) {
        setHIndex(n);
        setValue(history[n]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const n = hIndex - 1;
      setHIndex(Math.max(n, -1));
      setValue(n >= 0 ? history[n] : '');
    } else if (e.key === 'Tab') {
      const match = Object.keys(COMMANDS).find((c) => value && c.startsWith(value.toLowerCase()));
      if (match) {
        e.preventDefault();
        setValue(match);
      }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  };

  const suggestions = ['help', 'about', 'experience', 'projects', 'skills', 'contact', 'resume'];

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-[#0b0b12] text-[#e6e6f0] shadow-2xl shadow-black/30">
      <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.03] px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" aria-hidden="true" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" aria-hidden="true" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" aria-hidden="true" />
        <span className="ml-3 font-mono text-xs text-white/50">guest@vamsi.sh: ~</span>
      </div>
      <div
        ref={scrollRef}
        onClick={() => inputRef.current?.focus()}
        className="h-[22rem] overflow-y-auto p-4 font-mono text-[13px] leading-relaxed sm:h-[24rem]"
        role="log"
        aria-live="polite"
        aria-label="Terminal output"
      >
        {lines.map((l) => (
          <div key={l.id} className={l.kind === 'err' ? 'text-[#ff7b8a]' : l.kind === 'in' ? 'text-white' : 'text-white/80'}>
            {l.kind === 'in' ? (
              <span>
                <span className="text-[#7ee787]">➜</span> <span className="text-[#79c0ff]">~</span> {l.content}
              </span>
            ) : (
              <div className="mb-2 whitespace-pre-wrap">{l.content}</div>
            )}
          </div>
        ))}
        <div className="flex items-center gap-2">
          <span className="text-[#7ee787]" aria-hidden="true">
            ➜
          </span>
          <span className="text-[#79c0ff]" aria-hidden="true">
            ~
          </span>
          <label htmlFor="terminal-input" className="sr-only">
            Terminal command
          </label>
          <input
            id="terminal-input"
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKeyDown}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            className="min-w-0 flex-1 bg-transparent text-white caret-[#a99dff] outline-none placeholder:text-white/30 focus-visible:outline-none"
            placeholder="type a command…"
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5 border-t border-white/10 px-4 py-3">
        <span className="mr-1 self-center font-mono text-[11px] text-white/45">try:</span>
        {suggestions.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => {
              run(s);
              inputRef.current?.focus({ preventScroll: true });
            }}
            className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 font-mono text-[11px] text-white/75 transition-colors hover:border-[#a99dff]/60 hover:text-white"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
