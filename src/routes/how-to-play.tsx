import { createFileRoute, Link } from "@tanstack/react-router";

import { Shell } from "@/components/Shell";

export const Route = createFileRoute("/how-to-play")({
  head: () => ({
    meta: [
      { title: "How to Play — Sumo Quiz" },
      {
        name: "description",
        content:
          "Learn the Sumo Quiz rules: two players, one shared question set, and a ring where correct answers push the opponent out.",
      },
      { property: "og:title", content: "How to Play — Sumo Quiz" },
      {
        property: "og:description",
        content: "Two players, one question set, and a sumo ring. Correct answers push the opponent out.",
      },
    ],
  }),
  component: HowToPlay,
});

const steps = [
  {
    title: "Two players, one screen",
    body: "Player 1 uses the left panel and the red sumo. Player 2 uses the right panel and the blue sumo. Both answer at their own pace.",
  },
  {
    title: "Answer to earn push power",
    body: "A correct answer scores a point and shoves the opposing wrestler one step toward the edge of the ring.",
  },
  {
    title: "Wrong answers cost momentum",
    body: "A wrong answer gives no push. The correct choice is shown briefly, then the next question appears.",
  },
  {
    title: "Win the ring",
    body: "Push your opponent completely out of the dohyo to win. If the question set runs out first, the higher score wins.",
  },
];

function HowToPlay() {
  return (
    <Shell>
      <h1 className="text-4xl font-black">How to Play</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Sumo Quiz turns a question set into a wrestling match. Simple enough to explain in one
        breath, fast enough for a whole class to take turns.
      </p>

      <ol className="mt-10 grid gap-4 sm:grid-cols-2">
        {steps.map((s, i) => (
          <li key={s.title} className="surface rounded-3xl p-6">
            <span className="tactile btn-ink inline-flex size-9 items-center justify-center rounded-full font-display font-bold">
              {i + 1}
            </span>
            <h2 className="mt-4 font-display text-lg font-bold">{s.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
          </li>
        ))}
      </ol>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link to="/games" className="tactile btn-ink rounded-full px-7 py-3.5 font-display font-bold">
          Start a Game
        </Link>
        <Link to="/create" className="tactile btn-paper rounded-full px-7 py-3.5 font-display font-bold">
          Create Questions
        </Link>
      </div>
    </Shell>
  );
}
