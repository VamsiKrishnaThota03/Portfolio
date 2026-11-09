import { m, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, type ReactNode } from 'react';
import { cn } from '../lib/utils';

/**
 * Accessible modal built on the native <dialog> element: showModal() gives us
 * focus containment, Escape handling and an inert background for free.
 * Render it inside <AnimatePresence> and unmount it to close.
 */
export function Dialog({
  onClose,
  labelledBy,
  children,
  className,
  position = 'center',
}: {
  onClose: () => void;
  labelledBy: string;
  children: ReactNode;
  className?: string;
  position?: 'center' | 'top';
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const dlg = ref.current;
    if (!dlg) return;
    const opener = document.activeElement as HTMLElement | null;
    if (!dlg.open) dlg.showModal();
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = prev;
      if (dlg.open) dlg.close();
      opener?.focus?.({ preventScroll: true });
    };
  }, []);

  return (
    <dialog
      ref={ref}
      aria-labelledby={labelledBy}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className={cn(
        'fixed inset-0 m-0 h-full max-h-none w-full max-w-none overflow-y-auto bg-transparent p-3 text-fg backdrop:bg-transparent sm:p-6',
      )}
    >
      <m.div
        aria-hidden="true"
        className="fixed inset-0 -z-10 bg-black/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <div
        className={cn('flex min-h-full justify-center', position === 'center' ? 'items-center' : 'items-start pt-[10vh]')}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <m.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.98 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className={cn('relative w-full rounded-3xl border border-line bg-bg-2 shadow-2xl shadow-black/40', className)}
        >
          {children}
        </m.div>
      </div>
    </dialog>
  );
}
