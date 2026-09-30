import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";

import { Dohyo, PUSH_LIMIT } from "@/components/Dohyo";
import { QuestionPanel, type Feedback } from "@/components/QuestionPanel";
import { SumoLogo } from "@/components/Shell";
import { getGame, type Game } from "@/lib/games";

export const Route = createFileRoute("/play/$gameId")({
  head: () => ({
    meta: [
      { title: "Sumo Arena — Sumo Quiz" },
      {
        name: "description",
        content:
          "The Sumo Quiz arena: Player 1 on the left, Player 2 on the right, and a dohyo in the middle where correct answers push the opponent out.",
      },
      { property: "og:title", content: "Sumo Arena — Sumo Quiz" },
      { property: "og:description", content: "Answer, push, and win the ring." },
    ],
  }),
  component: Play,
});

type PlayerState = { score: number; wrong: number; answered: number; index: number };

const freshPlayer: PlayerState = { score: 0, wrong: 0, answered: 0, index: 0 };

function Play() {
  const { gameId } = Route.useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState<Game | null | undefined>(undefined);

  useEffect(() => {
    setGame(getGame(gameId) ?? null);
  }, [gameId]);

  if (game === undefined) {
    return <CenterNote>Loading the arena…</CenterNote>;
  }
  if (game === null) {
    return (
      <CenterNote>
        <p className="font-display text-xl font-bold">That game could not be found.</p>
        <Link to="/games" className="tactile btn-ink mt-5 inline-flex rounded-full px-6 py-3 font-bold">
          Back to My Games
        </Link>
      </CenterNote>
    );
  }

  return <Match key={game.id} game={game} onHome={() => navigate({ to: "/" })} />;
}

function Match({ game, onHome }: { game: Game; onHome: () => void }) {
  const questions = game.questions.filter(
    (q) => q.text.trim() && q.choices.every((c) => c.trim()),
  );
  const total = questions.length;

  const [p1, setP1] = useState(freshPlayer);
  const [p2, setP2] = useState(freshPlayer);
  const [push, setPush] = useState(0);
  const [impact, setImpact] = useState<1 | 2 | null>(null);
  const [feedback1, setFeedback1] = useState<Feedback>(null);
  const [feedback2, setFeedback2] = useState<Feedback>(null);
  const [winner, setWinner] = useState<1 | 2 | "draw" | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(
    () => () => {
      timers.current.forEach(clearTimeout);
    },
    [],
  );

  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms));
  }, []);

  const answer = useCallback(
    (player: 1 | 2, choice: number) => {
      if (winner) return;
      const state = player === 1 ? p1 : p2;
      const setState = player === 1 ? setP1 : setP2;
      const setFeedback = player === 1 ? setFeedback1 : setFeedback2;
      const active = player === 1 ? feedback1 : feedback2;
      if (active) return;

      const question = questions[state.index];
      const correct = choice === question.correctIndex;
      setFeedback({ status: correct ? "correct" : "wrong", chosen: choice });

      let nextPush = push;
      if (correct) {
        nextPush = push + (player === 1 ? 1 : -1);
        setPush(nextPush);
        setImpact(player);
        later(() => setImpact(null), 500);
      }

      const answered = state.answered + 1;
      setState({
        score: state.score + (correct ? 1 : 0),
        wrong: state.wrong + (correct ? 0 : 1),
        answered,
        index: (state.index + 1) % total,
      });

      if (Math.abs(nextPush) >= PUSH_LIMIT) {
        later(() => setWinner(nextPush > 0 ? 1 : 2), 600);
        return;
      }

      const otherAnswered = player === 1 ? p2.answered : p1.answered;
      if (answered >= total && otherAnswered >= total) {
        const s1 = player === 1 ? state.score + (correct ? 1 : 0) : p1.score;
        const s2 = player === 2 ? state.score + (correct ? 1 : 0) : p2.score;
        later(() => setWinner(s1 === s2 ? "draw" : s1 > s2 ? 1 : 2), 900);
      }

      later(() => setFeedback(null), correct ? 800 : 1100);
    },
    [feedback1, feedback2, later, p1, p2, push, questions, total, winner],
  );

  function reset() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setP1(freshPlayer);
    setP2(freshPlayer);
    setPush(0);
    setImpact(null);
    setFeedback1(null);
    setFeedback2(null);
    setWinner(null);
  }

  if (total === 0) {
    return (
      <CenterNote>
        <p className="font-display text-xl font-bold">This game has no finished questions yet.</p>
        <Link
          to="/create"
          search={{ edit: game.id }}
          className="tactile btn-ink mt-5 inline-flex rounded-full px-6 py-3 font-bold"
        >
          Add questions
        </Link>
      </CenterNote>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="flex flex-col items-center gap-1 border-b border-border/60 bg-background/70 py-3 backdrop-blur-xl">
        <Link to="/" className="flex items-center gap-3">
          <SumoLogo className="h-9 w-auto" />
          <span className="font-display text-base font-bold tracking-tight">Sumo Quiz</span>
        </Link>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
          {game.title}
        </p>
      </header>

      <div className="mx-auto grid max-w-[1700px] gap-6 px-4 py-6 lg:grid-cols-[minmax(280px,1fr)_minmax(420px,1.5fr)_minmax(280px,1fr)]">
        <QuestionPanel
          player={1}
          score={p1.score}
          answered={p1.answered}
          total={total}
          question={questions[p1.index]}
          feedback={feedback1}
          locked={!!feedback1 || !!winner}
          onAnswer={(i) => answer(1, i)}
        />

        <div className="order-first flex items-center lg:order-none">
          <Dohyo push={push} impact={impact} winner={winner} />
        </div>

        <QuestionPanel
          player={2}
          score={p2.score}
          answered={p2.answered}
          total={total}
          question={questions[p2.index]}
          feedback={feedback2}
          locked={!!feedback2 || !!winner}
          onAnswer={(i) => answer(2, i)}
        />
      </div>

      {winner && (
        <WinnerScreen
          winner={winner}
          p1={p1}
          p2={p2}
          onReplay={reset}
          onHome={onHome}
        />
      )}
    </div>
  );
}

