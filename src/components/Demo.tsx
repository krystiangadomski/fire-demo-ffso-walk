import { useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollToPlugin);

// ---------- PLACEHOLDER DATA — replace with real sprint content ----------

const SPRINT = {
  label: 'Sprint Review · 2026 W17–W18',
  headline: 'REPLACE ME\nwith the sprint headline',
  lede:
    'REPLACE ME with a one-paragraph summary of what this sprint shipped, ' +
    'why it matters, and who benefits. Keep it short and punchy.',
};

type TaskTag = 'EXTRA' | 'SPIKE' | 'PoC' | 'BUG' | 'ACTIVE';
type TaskState = 'review' | 'active' | 'closed';

interface Task {
  desc: string;
  tags: TaskTag[];
  state: TaskState;
  sp: string;
}

interface Workstream {
  id: string;
  title: string;
  icon: string;
  sp: string;
  accent: string;
  tasks: Task[];
}

const WORKSTREAMS: Workstream[] = [
  {
    id: 'ws-1',
    title: 'REPLACE: Workstream A',
    icon: '◆',
    sp: '?',
    accent: '#6b7fc4',
    tasks: [
      { desc: 'REPLACE: task description', tags: ['EXTRA'], state: 'review', sp: '?' },
      { desc: 'REPLACE: task description', tags: ['EXTRA'], state: 'review', sp: '?' },
      { desc: 'REPLACE: task description', tags: [], state: 'review', sp: '?' },
    ],
  },
  {
    id: 'ws-2',
    title: 'REPLACE: Workstream B',
    icon: '◇',
    sp: '?',
    accent: '#4dd0e1',
    tasks: [
      { desc: 'REPLACE: task description', tags: ['SPIKE'], state: 'review', sp: '?' },
      { desc: 'REPLACE: task description', tags: ['PoC', 'ACTIVE'], state: 'active', sp: '?' },
      { desc: 'REPLACE: task description', tags: [], state: 'review', sp: '?' },
    ],
  },
  {
    id: 'ws-3',
    title: 'REPLACE: Workstream C',
    icon: '▲',
    sp: '?',
    accent: '#c4706a',
    tasks: [
      { desc: 'REPLACE: task description', tags: ['EXTRA'], state: 'review', sp: '?' },
      { desc: 'REPLACE: task description', tags: ['BUG'], state: 'closed', sp: '?' },
      { desc: 'REPLACE: task description', tags: [], state: 'review', sp: '?' },
    ],
  },
  {
    id: 'ws-4',
    title: 'REPLACE: Workstream D',
    icon: '●',
    sp: '?',
    accent: '#b39ddb',
    tasks: [
      { desc: 'REPLACE: task description', tags: ['EXTRA'], state: 'review', sp: '?' },
      { desc: 'REPLACE: task description', tags: [], state: 'review', sp: '?' },
      { desc: 'REPLACE: task description', tags: ['EXTRA'], state: 'review', sp: '?' },
    ],
  },
];

const TAKEAWAYS = [
  'REPLACE: key takeaway #1 — what surprised us, what changed, what we learned',
  'REPLACE: key takeaway #2',
  'REPLACE: key takeaway #3',
  'REPLACE: key takeaway #4',
  'REPLACE: key takeaway #5',
];

const SP_SUMMARY = {
  previousCapacity: 0, // REPLACE: prior sprint capacity baseline in SP
  delivered: 0, // REPLACE: SP delivered this sprint
  growthPct: 0, // REPLACE: percent of capacity delivered (e.g. 358)
  note: 'REPLACE: short note about totals, active items, bugs closed',
};

// ---------- Components ----------

function TagPill({ tag }: { tag: TaskTag }) {
  const styles: Record<TaskTag, string> = {
    EXTRA: 'text-amber-300/90 border-amber-500/40 bg-amber-500/10',
    SPIKE: 'text-violet-300/90 border-violet-500/40 bg-violet-500/10',
    PoC: 'text-sky-300/90 border-sky-500/40 bg-sky-500/10',
    BUG: 'text-rose-300/90 border-rose-500/40 bg-rose-500/10',
    ACTIVE: 'text-emerald-300/90 border-emerald-500/40 bg-emerald-500/10 animate-pulse',
  };
  return (
    <span
      className={`inline-block rounded-full border px-2 py-[2px] text-[0.55rem] font-semibold uppercase tracking-[0.15em] ${styles[tag]}`}
    >
      {tag}
    </span>
  );
}

