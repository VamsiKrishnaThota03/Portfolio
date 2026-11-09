import { useEffect, useRef, useState } from 'react';
import { profile } from '../data/profile';

type NodeDef = { id: string; label: string; detail: string; ring: 0 | 1; hue: number };

const NODES: NodeDef[] = [
  { id: 'java', label: 'Java', detail: 'Backend services and Drools rules at scale', ring: 0, hue: 20 },
  { id: 'python', label: 'Python', detail: 'CLIs, data tooling, the P0 investigator', ring: 0, hue: 200 },
  { id: 'aws', label: 'AWS', detail: 'Lambda · CDK · SQS · S3 · DynamoDB · Glue · IAM · EC2', ring: 0, hue: 35 },
  { id: 'rules', label: 'Rules engines', detail: 'Drools; 45+ marketplace-specific eligibility configs', ring: 0, hue: 265 },
  { id: 'data', label: 'Data pipelines', detail: 'SQL batch jobs, Glue, multi-GB outputs', ring: 1, hue: 160 },
  { id: 'ai', label: 'AI agents', detail: 'Rovo agents, MCP servers, Gemini', ring: 1, hue: 300 },
  { id: 'web', label: 'React · TS', detail: 'React, Next.js, TypeScript, Tailwind', ring: 1, hue: 190 },
  { id: 'db', label: 'Datastores', detail: 'PostgreSQL · MySQL · MongoDB · Redis · DynamoDB', ring: 1, hue: 120 },
];
// Cross-links between dependencies (indices into NODES).
const LINKS: [number, number][] = [
  [0, 3],
  [2, 4],
  [1, 5],
  [6, 7],
  [4, 7],
  [1, 4],
];

type Packet = { edge: number; p: number; speed: number; dir: 1 | -1 };

/**
 * The hero "system map": Vamsi as a running service with his stack orbiting
 * as dependencies. Requests flow along the edges; nodes can be dragged and
 * spring back; hovering or focusing a node reveals what it covers.
 */
