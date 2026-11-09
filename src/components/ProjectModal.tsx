import { ArrowUpRight, Play, X } from 'lucide-react';
import { useState } from 'react';
import type { Project } from '../data/profile';
import { youtubeId } from '../lib/utils';
import { GithubIcon } from './BrandIcons';
import { Dialog } from './Dialog';
import { ProjectCover } from './ProjectCover';

function Video({ url, title }: { url: string; title: string }) {
  const id = youtubeId(url);
  const [play, setPlay] = useState(false);
  if (!id) return null;
  if (!play) {
    // Click-to-load facade: no third-party iframe until the visitor asks for it.
    return (
      <button
        type="button"
        onClick={() => setPlay(true)}
        className="group relative block aspect-video w-full overflow-hidden rounded-2xl border border-line bg-black"
        aria-label={`Play the ${title} demo video`}
      >
        <img
          src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover opacity-80 transition-opacity group-hover:opacity-100"
        />
        <span className="absolute inset-0 grid place-items-center">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-white/95 text-black shadow-2xl transition-transform group-hover:scale-110">
            <Play size={26} className="ml-1" aria-hidden="true" />
          </span>
        </span>
      </button>
    );
  }
  return (
    <div className="aspect-video w-full overflow-hidden rounded-2xl border border-line bg-black">
      <iframe
        className="h-full w-full"
        src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
        title={`${title} demo video`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}

export default function ProjectModal({ project: p, onClose }: { project: Project; onClose: () => void }) {
  const titleId = `modal-${p.slug}-title`;
  return (
    <Dialog onClose={onClose} labelledBy={titleId} className="max-w-3xl overflow-hidden">
      <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-line bg-bg">
        <ProjectCover p={p} eager sizes="(min-width: 800px) 768px, 100vw" />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-bg-2 via-transparent to-transparent" />
      </div>
      <button
        type="button"
        onClick={onClose}
        className="glass absolute top-3 right-3 grid h-10 w-10 place-items-center rounded-full border border-line text-fg transition-colors hover:bg-surface-2"
        aria-label="Close project details"
        autoFocus
      >
        <X size={18} aria-hidden="true" />
      </button>

      <div className="p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-2">
          {p.badge && <span className="chip border-accent/40 text-accent">{p.badge}</span>}
          {p.categories.map((c) => (
            <span key={c} className="chip">
              {c === 'ai' ? 'AI & Agents' : c === 'fullstack' ? 'Full-stack' : 'Backend'}
            </span>
          ))}
        </div>
        <h2 id={titleId} className="mt-3 font-display text-3xl font-semibold tracking-tight">
          {p.title}
        </h2>
        <p className="mt-1 font-medium text-accent">{p.tagline}</p>
        <p className="mt-4 leading-relaxed text-muted">{p.description}</p>

        {p.points && (
          <ul className="mt-5 space-y-2">
            {p.points.map((pt) => (
              <li key={pt} className="flex gap-3 text-[15px] leading-relaxed text-muted">
                <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-br from-accent to-accent-2" />
                {pt}
              </li>
            ))}
          </ul>
        )}

        <h3 className="mt-6 font-mono text-xs tracking-widest text-subtle uppercase">Stack</h3>
        <ul className="mt-2 flex flex-wrap gap-1.5">
          {p.stack.map((s) => (
            <li key={s} className="chip">
              {s}
            </li>
          ))}
        </ul>

        {p.video && (
          <div className="mt-6">
            <Video url={p.video} title={p.title} />
          </div>
        )}

        <div className="mt-7 flex flex-wrap gap-2">
          <a
            href={p.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center gap-2 rounded-full bg-fg px-5 text-sm font-semibold text-bg transition-opacity hover:opacity-90"
          >
            <GithubIcon size={16} /> View code <span className="sr-only">(opens in a new tab)</span>
          </a>
          {p.live && (
            <a
              href={p.live}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center gap-2 rounded-full border border-line bg-surface-2 px-5 text-sm font-semibold text-fg transition-colors hover:border-accent/50"
            >
              <ArrowUpRight size={16} aria-hidden="true" /> Live demo <span className="sr-only">(opens in a new tab)</span>
            </a>
          )}
          {p.video && (
            <a
              href={p.video}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center gap-2 rounded-full border border-line bg-surface-2 px-5 text-sm font-semibold text-fg transition-colors hover:border-accent/50"
            >
              <Play size={16} aria-hidden="true" /> Watch on YouTube <span className="sr-only">(opens in a new tab)</span>
            </a>
          )}
        </div>
      </div>
    </Dialog>
  );
}
