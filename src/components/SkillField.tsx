import { useEffect, useRef } from 'react';
import type { SkillGroup } from '../data/profile';

type Body = { x: number; y: number; vx: number; vy: number; r: number; g: number; el: HTMLDivElement | null };

import { GROUP_HUES } from './skillHues';

/**
 * A small hand-rolled force simulation: every skill is a bubble that clusters
 * with its group, collides with the others, shies away from the cursor and
 * can be grabbed and flung. Selecting a group pulls it to the centre.
 */
export default function SkillField({ groups, active, onPick }: { groups: SkillGroup[]; active: string | null; onPick: (k: string) => void }) {
  const wrap = useRef<HTMLDivElement>(null);
  const bodies = useRef<Body[]>([]);
  const activeRef = useRef<string | null>(active);
  useEffect(() => {
    activeRef.current = active;
    // A little kick so the re-cluster feels alive.
    bodies.current.forEach((b) => {
      b.vx += (Math.random() - 0.5) * 6;
      b.vy += (Math.random() - 0.5) * 6;
    });
  }, [active]);

  const items = groups.flatMap((g, gi) => g.items.map((label) => ({ label, gi, key: `${g.key}-${label}` })));

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w = el.clientWidth;
    let h = el.clientHeight;
    const scale = () => Math.max(0.6, Math.min(1, w / 980));
    const fontSize = () => Math.max(9.5, 13 * scale());
    // Big enough for the longest word at the current font size.
    const radius = (label: string) => {
      const longest = Math.max(...label.split(' ').map((x) => x.length));
      return Math.max((20 + Math.min(label.length, 14) * 2.4) * scale(), longest * fontSize() * 0.29 + 6);
    };
    const els = Array.from(el.querySelectorAll<HTMLDivElement>('[data-b]'));
    bodies.current = items.map((it, i) => ({
      x: w / 2 + (Math.random() - 0.5) * w * 0.6,
      y: h / 2 + (Math.random() - 0.5) * h * 0.6,
      vx: 0,
      vy: 0,
      r: radius(it.label),
      g: it.gi,
      el: els[i],
    }));
    const bs = bodies.current;
    const mouse = { x: -1e4, y: -1e4 };
    let drag: { i: number; px: number; py: number; lx: number; ly: number } | null = null;

    const anchors = () => {
      const k = activeRef.current;
      const gi = k ? groups.findIndex((g) => g.key === k) : -1;
      return groups.map((_, i) => {
        if (gi === i) return { x: w / 2, y: h / 2, s: 0.012 };
        const a = (i / groups.length) * Math.PI * 2 - Math.PI / 2;
        const spread = gi >= 0 ? 0.46 : 0.26;
        return { x: w / 2 + Math.cos(a) * w * spread, y: h / 2 + Math.sin(a) * h * (spread + 0.02), s: gi >= 0 ? 0.004 : 0.006 };
      });
    };

    let raf = 0;
    let settleFrames = reduce ? 240 : Infinity;
    const step = () => {
      const an = anchors();
      const k = activeRef.current;
      const gi = k ? groups.findIndex((g) => g.key === k) : -1;
      for (let i = 0; i < bs.length; i++) {
        const b = bs[i];
        if (drag && drag.i === i) continue;
        const a = an[b.g];
        b.vx += (a.x - b.x) * a.s;
        b.vy += (a.y - b.y) * a.s;
        const dx = b.x - mouse.x;
        const dy = b.y - mouse.y;
        const d2 = dx * dx + dy * dy;
        const R = 110;
        if (d2 < R * R && d2 > 1) {
          const d = Math.sqrt(d2);
          const f = (1 - d / R) * 1.4;
          b.vx += (dx / d) * f;
          b.vy += (dy / d) * f;
        }
        b.vx *= 0.86;
        b.vy *= 0.86;
        b.x += b.vx;
        b.y += b.vy;
      }
      // Collisions (a few relaxation passes).
      for (let pass = 0; pass < 2; pass++) {
        for (let i = 0; i < bs.length; i++) {
          for (let j = i + 1; j < bs.length; j++) {
            const a = bs[i];
            const c = bs[j];
            const dx = c.x - a.x;
            const dy = c.y - a.y;
            const min = a.r + c.r + 3;
            const d2 = dx * dx + dy * dy;
            if (d2 < min * min) {
              const d = Math.sqrt(d2) || 0.01;
              const push = (min - d) / 2;
              const nx = dx / d;
              const ny = dy / d;
              const ai = drag?.i === i;
              const ci = drag?.i === j;
              if (!ai) {
                a.x -= nx * push * (ci ? 2 : 1);
                a.y -= ny * push * (ci ? 2 : 1);
              }
              if (!ci) {
                c.x += nx * push * (ai ? 2 : 1);
                c.y += ny * push * (ai ? 2 : 1);
              }
            }
          }
        }
      }
      for (const b of bs) {
        b.x = Math.max(b.r, Math.min(w - b.r, b.x));
        b.y = Math.max(b.r, Math.min(h - b.r, b.y));
        if (b.el) {
          b.el.style.transform = `translate(${b.x - b.r}px, ${b.y - b.r}px)`;
          b.el.style.opacity = gi >= 0 && b.g !== gi ? '0.35' : '1';
        }
      }
      if (--settleFrames > 0 || drag) raf = requestAnimationFrame(step);
    };

    const sizeEls = () => {
      bs.forEach((b, i) => {
        b.r = radius(items[i].label);
        if (b.el) {
          b.el.style.width = `${b.r * 2}px`;
          b.el.style.height = `${b.r * 2}px`;
          b.el.style.fontSize = `${fontSize()}px`;
        }
      });
    };
    sizeEls();

    const kick = () => {
      if (!reduce) return;
      settleFrames = 240;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(step);
    };

    const ro = new ResizeObserver(() => {
      w = el.clientWidth;
      h = el.clientHeight;
      sizeEls();
      kick();
    });
    ro.observe(el);

    const local = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onMove = (e: PointerEvent) => {
      const p = local(e);
      if (drag) {
        const b = bs[drag.i];
        drag.lx = drag.px;
        drag.ly = drag.py;
        drag.px = p.x;
        drag.py = p.y;
        b.x = p.x;
        b.y = p.y;
        return;
      }
      if (e.pointerType === 'mouse') {
        mouse.x = p.x;
        mouse.y = p.y;
      }
    };
    const onDown = (e: PointerEvent) => {
      const t = (e.target as HTMLElement).closest<HTMLElement>('[data-b]');
      if (!t) return;
      const i = Number(t.dataset.b);
      const p = local(e);
      drag = { i, px: p.x, py: p.y, lx: p.x, ly: p.y };
      t.setPointerCapture(e.pointerId);
      kick();
      if (reduce) raf = requestAnimationFrame(step);
    };
    const onUp = () => {
      if (!drag) return;
      const b = bs[drag.i];
      b.vx = (drag.px - drag.lx) * 0.9;
      b.vy = (drag.py - drag.ly) * 0.9;
      drag = null;
      kick();
    };
    const onLeave = () => {
      mouse.x = -1e4;
      mouse.y = -1e4;
    };
    el.addEventListener('pointerdown', onDown);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    window.addEventListener('pointerup', onUp);
    const io = new IntersectionObserver(([en]) => {
      cancelAnimationFrame(raf);
      if (en.isIntersecting) raf = requestAnimationFrame(step);
    });
    io.observe(el);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      el.removeEventListener('pointerdown', onDown);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('pointerup', onUp);
    };
    // items derive from groups, which are static.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groups]);

  return (
    <div ref={wrap} className="relative h-[30rem] w-full touch-none overflow-hidden select-none sm:h-[34rem]" aria-hidden="true">
      {items.map((it, i) => {
        const hue = GROUP_HUES[it.gi % GROUP_HUES.length];
        return (
          <div
            key={it.key}
            data-b={i}
            onDoubleClick={() => onPick(groups[it.gi].key)}
            className="absolute top-0 left-0 grid cursor-grab place-items-center rounded-full border text-center leading-tight font-medium text-fg transition-opacity duration-300 active:cursor-grabbing"
            style={{
              background: `radial-gradient(circle at 30% 25%, hsl(${hue} 90% 65% / 0.35), hsl(${hue} 80% 45% / 0.12) 70%)`,
              borderColor: `hsl(${hue} 85% 62% / 0.45)`,
              boxShadow: `0 8px 30px -12px hsl(${hue} 90% 55% / 0.6), inset 0 1px 0 rgb(255 255 255 / 0.12)`,
              willChange: 'transform',
            }}
          >
            <span className="px-2">{it.label}</span>
          </div>
        );
      })}
    </div>
  );
}
