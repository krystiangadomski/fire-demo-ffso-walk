interface Props {
  progress: number;
  loaded: number;
  total: number;
  hidden: boolean;
}

export function LoadingScreen({ progress, loaded, total, hidden }: Props) {
  const pct = Math.round(progress * 100);
  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-black transition-opacity duration-700 ${
        hidden ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
      aria-hidden={hidden}
    >
      <div className="flex flex-col items-center">
        <div className="mb-6 text-[0.65rem] uppercase tracking-[0.5em] text-white/50">
          Loading experience
        </div>
        <div className="mb-8 font-semibold tabular-nums text-7xl md:text-8xl">
          {pct}
          <span className="text-white/30">%</span>
        </div>
        <div className="h-[1px] w-72 overflow-hidden bg-white/10">
          <div
            className="h-full bg-white transition-[width] duration-150 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="mt-6 text-[0.65rem] uppercase tracking-[0.4em] tabular-nums text-white/30">
          {loaded} / {total} frames
        </div>
      </div>
    </div>
  );
}
