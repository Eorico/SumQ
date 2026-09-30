import { createFileRoute, Link } from "@tanstack/react-router";

import { Shell, SumoLogo } from "@/components/Shell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sumo Quiz — Two-Player Classroom Quiz Battle" },
      {
        name: "description",
        content:
          "A two-player educational quiz battle. Answer correctly to push your opponent's sumo wrestler out of the ring.",
      },
      { property: "og:title", content: "Sumo Quiz — Two-Player Classroom Quiz Battle" },
      {
        property: "og:description",
        content:
          "Build your own question sets and let two students battle: every correct answer pushes the opposing sumo closer to the edge.",
      },
    ],
  }),
  component: Home,
});

const options = [
  {
    to: "/create",
    title: "Create Game",
    body: "Write your own questions, mark the correct answers, and save a match.",
  },
  {
    to: "/games",
    title: "My Games",
    body: "Open a saved question set, edit it, or launch it in the arena.",
  },
  {
    to: "/games",
    title: "Start Game",
    body: "Jump straight into a battle with a ready-made question set.",
  },
  {
    to: "/how-to-play",
    title: "How to Play",
    body: "The rules in thirty seconds — answer, push, win the ring.",
  },
];

function Home() {
  return (
    <Shell>
      <section className="flex flex-col items-center text-center">
        <div className="animate-float">
          <SumoLogo className="h-48 w-auto drop-shadow-[0_28px_28px_oklch(0.3_0.04_60_/_0.3)] sm:h-64" />
        </div>
        <h1 className="mt-6 text-5xl font-black sm:text-6xl">Sumo Quiz</h1>
        <p className="mt-4 max-w-xl text-lg text-muted-foreground">
          A two-player quiz battle for the classroom. Every correct answer pushes your
          opponent's sumo wrestler closer to the edge of the ring.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/games"
            className="tactile btn-ink rounded-full px-8 py-4 font-display text-base font-bold"
          >
            Start a Game
          </Link>
          <Link
            to="/create"
            className="tactile btn-paper rounded-full px-8 py-4 font-display text-base font-bold"
          >
            Create Questions
          </Link>
        </div>
      </section>

      <section className="mt-16 grid gap-4 sm:grid-cols-2">
        {options.map((o) => (
          <Link
            key={o.title}
            to={o.to}
            className="tactile surface group flex flex-col gap-2 rounded-3xl p-6 text-left"
          >
            <h2 className="font-display text-xl font-bold">{o.title}</h2>
            <p className="text-sm text-muted-foreground">{o.body}</p>
            <span className="mt-2 text-sm font-bold text-accent-foreground/70 transition-transform group-hover:translate-x-1">
              Open →
            </span>
          </Link>
        ))}
      </section>
    </Shell>
  );
}