function WinnerScreen({
  winner,
  p1,
  p2,
  onReplay,
  onHome,
}: {
  winner: 1 | 2 | "draw";
  p1: PlayerState;
  p2: PlayerState;
  onReplay: () => void;
  onHome: () => void;
}) {
  const champion = winner === "draw" ? null : winner === 1 ? p1 : p2;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-foreground/35 p-5 backdrop-blur-md">
      <div className="animate-pop surface w-full max-w-md rounded-[2.5rem] p-9 text-center">
        <div className="animate-float text-6xl">🏆</div>
        <h2
          className={`mt-4 font-display text-3xl font-black ${
            winner === 1 ? "text-red-sumo" : winner === 2 ? "text-blue-sumo" : ""
          }`}
        >
          {winner === "draw" ? "IT'S A DRAW!" : `PLAYER ${winner} WINS!`}
        </h2>

        <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
          Final score
        </p>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-red-sumo-soft p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-red-sumo">Player 1</p>
            <p className="font-display text-4xl font-black text-red-sumo">{p1.score}</p>
          </div>
          <div className="rounded-2xl bg-blue-sumo-soft p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-blue-sumo">Player 2</p>
            <p className="font-display text-4xl font-black text-blue-sumo">{p2.score}</p>
          </div>
        </div>

        {champion && (
          <p className="mt-5 text-sm text-muted-foreground">
            Winner's correct answers: <strong className="text-foreground">{champion.score}</strong>
            {" · "}
            Incorrect: <strong className="text-foreground">{champion.wrong}</strong>
          </p>
        )}

        <div className="mt-7 flex flex-col gap-3">
          <button onClick={onReplay} className="tactile btn-ink rounded-full py-4 font-display font-bold">
            Play Again
          </button>
          <button onClick={onHome} className="tactile btn-paper rounded-full py-4 font-display font-bold">
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

function CenterNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="surface rounded-3xl p-10 text-center text-muted-foreground">{children}</div>
    </div>
  );
}
