import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

export type Theme = 'dark' | 'light';

type Toast = { id: number; message: string };

type AppContextValue = {
  theme: Theme;
  /** Pass the toggle's screen position to get a circular theme-wipe (View Transitions API). */
  toggleTheme: (origin?: { x: number; y: number }) => void;
  paletteOpen: boolean;
  setPaletteOpen: (open: boolean) => void;
  toast: (message: string) => void;
  toasts: Toast[];
  /** False while the first-load intro curtain is covering the page. */
  introDone: boolean;
  finishIntro: () => void;
};

const AppContext = createContext<AppContextValue | null>(null);

function readTheme(): Theme {
  if (typeof document === 'undefined') return 'dark';
  return document.documentElement.classList.contains('light') ? 'light' : 'dark';
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(readTheme);
  const [paletteOpen, setPaletteOpen] = useState(false);
  // Intro curtain: once per session, never for reduced motion.
  const [introDone, setIntroDone] = useState(() => {
    if (typeof window === 'undefined') return true;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true;
    try {
      return sessionStorage.getItem('intro-done') === '1';
    } catch {
      return true;
    }
  });
  const finishIntro = useCallback(() => {
    setIntroDone(true);
    try {
      sessionStorage.setItem('intro-done', '1');
    } catch {
      /* private mode */
    }
  }, []);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(0);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('light', theme === 'light');
    root.classList.toggle('dark', theme === 'dark');
    try {
      localStorage.setItem('theme', theme);
    } catch {
      /* storage may be unavailable (private mode) */
    }
  }, [theme]);

  const toggleTheme = useCallback((origin?: { x: number; y: number }) => {
    const next: Theme = readTheme() === 'dark' ? 'light' : 'dark';
    const doc = document as Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void> } };
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!doc.startViewTransition || reduce || !origin) {
      setTheme(next);
      return;
    }
    // Swap the theme inside a view transition, then reveal the new theme
    // as a circle expanding from the toggle button.
    const vt = doc.startViewTransition(() => {
      document.documentElement.classList.toggle('light', next === 'light');
      document.documentElement.classList.toggle('dark', next === 'dark');
      setTheme(next);
    });
    vt.ready
      .then(() => {
        const r = Math.hypot(
          Math.max(origin.x, window.innerWidth - origin.x),
          Math.max(origin.y, window.innerHeight - origin.y),
        );
        document.documentElement.animate(
          { clipPath: [`circle(0px at ${origin.x}px ${origin.y}px)`, `circle(${r}px at ${origin.x}px ${origin.y}px)`] },
          { duration: 600, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', pseudoElement: '::view-transition-new(root)' },
        );
      })
      .catch(() => {
        /* transition skipped (e.g. tab hidden) — theme is already applied */
      });
  }, []);

  const toast = useCallback((message: string) => {
    const id = ++nextId.current;
    setToasts((t) => [...t, { id, message }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2600);
  }, []);

  const value = useMemo(
    () => ({ theme, toggleTheme, paletteOpen, setPaletteOpen, toast, toasts, introDone, finishIntro }),
    [theme, toggleTheme, paletteOpen, toast, toasts, introDone, finishIntro],
  );
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>');
  return ctx;
}
