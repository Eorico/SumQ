import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { Shell } from "@/components/Shell";
import { deleteGame, isPlayable, loadGames, type Game } from "@/lib/games";

export const Route = createFileRoute("/games")({
  head: () => ({
    meta: [
      { title: "My Games — Sumo Quiz" },
      {
        name: "description",
        content: "Your saved Sumo Quiz question sets. Open one to edit it or launch it in the arena.",
      },
      { property: "og:title", content: "My Games — Sumo Quiz" },
      { property: "og:description", content: "Saved question sets, ready to battle." },
    ],
  }),
  component: Games,
});

function Games() {
  const [games, setGames] = useState<Game[] | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setGames(loadGames());
  }, []);

  function remove(id: string) {
    deleteGame(id);
    setGames(loadGames());
  }

  return (
    <Shell>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black">My Games</h1>
          <p className="mt-2 text-muted-foreground">Saved question sets on this device.</p>
        </div>
        <Link to="/create" className="tactile btn-ink rounded-full px-6 py-3 font-display font-bold">
          New Game
        </Link>
      </div>

      <div className="mt-8 grid gap-4">
        {games === null && <p className="text-muted-foreground">Loading…</p>}
        {games?.length === 0 && (
          <p className="surface rounded-3xl p-8 text-center text-muted-foreground">
            No saved games yet. Create your first question set.
          </p>
        )}
        {games?.map((game) => (
          <article key={game.id} className="surface flex flex-wrap items-center gap-4 rounded-3xl p-6">
            <div className="min-w-56 flex-1">
              <h2 className="font-display text-xl font-bold">{game.title || "Untitled game"}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {game.description || "No description"}
              </p>
              <p className="mt-2 text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">
                {game.questions.length} question{game.questions.length === 1 ? "" : "s"}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={!isPlayable(game)}
                onClick={() => navigate({ to: "/play/$gameId", params: { gameId: game.id } })}
                className="tactile btn-ink rounded-full px-5 py-2.5 text-sm font-bold"
              >
                Start
              </button>
              <Link
                to="/create"
                search={{ edit: game.id }}
                className="tactile btn-paper rounded-full px-5 py-2.5 text-sm font-bold"
              >
                Edit
              </Link>
              <button
                type="button"
                onClick={() => remove(game.id)}
                className="tactile btn-paper rounded-full px-5 py-2.5 text-sm font-bold text-destructive"
              >
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </Shell>
  );
}