export function SystemMap() {
  const wrap = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const nodeEls = useRef<(HTMLButtonElement | null)[]>([]);
  const [active, setActive] = useState<number | null>(null);
  const activeRef = useRef<number | null>(null);
  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    const el = wrap.current;
    const s = svg.current;
    if (!el || !s) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const n = NODES.length;
    let w = 0;
    let h = 0;
    const pos = NODES.map(() => ({ x: 0, y: 0 }));
    const off = NODES.map(() => ({ x: 0, y: 0, vx: 0, vy: 0 }));
    const base = NODES.map((d, i) => (i / n) * Math.PI * 2 + (d.ring ? 0.4 : 0));
    let drag: { i: number; dx: number; dy: number } | null = null;
    const tilt = { x: 0, y: 0, tx: 0, ty: 0 };

    const spokes = Array.from(s.querySelectorAll<SVGLineElement>('[data-spoke]'));
    const links = Array.from(s.querySelectorAll<SVGLineElement>('[data-link]'));
    const dots = Array.from(s.querySelectorAll<SVGCircleElement>('[data-packet]'));
    const edges: [number, number][] = [...NODES.map((_, i) => [-1, i] as [number, number]), ...LINKS];
    const packets: Packet[] = dots.map((_, k) => ({
      edge: k % edges.length,
      p: Math.random(),
      speed: 0.004 + Math.random() * 0.006,
      dir: Math.random() > 0.5 ? 1 : -1,
    }));

    const resize = () => {
      const r = el.getBoundingClientRect();
      w = r.width;
      h = r.height;
      s.setAttribute('viewBox', `0 0 ${w} ${h}`);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    const center = () => ({ x: w / 2 + tilt.x * 10, y: h / 2 + tilt.y * 10 });
    const point = (i: number) => (i < 0 ? center() : pos[i]);

    let raf = 0;
    const t0 = performance.now();
    const frame = (now: number) => {
      const t = reduce ? 0 : (now - t0) / 1000;
      tilt.x += (tilt.tx - tilt.x) * 0.06;
      tilt.y += (tilt.ty - tilt.y) * 0.06;
      const c = center();
      for (let i = 0; i < n; i++) {
        const d = NODES[i];
        const narrow = w < 460;
        const rx = (d.ring ? (narrow ? 0.36 : 0.44) : narrow ? 0.27 : 0.3) * w;
        const ry = (d.ring ? (narrow ? 0.4 : 0.42) : 0.28) * h;
        const a = base[i] + t * (d.ring ? -0.05 : 0.08);
        const ox = c.x + Math.cos(a) * rx + tilt.x * (d.ring ? 22 : 14);
        const oy = c.y + Math.sin(a) * ry + tilt.y * (d.ring ? 22 : 14);
        const o = off[i];
        if (!drag || drag.i !== i) {
          // Critically-damped-ish spring back to the orbit.
          o.vx = (o.vx - o.x * 0.08) * 0.82;
          o.vy = (o.vy - o.y * 0.08) * 0.82;
          o.x += o.vx;
          o.y += o.vy;
        }
        pos[i].x = ox + o.x;
        pos[i].y = oy + o.y;
        const node = nodeEls.current[i];
        if (node) node.style.transform = `translate(${pos[i].x}px, ${pos[i].y}px) translate(-50%, -50%)`;
        const sp = spokes[i];
        sp.setAttribute('x1', String(c.x));
        sp.setAttribute('y1', String(c.y));
        sp.setAttribute('x2', String(pos[i].x));
        sp.setAttribute('y2', String(pos[i].y));
      }
      LINKS.forEach(([a, b], k) => {
        const l = links[k];
        l.setAttribute('x1', String(pos[a].x));
        l.setAttribute('y1', String(pos[a].y));
        l.setAttribute('x2', String(pos[b].x));
        l.setAttribute('y2', String(pos[b].y));
      });
      const act = activeRef.current;
      packets.forEach((pk, k) => {
        const [a, b] = edges[pk.edge];
        if (!reduce) pk.p += pk.speed * (act !== null && (a === act || b === act) ? 2.2 : 1);
        if (pk.p > 1) {
          pk.p = 0;
          pk.edge = Math.floor(Math.random() * edges.length);
          pk.dir = Math.random() > 0.5 ? 1 : -1;
        }
        const A = point(pk.dir === 1 ? a : b);
        const B = point(pk.dir === 1 ? b : a);
        const dot = dots[k];
        dot.setAttribute('cx', String(A.x + (B.x - A.x) * pk.p));
        dot.setAttribute('cy', String(A.y + (B.y - A.y) * pk.p));
        dot.setAttribute('opacity', String(Math.sin(pk.p * Math.PI) * (reduce ? 0 : 1)));
      });
      if (!reduce || drag) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      if (drag) {
        const o = off[drag.i];
        const nx = e.clientX - r.left - drag.dx;
        const ny = e.clientY - r.top - drag.dy;
        o.x = nx - (pos[drag.i].x - o.x);
        o.y = ny - (pos[drag.i].y - o.y);
        if (reduce) raf = requestAnimationFrame(frame);
        return;
      }
      if (e.pointerType === 'mouse') {
        tilt.tx = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width - 0.5) * 2));
        tilt.ty = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height - 0.5) * 2));
      }
    };
    const onDown = (e: PointerEvent) => {
      const target = (e.target as HTMLElement).closest<HTMLElement>('[data-node]');
      if (!target) return;
      const i = Number(target.dataset.node);
      const r = el.getBoundingClientRect();
      drag = { i, dx: e.clientX - r.left - pos[i].x, dy: e.clientY - r.top - pos[i].y };
      target.setPointerCapture(e.pointerId);
      setActive(i);
    };
    const onUp = () => {
      if (drag) {
        off[drag.i].vx = 0;
        off[drag.i].vy = 0;
      }
      drag = null;
      if (reduce) raf = requestAnimationFrame(frame);
    };
    const onVis = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) {
        raf = requestAnimationFrame(frame);
      }
    };
    el.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerup', onUp);
    document.addEventListener('visibilitychange', onVis);
    const io = new IntersectionObserver(([en]) => {
      cancelAnimationFrame(raf);
      if (en.isIntersecting) raf = requestAnimationFrame(frame);
    });
    io.observe(el);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      el.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  const a = active !== null ? NODES[active] : null;

  return (
    <div className="relative">
      <div
        ref={wrap}
        className="relative mx-auto aspect-square w-full max-w-[34rem] touch-none select-none"
        role="group"
        aria-label="Interactive map of my stack. Each skill orbits me like a service dependency; drag a node or focus it to see details."
      >
        <svg ref={svg} className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
          <defs>
            <radialGradient id="sm-core" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.35" />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
            </radialGradient>
          </defs>
          <ellipse cx="50%" cy="50%" rx="30%" ry="28%" fill="none" stroke="var(--line)" strokeDasharray="2 6" />
          <ellipse cx="50%" cy="50%" rx="44%" ry="42%" fill="none" stroke="var(--line)" strokeDasharray="2 8" />
          <circle cx="50%" cy="50%" r="26%" fill="url(#sm-core)" />
          {NODES.map((d, i) => (
            <line
              key={d.id}
              data-spoke
              stroke={active === i ? `hsl(${d.hue} 90% 65%)` : 'var(--line)'}
              strokeWidth={active === i ? 1.6 : 1}
            />
          ))}
          {LINKS.map(([x, y], k) => (
            <line
              key={k}
              data-link
              stroke={active === x || active === y ? 'var(--accent-2)' : 'var(--line)'}
              strokeDasharray="3 5"
              strokeWidth={1}
            />
          ))}
          {Array.from({ length: 18 }, (_, k) => (
            <circle key={k} data-packet r={2.4} fill={k % 3 === 0 ? 'var(--accent-2)' : k % 3 === 1 ? 'var(--accent)' : 'var(--accent-3)'} />
          ))}
        </svg>

        {/* Core service */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="relative grid place-items-center">
            <span className="animate-pulse-ring absolute h-28 w-28 rounded-full border border-accent/50 sm:h-32 sm:w-32" aria-hidden="true" />
            <img
              src="/images/avatar.webp"
              alt={`Photo of ${profile.name}`}
              width={256}
              height={256}
              fetchPriority="high"
              className="h-24 w-24 rounded-full object-cover ring-2 ring-accent/60 ring-offset-4 ring-offset-bg sm:h-28 sm:w-28"
              draggable={false}
            />
            <span className="glass absolute -bottom-9 whitespace-nowrap rounded-full border border-line px-2.5 py-1 font-mono text-[10px] text-muted">
              <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 align-middle" aria-hidden="true" />
              vamsi.service · healthy
            </span>
          </div>
        </div>

        {NODES.map((d, i) => (
          <button
            key={d.id}
            ref={(b) => {
              nodeEls.current[i] = b;
            }}
            type="button"
            data-node={i}
            onPointerEnter={() => setActive(i)}
            onPointerLeave={() => setActive((x) => (x === i ? null : x))}
            onFocus={() => setActive(i)}
            onBlur={() => setActive((x) => (x === i ? null : x))}
            aria-describedby={active === i ? 'system-map-detail' : undefined}
            className="glass absolute top-0 left-0 inline-flex cursor-grab items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium whitespace-nowrap text-fg shadow-lg shadow-black/20 transition-[border-color,box-shadow] active:cursor-grabbing sm:text-[13px]"
            style={{ borderColor: active === i ? `hsl(${d.hue} 90% 65%)` : 'var(--line)', willChange: 'transform' }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: `hsl(${d.hue} 90% 62%)` }} aria-hidden="true" />
            {d.label}
          </button>
        ))}
      </div>

      <p
        id="system-map-detail"
        aria-live="polite"
        className="mx-auto mt-4 min-h-10 max-w-sm text-center font-mono text-[11px] leading-relaxed text-subtle sm:text-xs"
      >
        {a ? (
          <>
            <span className="text-fg">{a.label}</span> → {a.detail}
          </>
        ) : (
          'hover · focus · drag a dependency'
        )}
      </p>
    </div>
  );
}
