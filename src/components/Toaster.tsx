import { AnimatePresence, m } from 'framer-motion';
import { Check } from 'lucide-react';
import { useApp } from '../lib/app-context';

export function Toaster() {
  const { toasts } = useApp();
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[80] flex flex-col items-center gap-2 px-4" role="status" aria-live="polite">
      <AnimatePresence>
        {toasts.map((t) => (
          <m.div
            key={t.id}
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            className="glass pointer-events-auto flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-fg shadow-xl"
          >
            <Check size={16} className="text-accent-2" aria-hidden="true" />
            {t.message}
          </m.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
