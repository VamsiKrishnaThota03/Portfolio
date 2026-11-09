import { ArrowUpRight, Bot, Briefcase, Clock, GraduationCap, Trophy } from 'lucide-react';
import { useEffect, useState, type ReactNode } from 'react';
import { Counter } from '../components/Counter';
import { Reveal, SectionHeading } from '../components/Reveal';
import { achievement, education, profile, socials, stats } from '../data/profile';
import { usePointerFx } from '../hooks/usePointerFx';
import { cn, scrollToId } from '../lib/utils';

function Tile({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const fx = usePointerFx<HTMLDivElement>();
  return (
    <Reveal delay={delay} className={cn('h-full', className)}>
      <div {...fx} className="card spotlight h-full overflow-hidden p-5 sm:p-6">
        <div className="relative z-10 h-full">{children}</div>
      </div>
    </Reveal>
  );
}

function LocalTime() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = window.setInterval(() => setNow(new Date()), 1000 * 15);
    return () => window.clearInterval(t);
  }, []);
  const time = new Intl.DateTimeFormat('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: profile.timezone,
  }).format(now);
  return <time className="font-display text-3xl font-semibold tracking-tight tabular-nums sm:text-4xl">{time}</time>;
}

const leetcode = socials.find((s) => s.key === 'leetcode')!;

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="relative mx-auto max-w-6xl px-5 py-20 sm:px-8 md:py-28">
      <SectionHeading id="about" eyebrow="About" title={<>Engineer by trade, <span className="text-gradient">builder</span> by habit.</>}>
        I like systems that quietly do the right thing at scale, and tools that give engineers their afternoons back.
      </SectionHeading>

      <div className="grid auto-rows-[minmax(0,auto)] grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <Tile className="col-span-2 lg:row-span-2">
          <div className="flex h-full flex-col gap-6 sm:flex-row lg:flex-col">
            <div className="relative shrink-0">
              <picture>
                <source srcSet={`/images/profile-320.webp 320w, ${profile.photo} 560w`} sizes="(min-width: 640px) 144px, 112px" type="image/webp" />
                <img
                  src={profile.photoFallback}
                  alt={`Portrait of ${profile.name}`}
                  width={560}
                  height={560}
                  loading="lazy"
                  decoding="async"
                  className="h-28 w-28 rounded-2xl object-cover ring-1 ring-line sm:h-36 sm:w-36"
                />
              </picture>
            </div>
            <div className="flex flex-col justify-between gap-5">
              <div>
                <h3 className="font-display text-2xl font-semibold tracking-tight">Hi, I’m {profile.firstName}.</h3>
                <p className="mt-3 leading-relaxed text-muted">{profile.summary}</p>
              </div>
              <p className="text-sm leading-relaxed text-subtle">
                At Amazon that meant Java and Python services, Drools rules, SQL data pipelines and AWS (Lambda, CDK, SQS,
                DynamoDB, Glue). Off the clock it means shipping AI agents and hackathon builds.
              </p>
            </div>
          </div>
        </Tile>

        <Tile className="col-span-2 sm:col-span-1" delay={0.05}>
          <div className="flex h-full flex-col justify-between gap-6">
            <div className="flex items-center justify-between text-muted">
              <span className="font-mono text-xs uppercase tracking-widest">Next · Nov 2026</span>
              <Briefcase size={18} aria-hidden="true" />
            </div>
            <div>
              <p className="font-display text-2xl font-semibold">Google</p>
              <p className="mt-1 text-sm text-muted">Incoming Software Engineer · ex-Amazon</p>
            </div>
          </div>
        </Tile>

        <Tile className="col-span-2 sm:col-span-1" delay={0.1}>
          <div className="flex h-full flex-col justify-between gap-6">
            <div className="flex items-center justify-between text-muted">
              <span className="font-mono text-xs uppercase tracking-widest">Bangalore</span>
              <Clock size={18} aria-hidden="true" />
            </div>
            <div>
              <LocalTime />
              <p className="mt-1 text-sm text-muted">Local time · IST (UTC+5:30)</p>
            </div>
          </div>
        </Tile>

        <Tile className="col-span-2" delay={0.15}>
          <div className="flex h-full flex-col justify-between gap-5">
            <div className="flex items-center justify-between text-muted">
              <span className="font-mono text-xs uppercase tracking-widest">Also building</span>
              <Bot size={18} aria-hidden="true" />
            </div>
            <div>
              <p className="font-display text-xl font-semibold leading-snug">
                AI agents &amp; developer tools: a Rovo agent + MCP server that remembers team decisions, and agents that
                negotiate within code-enforced limits.
              </p>
              <a
                href="#projects"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToId('projects');
                }}
                className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
              >
                See the projects <ArrowUpRight size={14} aria-hidden="true" />
              </a>
            </div>
          </div>
        </Tile>

        {stats.map((s, i) => (
          <Tile key={s.label} className="col-span-1" delay={0.05 * i}>
            <div className="flex h-full flex-col justify-between gap-3">
              <p className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
                <span className="text-gradient">
                  <Counter value={s.value} prefix={s.prefix} suffix={s.suffix} />
                </span>
              </p>
              <div>
                <p className="text-sm font-medium text-fg">{s.label}</p>
                <p className="mt-1 text-xs leading-relaxed text-subtle">{s.detail}</p>
              </div>
            </div>
          </Tile>
        ))}

        <Tile className="col-span-2" delay={0.05}>
          <div className="flex h-full items-start gap-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-line bg-surface-2 text-accent-2">
              <GraduationCap size={20} aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="font-display text-lg font-semibold">{education.school}</p>
              <p className="text-sm text-muted">{education.degree}</p>
              <p className="mt-2 flex flex-wrap gap-2 text-xs">
                <span className="chip">
                  {education.start} – {education.end}
                </span>
                <span className="chip text-fg">{education.grade}</span>
              </p>
            </div>
          </div>
        </Tile>

        <Tile className="col-span-2" delay={0.1}>
          <div className="flex h-full items-start gap-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-line bg-surface-2 text-amber-400">
              <Trophy size={20} aria-hidden="true" />
            </span>
            <div>
              <p className="font-display text-lg font-semibold">Problem solver</p>
              <p className="text-sm text-muted">{achievement}</p>
              <a
                href={leetcode.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
              >
                LeetCode · {leetcode.handle} <ArrowUpRight size={14} aria-hidden="true" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </div>
          </div>
        </Tile>
      </div>
    </section>
  );
}
