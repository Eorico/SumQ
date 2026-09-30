import fightingSumo from "@/assets/fighting-sumo.png.asset.json";

export const PUSH_LIMIT = 5;

type Props = {
  /** Positive = blue is being pushed toward the right edge. */
  push: number;
  impact: 1 | 2 | null;
  winner: 1 | 2 | "draw" | null;
};

export function Dohyo({ push, impact, winner }: Props) {
  const ratio = Math.max(-1, Math.min(1, push / PUSH_LIMIT));
  const danger = Math.abs(ratio) >= 0.8;
  const offset = ratio * 30; // percent of ring width
  const settled = winner === 1 || winner === 2;
  const finalOffset = settled ? (winner === 1 ? 46 : -46) : offset;

  return (
    <div className="relative flex w-full flex-col items-center gap-6">
      <div className="flex w-full items-center justify-between px-2 text-xs font-bold uppercase tracking-[0.2em]">
        <span className="text-red-sumo">Red · Player 1</span>
        <span className="text-muted-foreground">Sumo Arena</span>
        <span className="text-blue-sumo">Blue · Player 2</span>
      </div>

      {/* Push meter */}
      <div className="relative h-3 w-full overflow-hidden rounded-full bg-secondary shadow-press">
        <div
          className="absolute inset-y-0 rounded-full bg-red-sumo transition-all duration-500 ease-out"
          style={{ left: "50%", width: `${Math.max(0, ratio) * 50}%` }}
        />
        <div
          className="absolute inset-y-0 rounded-full bg-blue-sumo transition-all duration-500 ease-out"
          style={{ right: "50%", width: `${Math.max(0, -ratio) * 50}%` }}
        />
        <div className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 bg-foreground/25" />
      </div>

      {/* Arena */}
      <div className="relative w-full">
        <div
          className={`relative mx-auto aspect-[16/11] w-full max-w-3xl overflow-hidden rounded-[999px_999px_48px_48px] transition-shadow duration-500 ${
            danger ? "ring-4 ring-destructive/40" : ""
          }`}
        >
          {/* sand surround */}
          <div className="absolute inset-0 rounded-[999px_999px_48px_48px] bg-sand shadow-float" />

          {/* the dohyo floor */}
          <div className="absolute inset-x-[6%] bottom-[8%] top-[22%] rounded-[50%] dohyo-floor">
            <div className="absolute inset-[7%] rounded-[50%] border-2 border-dashed border-dohyo-edge/70" />
            <div className="absolute left-1/2 top-1/2 h-[6%] w-[24%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-dohyo-edge/45" />
          </div>

          {/* edge danger zones */}
          <div
            className={`absolute bottom-[8%] left-[4%] top-[24%] w-[12%] rounded-l-[50%] bg-blue-sumo/25 transition-opacity duration-500 ${
              danger && ratio < 0 ? "opacity-100" : "opacity-0"
            }`}
          />
          <div
            className={`absolute bottom-[8%] right-[4%] top-[24%] w-[12%] rounded-r-[50%] bg-red-sumo/25 transition-opacity duration-500 ${
              danger && ratio > 0 ? "opacity-100" : "opacity-0"
            }`}
          />

          {/* the wrestlers, locked in a grapple */}
          <div
            className="absolute inset-x-0 bottom-[12%] flex justify-center transition-transform duration-700 ease-out"
            style={{ transform: `translateX(${finalOffset}%)` }}
          >
            <div
              className={`relative ${settled ? "animate-cheer" : "animate-float"} ${
                impact ? "animate-shake" : ""
              }`}
            >
              <img
                src={fightingSumo.url}
                alt="Red sumo and blue sumo locked in a push"
                className="sumo-shadow h-[clamp(190px,26vw,340px)] w-auto select-none"
                draggable={false}
              />
              {impact && (
                <span
                  className={`animate-flash absolute top-[14%] font-display text-2xl font-black tracking-tight ${
                    impact === 1
                      ? "right-[-12%] text-red-sumo"
                      : "left-[-12%] text-blue-sumo"
                  }`}
                >
                  PUSH!
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <p className="text-center text-sm font-semibold text-muted-foreground">
        {settled
          ? `${winner === 1 ? "Blue" : "Red"} sumo is out of the ring!`
          : danger
            ? `${ratio > 0 ? "Blue" : "Red"} sumo is at the edge — one more push!`
            : "Answer correctly to push your opponent toward the edge."}
      </p>
    </div>
  );
}