function StateDot({ state }: { state: TaskState }) {
  const color =
    state === 'active'
      ? 'bg-emerald-400 animate-pulse'
      : state === 'closed'
      ? 'bg-white/30'
      : 'bg-sky-400';
  return <span className={`mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full ${color}`} />;
}

function WorkstreamCard({
  ws,
  spVisible,
}: {
  ws: Workstream;
  spVisible: boolean;
}) {
  return (
    <div
      className="glass flex flex-col gap-3 rounded-xl p-5"
      style={{ borderTop: `2px solid ${ws.accent}80` }}
    >
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-3">
          <span className="text-xl" style={{ color: ws.accent }}>
            {ws.icon}
          </span>
          <span className="text-sm font-semibold uppercase tracking-widest text-white/90">
            {ws.title}
          </span>
        </div>
        <span
          className={`text-xs font-bold tabular-nums transition-opacity duration-500 ${spVisible ? 'opacity-100' : 'opacity-0'}`}
          style={{ color: ws.accent }}
        >
          {ws.sp} SP
        </span>
      </div>
      <ul className="flex flex-col gap-2">
        {ws.tasks.map((t, i) => (
          <li
            key={i}
            className="flex items-start gap-3 rounded-lg border border-white/5 bg-black/30 p-3 transition hover:border-white/20 hover:bg-black/50"
          >
            <StateDot state={t.state} />
            <span className="flex-1 text-[0.8rem] leading-relaxed text-white/85">{t.desc}</span>
            <div className="flex flex-col items-end gap-1">
              <div className="flex flex-wrap justify-end gap-1">
                {t.tags.map((tag) => (
                  <TagPill key={tag} tag={tag} />
                ))}
              </div>
              <span
                className={`min-w-[28px] rounded-md px-2 py-[2px] text-center text-[0.65rem] font-bold tabular-nums text-black transition-all duration-500 ${spVisible ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}
                style={{ background: ws.accent }}
              >
                {t.sp}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Demo() {
  const [spVisible, setSpVisible] = useState(false);

  const scrollToTop = useCallback(() => {
    gsap.to(window, { scrollTo: 0, duration: 1.6, ease: 'power3.inOut' });
  }, []);

  return (
    <div className="relative z-10" style={{ height: '500vh' }}>
      {/* ---------- 1. HERO (0–100vh) ---------- */}
      <section className="relative flex h-screen flex-col justify-end pb-28">
        <div className="relative w-full max-w-3xl pl-10 pr-8 md:pl-16 lg:pl-20">
          <div className="mb-6 text-[0.65rem] uppercase tracking-[0.5em] text-white/70">
            {SPRINT.label}
          </div>
          <h1 className="mb-8 whitespace-pre-line text-5xl font-bold leading-[1.05] md:text-7xl lg:text-8xl">
            {SPRINT.headline}
          </h1>
          <p className="mb-12 max-w-xl text-lg leading-relaxed text-white/80 md:text-xl">
            {SPRINT.lede}
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => setSpVisible((v) => !v)}
              className="glass-strong rounded-full px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-white/20"
            >
              {spVisible ? 'Hide' : 'Reveal'} story points
            </button>
          </div>
        </div>
      </section>

      {/* ---------- 2. FEATURE COLUMNS (100–200vh) ---------- */}
      <section className="relative flex min-h-screen items-center py-24">
        <div className="mx-auto w-full max-w-7xl px-8">
          <div className="mb-14 max-w-2xl">
            <div className="mb-3 text-[0.65rem] uppercase tracking-[0.5em] text-white/60">
              01 · Delivered
            </div>
            <h2 className="text-4xl font-semibold leading-tight md:text-5xl">
              REPLACE: section heading — e.g. "What we shipped"
            </h2>
            <p className="mt-4 text-white/70">
              REPLACE: optional deck/intro sentence for this section.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {WORKSTREAMS.map((ws) => (
              <WorkstreamCard key={ws.id} ws={ws} spVisible={spVisible} />
            ))}
          </div>
        </div>
      </section>

      {/* ---------- 3. TAKEAWAYS (200–300vh) ---------- */}
      <section className="relative flex min-h-screen items-center py-24">
        <div className="mx-auto w-full max-w-5xl px-8">
          <div className="mb-14 text-center">
            <div className="mb-3 text-[0.65rem] uppercase tracking-[0.5em] text-white/60">
              02 · Learned
            </div>
            <h2 className="text-4xl font-semibold md:text-5xl">Key takeaways</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {TAKEAWAYS.map((t, i) => (
              <div key={i} className="glass flex gap-5 rounded-xl p-6">
                <div className="shrink-0 text-4xl font-bold tabular-nums text-white/20">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div className="text-base leading-relaxed text-white/90 md:text-lg">{t}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- 4. SP SUMMARY (300–400vh) ---------- */}
      <section className="relative flex min-h-screen items-center py-24">
        <div className="mx-auto w-full max-w-4xl px-8">
          <div className="mb-12 text-center">
            <div className="mb-3 text-[0.65rem] uppercase tracking-[0.5em] text-white/60">
              03 · Numbers
            </div>
            <h2 className="text-4xl font-semibold md:text-5xl">By the numbers</h2>
          </div>

          <div className="glass rounded-2xl p-8 md:p-10">
            <div className="mb-3 flex justify-between text-sm">
              <span className="text-indigo-300/90">
                Capacity: <span className="font-semibold text-white">{SP_SUMMARY.previousCapacity}</span> SP
              </span>
              <span className="text-emerald-300/90">
                Delivered: <span className="font-semibold text-white">{SP_SUMMARY.delivered}</span> SP
              </span>
            </div>
            <div className="relative h-10 overflow-hidden rounded-md border border-white/10 bg-black/40">
              <div
                className="absolute inset-y-0 left-0 bg-emerald-500/80 transition-[width] duration-1000 ease-out"
                style={{
                  width: spVisible
                    ? `${Math.min(100, (SP_SUMMARY.delivered / Math.max(SP_SUMMARY.previousCapacity || 1, SP_SUMMARY.delivered)) * 100)}%`
                    : '0%',
                }}
              />
              <div
                className="absolute inset-y-0 left-0 bg-indigo-500/80 transition-[width] duration-1000 ease-out"
                style={{
                  width: spVisible
                    ? `${Math.min(100, (SP_SUMMARY.previousCapacity / Math.max(SP_SUMMARY.previousCapacity || 1, SP_SUMMARY.delivered)) * 100)}%`
                    : '0%',
                }}
              />
            </div>
            <div
              className={`mt-4 text-center text-lg font-semibold text-emerald-300 transition-opacity duration-700 ${spVisible ? 'opacity-100' : 'opacity-0'}`}
            >
              {SP_SUMMARY.growthPct}% of capacity delivered
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-2 border-t border-white/10 pt-6">
              {WORKSTREAMS.map((ws) => (
                <span
                  key={ws.id}
                  className="flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium tabular-nums"
                  style={{ borderColor: `${ws.accent}80`, color: ws.accent }}
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: ws.accent }}
                  />
                  {ws.title} · {ws.sp} SP
                </span>
              ))}
            </div>

            <p className="mt-6 rounded-md border border-dashed border-white/10 bg-black/30 p-3 text-center text-xs text-white/60">
              {SP_SUMMARY.note}
            </p>

            <div className="mt-8 text-center">
              <button
                onClick={() => setSpVisible(true)}
                className="rounded-full bg-white px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-black transition hover:bg-white/80"
              >
                Animate numbers
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- 5. THANKS / CTA (400–500vh) ---------- */}
      <section className="relative flex min-h-screen items-center justify-center">
        <div className="px-8 text-center">
          <div className="mb-6 text-[0.65rem] uppercase tracking-[0.5em] text-white/60">
            End of demo
          </div>
          <h2 className="mb-6 text-5xl font-bold md:text-7xl">Thank you</h2>
          <p className="mx-auto mb-10 max-w-lg text-lg text-white/70">
            REPLACE: closing line — Q&amp;A invitation, thanks to the team, next sprint teaser, or
            contact info.
          </p>
          <button
            onClick={scrollToTop}
            className="glass-strong rounded-full px-8 py-4 text-xs font-semibold uppercase tracking-[0.3em] transition hover:bg-white/20"
          >
            ↑ Replay
          </button>
        </div>
      </section>
    </div>
  );
}
