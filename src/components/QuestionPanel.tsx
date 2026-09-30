import { CHOICE_LABELS, type Question } from "@/lib/games";

export type Feedback = { status: "correct" | "wrong"; chosen: number } | null;

type Props = {
  player: 1 | 2;
  score: number;
  answered: number;
  total: number;
  question: Question;
  feedback: Feedback;
  locked: boolean;
  onAnswer: (index: number) => void;
};

export function QuestionPanel({
  player,
  score,
  answered,
  total,
  question,
  feedback,
  locked,
  onAnswer,
}: Props) {
  const isRed = player === 1;
  const accent = isRed ? "text-red-sumo" : "text-blue-sumo";
  const chip = isRed ? "btn-red" : "btn-blue";

  return (
    <section className="surface flex h-full flex-col gap-5 rounded-3xl p-6">
      <header className="flex items-start justify-between gap-3">
        <div>
          <span
            className={`tactile ${chip} inline-flex rounded-full px-4 py-1.5 font-display text-xs font-bold uppercase tracking-[0.18em]`}
          >
            Player {player}
          </span>
          <p className="mt-3 text-sm font-semibold text-muted-foreground">
            Question {Math.min(answered + 1, total)} / {total}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-muted-foreground">
            Score
          </p>
          <p className={`font-display text-4xl font-black leading-none ${accent}`}>{score}</p>
        </div>
      </header>

      <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className={`h-full rounded-full transition-all duration-500 ${isRed ? "bg-red-sumo" : "bg-blue-sumo"}`}
          style={{ width: `${(answered / total) * 100}%` }}
        />
      </div>

      <h2 key={question.id} className="animate-rise text-xl font-bold leading-snug">
        {question.text}
      </h2>

      <div className="flex flex-col gap-3">
        {question.choices.map((choice, i) => {
          const chosen = feedback?.chosen === i;
          const revealCorrect = feedback && i === question.correctIndex;
          let state = "btn-paper";
          if (revealCorrect) state = "bg-success text-success-foreground";
          else if (chosen && feedback?.status === "wrong")
            state = "bg-destructive text-destructive-foreground";

          return (
            <button
              key={i}
              type="button"
              disabled={locked}
              onClick={() => onAnswer(i)}
              className={`tactile ${state} flex items-center gap-3 rounded-2xl px-4 py-3.5 text-left font-semibold ${
                chosen && feedback?.status === "wrong" ? "animate-shake" : ""
              } ${revealCorrect ? "animate-pop" : ""}`}
            >
              <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-foreground/10 font-display text-sm font-bold">
                {CHOICE_LABELS[i]}
              </span>
              <span>{choice}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-auto min-h-8 text-center">
        {feedback && (
          <p
            className={`animate-pop font-display text-lg font-black tracking-tight ${
              feedback.status === "correct" ? "text-success" : "text-destructive"
            }`}
          >
            {feedback.status === "correct" ? "CORRECT! PUSH!" : "WRONG!"}
          </p>
        )}
      </div>
    </section>
  );
}
