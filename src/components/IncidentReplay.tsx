import { AnimatePresence, m } from 'framer-motion';
import { AlertTriangle, Check, CircleDashed, LoaderCircle, Play, RotateCcw, Sparkles, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { cn } from '../lib/utils';

type Status = 'idle' | 'scan' | 'ok' | 'fail' | 'skip';
type Log = { id: number; text: string; tone?: 'ok' | 'fail' | 'info' | 'cmd' };

const JOBS = [
  { id: 'ingest', label: 'ingest', size: '1.8 GB' },
  { id: 'enrich', label: 'enrich', size: '3.2 GB' },
  { id: 'eligibility', label: 'eligibility', size: '2.6 GB' },
  { id: 'calculate', label: 'calculate', size: '1.1 GB' },
  { id: 'publish', label: 'publish', size: '0.4 GB' },
];

const SUMMARY =
  'Root cause: seller S-1042 drops out at the eligibility job. Their first-listing date lands one day outside the program window after a timezone conversion, so the eligibility rule never fires and downstream jobs never see them. Fix: compare dates in marketplace-local time.';

type Step = { at: number; log?: string; tone?: Log['tone']; job?: number; status?: Status; clock?: number };

// A fictional replay. Timings are compressed; "clock" is the simulated wall time in minutes.
const SCRIPT: Step[] = [
  { at: 0, log: '$ investigate --ticket P0-2187 --seller S-1042', tone: 'cmd' },
  { at: 500, log: '→ resolving lineage for fee_benefit(S-1042): 5 upstream jobs', tone: 'info', clock: 2 },
  { at: 900, job: 0, status: 'scan' },
  { at: 1700, job: 0, status: 'ok', log: 'ingest       streamed 1.8 GB · seller present ✓', tone: 'ok', clock: 6 },
  { at: 1800, job: 1, status: 'scan' },
  { at: 2700, job: 1, status: 'ok', log: 'enrich       streamed 3.2 GB · seller present ✓', tone: 'ok', clock: 12 },
  { at: 2800, job: 2, status: 'scan' },
  { at: 3800, job: 2, status: 'fail', log: 'eligibility  streamed 2.6 GB · seller MISSING ✗', tone: 'fail', clock: 18 },
  { at: 3900, job: 3, status: 'skip' },
  { at: 3950, job: 4, status: 'skip', log: '→ downstream jobs skipped: break isolated to eligibility', tone: 'info' },
  { at: 4500, log: '→ diffing eligibility inputs against rule conditions…', tone: 'info', clock: 22 },
  { at: 5200, log: '→ asking the LLM to explain the break…', tone: 'info', clock: 26 },
];
const SUMMARY_AT = 5800;
const DONE_CLOCK = 29;

export default function IncidentReplay() {
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [jobs, setJobs] = useState<Status[]>(JOBS.map(() => 'idle'));
  const [logs, setLogs] = useState<Log[]>([]);
  const [clock, setClock] = useState(0);
  const [typed, setTyped] = useState(0);
  const timers = useRef<number[]>([]);
  const logRef = useRef<HTMLDivElement>(null);

  const clear = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };
  useEffect(() => clear, []);
  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: 'smooth' });
  }, [logs, typed]);

  const run = () => {
    clear();
    setRunning(true);
    setDone(false);
    setJobs(JOBS.map(() => 'idle'));
    setLogs([]);
    setClock(0);
    setTyped(0);
    let id = 0;
    for (const s of SCRIPT) {
      timers.current.push(
        window.setTimeout(() => {
          if (s.job !== undefined) setJobs((j) => j.map((v, i) => (i === s.job ? s.status! : v)));
          if (s.log) setLogs((l) => [...l, { id: id++, text: s.log!, tone: s.tone }]);
          if (s.clock !== undefined) setClock(s.clock);
        }, s.at),
      );
    }
    const words = SUMMARY.split(' ');
    words.forEach((_, i) => {
      timers.current.push(window.setTimeout(() => setTyped(i + 1), SUMMARY_AT + i * 45));
    });
    timers.current.push(
      window.setTimeout(() => {
        setClock(DONE_CLOCK);
        setRunning(false);
        setDone(true);
      }, SUMMARY_AT + words.length * 45 + 200),
    );
  };

  const words = SUMMARY.split(' ');
  const started = running || done;

  return (
    <div className="card overflow-hidden">
      {/* Ticket bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-surface px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <span className="rounded-md bg-rose-500/15 px-2 py-0.5 font-mono text-[11px] font-semibold text-rose-500">P0</span>
          <p className="truncate text-sm">
            <span className="font-mono text-subtle">P0-2187</span> · Seller S-1042 didn’t receive their fee benefit
          </p>
        </div>
        <button
          type="button"
          onClick={run}
          disabled={running}
          data-replay-run
          className="inline-flex h-9 items-center gap-2 rounded-full bg-fg px-4 text-sm font-semibold text-bg transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {running ? (
            <LoaderCircle size={15} className="animate-spin" aria-hidden="true" />
          ) : done ? (
            <RotateCcw size={15} aria-hidden="true" />
          ) : (
            <Play size={15} aria-hidden="true" />
          )}
          {running ? 'Investigating…' : done ? 'Replay' : 'Run the investigator'}
        </button>
      </div>

      {/* Pipeline DAG */}
      <div className="overflow-x-auto px-4 py-6 sm:px-6">
        <ol className="flex min-w-[36rem] items-center" aria-label="Pipeline jobs">
          {JOBS.map((j, i) => {
            const s = jobs[i];
            return (
              <li key={j.id} className="flex flex-1 items-center last:flex-none">
                <div
                  className={cn(
                    'relative w-32 shrink-0 rounded-xl border px-3 py-2.5 transition-colors duration-300',
                    s === 'idle' && 'border-line bg-surface',
                    s === 'scan' && 'border-accent bg-accent/10',
                    s === 'ok' && 'border-emerald-500/50 bg-emerald-500/10',
                    s === 'fail' && 'border-rose-500 bg-rose-500/15 shadow-[0_0_30px_-6px] shadow-rose-500/60',
                    s === 'skip' && 'border-dashed border-line opacity-50',
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-fg">{j.label}</span>
                    <span aria-hidden="true">
                      {s === 'idle' && <CircleDashed size={14} className="text-subtle" />}
                      {s === 'scan' && <LoaderCircle size={14} className="animate-spin text-accent" />}
                      {s === 'ok' && <Check size={14} className="text-emerald-500" />}
                      {s === 'fail' && <X size={14} className="text-rose-500" />}
                      {s === 'skip' && <span className="font-mono text-[10px] text-subtle">skip</span>}
                    </span>
                  </div>
                  <p className="mt-1 font-mono text-[10px] text-subtle">{j.size}</p>
                  <span className="sr-only">status: {s}</span>
                  {s === 'scan' && (
                    <m.span
                      aria-hidden="true"
                      className="absolute inset-x-2 bottom-1 h-0.5 origin-left rounded bg-accent"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.85, ease: 'linear' }}
                    />
                  )}
                </div>
                {i < JOBS.length - 1 && (
                  <div className="relative mx-1 h-px flex-1 bg-line" aria-hidden="true">
                    {(s === 'ok' || s === 'fail') && (
                      <m.span
                        className={cn('absolute inset-0 origin-left', s === 'ok' ? 'bg-emerald-500/70' : 'bg-rose-500/40')}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </div>

      <div className="grid gap-0 border-t border-line lg:grid-cols-[1.4fr_1fr]">
        {/* Log stream */}
        <div
          ref={logRef}
          className="h-64 overflow-y-auto bg-[#0b0b12] p-4 font-mono text-[12px] leading-relaxed text-white/80 lg:border-r lg:border-line"
          role="log"
          aria-live="polite"
          aria-label="Investigator output"
        >
          {!started && <p className="text-white/40">Press “Run the investigator” to replay a (fictional) P0.</p>}
          {logs.map((l) => (
            <p
              key={l.id}
              className={cn(
                'whitespace-pre-wrap',
                l.tone === 'ok' && 'text-[#7ee787]',
                l.tone === 'fail' && 'text-[#ff7b8a]',
                l.tone === 'info' && 'text-[#79c0ff]',
                l.tone === 'cmd' && 'text-white',
              )}
            >
              {l.text}
            </p>
          ))}
          {typed > 0 && (
            <div className="mt-2 rounded-lg border border-white/10 bg-white/[0.04] p-3 text-white/90">
              <p className="mb-1 flex items-center gap-1.5 text-[11px] text-[#d2a8ff]">
                <Sparkles size={12} aria-hidden="true" /> LLM summary
              </p>
              {words.slice(0, typed).join(' ')}
              {running && <span className="animate-blink ml-0.5 inline-block h-3.5 w-1.5 translate-y-0.5 bg-white/70" aria-hidden="true" />}
            </div>
          )}
        </div>

        {/* Time-to-root-cause */}
        <div className="flex flex-col justify-between gap-5 p-5 sm:p-6">
          <div>
            <p className="font-mono text-[11px] text-subtle">time to root cause</p>
            <p className="mt-1 font-display text-4xl font-semibold tabular-nums">
              {String(Math.floor(clock / 60)).padStart(2, '0')}:{String(clock % 60).padStart(2, '0')}
              <span className="ml-1 text-base text-subtle">h:m</span>
            </p>
          </div>
          <div className="space-y-3 text-sm">
            <div>
              <div className="mb-1 flex justify-between text-xs text-muted">
                <span>By hand</span>
                <span className="font-mono">5–6 h</span>
              </div>
              <div className="h-2 rounded-full bg-rose-500/70" />
            </div>
            <div>
              <div className="mb-1 flex justify-between text-xs text-muted">
                <span>With the investigator</span>
                <span className="font-mono">~30 min</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-line">
                <m.div
                  className="h-full rounded-full bg-gradient-to-r from-accent to-accent-2"
                  initial={false}
                  animate={{ width: `${(clock / 330) * 100}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            </div>
          </div>
          <AnimatePresence>
            {done && (
              <m.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-600 dark:text-emerald-300"
              >
                <Check size={16} aria-hidden="true" /> ~90% faster. Adopted team-wide.
              </m.p>
            )}
            {!done && (
              <p className="flex items-start gap-2 text-xs text-subtle">
                <AlertTriangle size={14} className="mt-0.5 shrink-0" aria-hidden="true" />
                Illustrative replay with fictional jobs and data. The real tool runs on internal systems.
              </p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
