import { allSections } from '../data/profile';
import { useActiveSection } from '../hooks/useActiveSection';
import { cn, scrollToId } from '../lib/utils';

const ids = allSections.map((s) => s.id);

/** Desktop-only vertical index of every section, with the current one lit. */
export function SectionRail() {
  const active = useActiveSection(ids) || 'top';
  return (
    <nav aria-label="Section index" className="fixed top-1/2 right-5 z-40 hidden -translate-y-1/2 xl:block">
      <ul className="flex flex-col items-end gap-3">
        {allSections.map((s) => {
          const on = active === s.id;
          return (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToId(s.id);
                }}
                aria-current={on ? 'true' : undefined}
                className="group flex items-center gap-3 rounded-full py-0.5 pl-2"
              >
                <span
                  className={cn(
                    'font-mono text-[10px] tracking-wider uppercase transition-all duration-300',
                    on ? 'text-fg opacity-100' : 'translate-x-1 text-subtle opacity-0 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:opacity-100',
                  )}
                >
                  {s.label}
                </span>
                <span
                  className={cn(
                    'block h-1.5 rounded-full transition-all duration-300',
                    on ? 'w-6 bg-gradient-to-r from-accent to-accent-2' : 'w-1.5 bg-subtle/50 group-hover:bg-fg',
                  )}
                  aria-hidden="true"
                />
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
