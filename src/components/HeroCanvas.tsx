import { useEffect, useRef } from 'react';

type Particle = { x: number; y: number; vx: number; vy: number; r: number; tw: number };

/**
 * Interactive constellation field. Particles drift and link to their
 * neighbours; the cursor acts as a soft gravity well that pulls nearby
 * particles in and draws bright links to them. Pauses when off-screen or the
 * tab is hidden, and renders a single static frame for reduced-motion users.
 */
export default function HeroCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    let w = 0;
    let h = 0;
    let dpr = 1;
    let particles: Particle[] = [];
    let raf = 0;
    let running = false;
    let visible = true;
    let rgb = '180 170 255';
    const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999, active: false };
    const LINK = coarse ? 110 : 140;
    const PULL = 190;

    const readColor = () => {
      rgb = getComputedStyle(document.documentElement).getPropertyValue('--particle').trim() || rgb;
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const target = Math.round(Math.min(140, Math.max(40, (w * h) / (coarse ? 14000 : 10000))));
      particles = Array.from({ length: target }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.4 + 0.6,
        tw: Math.random() * Math.PI * 2,
      }));
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      // Ease the cursor so the well glides rather than snaps.
      mouse.x += (mouse.tx - mouse.x) * 0.12;
      mouse.y += (mouse.ty - mouse.y) * 0.12;

      if (mouse.active) {
        const g = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, PULL * 1.3);
        g.addColorStop(0, `rgb(${rgb} / 0.16)`);
        g.addColorStop(1, `rgb(${rgb} / 0)`);
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      }

      for (const p of particles) {
        if (!reduce) {
          if (mouse.active) {
            const dx = mouse.x - p.x;
            const dy = mouse.y - p.y;
            const d = Math.hypot(dx, dy);
            if (d < PULL && d > 1) {
              const f = (1 - d / PULL) * 0.02;
              p.vx += (dx / d) * f;
              p.vy += (dy / d) * f;
            }
          }
          p.vx *= 0.985;
          p.vy *= 0.985;
          // Keep a gentle ambient drift.
          p.vx += (Math.random() - 0.5) * 0.01;
          p.vy += (Math.random() - 0.5) * 0.01;
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < -10) p.x = w + 10;
          if (p.x > w + 10) p.x = -10;
          if (p.y < -10) p.y = h + 10;
          if (p.y > h + 10) p.y = -10;
        }
      }

      ctx.lineWidth = 1;
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < LINK * LINK) {
            const o = (1 - Math.sqrt(d2) / LINK) * 0.22;
            ctx.strokeStyle = `rgb(${rgb} / ${o.toFixed(3)})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
        if (mouse.active) {
          const d = Math.hypot(a.x - mouse.x, a.y - mouse.y);
          if (d < PULL) {
            ctx.strokeStyle = `rgb(${rgb} / ${((1 - d / PULL) * 0.55).toFixed(3)})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
      }

      for (const p of particles) {
        const twinkle = reduce ? 0.8 : 0.55 + Math.sin(t * 0.0015 + p.tw) * 0.35;
        ctx.fillStyle = `rgb(${rgb} / ${twinkle.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = (t: number) => {
      draw(t);
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (running || reduce || !visible || document.hidden) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      if (y < 0 || y > r.height) {
        mouse.active = false;
        return;
      }
      if (!mouse.active) {
        mouse.x = x;
        mouse.y = y;
      }
      mouse.tx = x;
      mouse.ty = y;
      mouse.active = true;
    };
    const onLeave = () => {
      mouse.active = false;
    };

    readColor();
    resize();
    draw(0);
    start();

    const ro = new ResizeObserver(() => {
      resize();
      if (!running) draw(0);
    });
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(canvas);
    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener('visibilitychange', onVis);
    const mo = new MutationObserver(() => {
      readColor();
      if (!running) draw(0);
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    if (!reduce) {
      window.addEventListener('pointermove', onMove, { passive: true });
      document.addEventListener('pointerleave', onLeave);
    }

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return <canvas ref={ref} className="absolute inset-0 h-full w-full" aria-hidden="true" />;
}
