import { useEffect, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollToPlugin);

const TOTAL_SECTIONS = 5;

export function SectionNav() {
  const [section, setSection] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const s = Math.round(window.scrollY / window.innerHeight);
      setSection(Math.min(TOTAL_SECTIONS - 1, Math.max(0, s)));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const goTo = useCallback((s: number) => {
    const clamped = Math.min(TOTAL_SECTIONS - 1, Math.max(0, s));
    gsap.to(window, {
      scrollTo: window.innerHeight * clamped,
      duration: 1.8,
      ease: 'power3.inOut',
    });
  }, []);

  const atStart = section === 0;
  const atEnd = section === TOTAL_SECTIONS - 1;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-30 flex justify-center">
      <div className="glass-strong pointer-events-auto flex items-center gap-2 rounded-full px-2 py-2 shadow-2xl">
        <button
          onClick={() => goTo(section - 1)}
          disabled={atStart}
          aria-label="Previous section"
          className="group flex h-12 items-center gap-2 rounded-full px-5 text-xs font-semibold uppercase tracking-[0.25em] text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-30"
        >
          <span className="text-lg leading-none transition-transform group-hover:-translate-x-0.5">
            ←
          </span>
          <span>Prev</span>
        </button>

        <div className="px-4 text-[0.65rem] font-semibold uppercase tracking-[0.35em] tabular-nums text-white/70">
          {String(section + 1).padStart(2, '0')}
          <span className="mx-1 text-white/30">/</span>
          {String(TOTAL_SECTIONS).padStart(2, '0')}
        </div>

        <button
          onClick={() => goTo(section + 1)}
          disabled={atEnd}
          aria-label="Next section"
          className="group flex h-12 items-center gap-2 rounded-full bg-white px-6 text-xs font-semibold uppercase tracking-[0.25em] text-black transition hover:bg-white/80 disabled:cursor-not-allowed disabled:opacity-30"
        >
          <span>Next</span>
          <span className="text-lg leading-none transition-transform group-hover:translate-x-0.5">
            →
          </span>
        </button>
      </div>
    </div>
  );
}
