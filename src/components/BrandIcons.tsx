import type { SVGProps } from 'react';
import { Mail } from 'lucide-react';
import type { SocialKey } from '../data/profile';

type P = SVGProps<SVGSVGElement> & { size?: number };

export function GithubIcon({ size = 18, ...p }: P) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true" {...p}>
      <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.7 5.39-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  );
}

export function LinkedinIcon({ size = 18, ...p }: P) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true" {...p}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
    </svg>
  );
}

export function LeetcodeIcon({ size = 18, ...p }: P) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true" {...p}>
      <path d="M13.48 0a1.37 1.37 0 0 0-.96.44L7.12 6.22l-4.06 4.37a5.32 5.32 0 0 0-1.27 2.04 5.6 5.6 0 0 0 .02 3.65c.2.6.51 1.16.93 1.66l4.38 4.66a5.46 5.46 0 0 0 7.63.33l2.69-2.51a1.38 1.38 0 0 0-1.88-2.01l-2.69 2.51a2.7 2.7 0 0 1-3.74-.17L4.75 16.1a2.84 2.84 0 0 1-.04-3.83l3.98-4.28 5.38-5.77A1.38 1.38 0 0 0 13.48 0Zm-2.85 13.07a1.38 1.38 0 1 0 0 2.76h10a1.38 1.38 0 1 0 0-2.76h-10Z" />
    </svg>
  );
}

export function SocialIcon({ k, size = 18 }: { k: SocialKey; size?: number }) {
  if (k === 'github') return <GithubIcon size={size} />;
  if (k === 'linkedin') return <LinkedinIcon size={size} />;
  if (k === 'leetcode') return <LeetcodeIcon size={size} />;
  return <Mail size={size} aria-hidden="true" />;
}
