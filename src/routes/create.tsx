import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { Shell } from "@/components/Shell";
import {
  CHOICE_LABELS,
  emptyGame,
  emptyQuestion,
  getGame,
  isPlayable,
  saveGame,
  type Game,
  type Question,
} from "@/lib/games";

export const Route = createFileRoute("/create")({
  validateSearch: (search: Record<string, unknown>) => ({
    edit: typeof search.edit === "string" ? search.edit : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Create a Game — Sumo Quiz" },
      {
        name: "description",
        content:
          "Build a Sumo Quiz question set: add questions with four choices, mark the correct answer, then launch the match.",
      },
      { property: "og:title", content: "Create a Game — Sumo Quiz" },
      {
        property: "og:description",
        content: "Add questions, mark correct answers, and send two students into the ring.",
      },
    ],
  }),
  component: Create;
});

function Create() {
  const { edit } = Route.useSearch();
  const navigate = useNavigate();
  const [game, setGame] = useState<Game | null>(null);
  const [preview, setPreview] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setGame((edit ? getGame(edit) : null) ?? emptyGame());
  }, [edit]);

  if (!game) {
    return (
      <Shell>
        <p className="text-muted-foreground">Loading…</p>
      </Shell>
    );
  }

  function update(patch: Partial<Game>) {
    setGame((g) => (g ? { ...g, ...patch } : g));
    setSaved(false);
  }

  function updateQuestion(id: string, patch: Partial<Question>) {
    update({
      questions: game!.questions.map((q) => (q.id === id ? { ...q, ...patch } : q)),
    });
  }

  function move(index: number, direction: -1 | 1) {
    const next = [...game!.questions];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    update({ questions: next });
  }

  function persist() {
    const clean: Game = { ...game!, title: game!.title.trim() || "Untitled game" };
    saveGame(clean);
    setGame(clean);
    setSaved(true);
    return clean;
  }

  const ready = isPlayable(game);

  return (
    <Shell>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black">{edit ? "Edit Game" : "Create Game"}</h1>
          <p className="mt-2 text-muted-foreground">
            Add your questions, mark the correct answer, then send the wrestlers in.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setPreview((p) => !p)}
          className="tactile btn-paper rounded-full px-5 py-2.5 text-sm font-bold"
        >
          {preview ? "Back to editing" : "Preview"}
        </button>
      </div>

      {preview ? (
        <div className="mt-8 surface rounded-3xl p-7">
          <h2 className="font-display text-2xl font-bold">{game.title || "Untitled game"}</h2>
          {game.description && <p className="mt-2 text-muted-foreground">{game.description}</p>}
          {game.instructions && (
            <p className="mt-4 rounded-2xl bg-secondary p-4 text-sm">{game.instructions}</p>
          )}
          <ol className="mt-6 space-y-5">
            {game.questions.map((q, i) => (
              <li key={q.id}>
                <p className="font-bold">
                  {i + 1}. {q.text || "(empty question)"}
                </p>
                <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
                  {q.choices.map((c, ci) => (
                    <li
                      key={ci}
                      className={`rounded-xl px-3 py-2 text-sm ${
                        ci === q.correctIndex
                          ? "bg-success text-success-foreground font-bold"
                          : "bg-secondary"
                      }`}
                    >
                      {CHOICE_LABELS[ci]}. {c || "—"}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      ) : (
        <>
          <section className="mt-8 surface grid gap-4 rounded-3xl p-7">
            <Field label="Game title">
              <input
                value={game.title}
                onChange={(e) => update({ title: e.target.value })}
                placeholder="Grade 5 Warm-Up Match"
                className="input-base"
              />
            </Field>
            <Field label="Description">
              <input
                value={game.description}
                onChange={(e) => update({ description: e.target.value })}
                placeholder="Quick math round for classroom battles"
                className="input-base"
              />
            </Field>
            <Field label="Instructions (optional)">
              <textarea
                value={game.instructions}
                onChange={(e) => update({ instructions: e.target.value })}
                rows={2}
                placeholder="Player 1 answers on the left, Player 2 on the right."
                className="input-base"
              />
            </Field>
          </section>

          <div className="mt-8 space-y-4">
            {game.questions.map((q, i) => (
              <article key={q.id} className="surface rounded-3xl p-6">
                <header className="flex items-center justify-between gap-3">
                  <h2 className="font-display text-lg font-bold">Question {i + 1}</h2>
                  <div className="flex gap-1.5">
                    <IconButton label="Move up" onClick={() => move(i, -1)} disabled={i === 0}>
                      ↑
                    </IconButton>
                    <IconButton
                      label="Move down"
                      onClick={() => move(i, 1)}
                      disabled={i === game.questions.length - 1}
                    >
                      ↓
                    </IconButton>
                    <IconButton
                      label="Delete question"
                      onClick={() =>
                        update({ questions: game.questions.filter((x) => x.id !== q.id) })
                      }
                      disabled={game.questions.length === 1}
                    >
                      ✕
                    </IconButton>
                  </div>
                </header>

                <input
                  value={q.text}
                  onChange={(e) => updateQuestion(q.id, { text: e.target.value })}
                  placeholder="What is 5 × 5?"
                  className="input-base mt-4 font-semibold"
                />

                <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                  {q.choices.map((choice, ci) => (
                    <label
                      key={ci}
                      className={`flex items-center gap-2.5 rounded-2xl border-2 p-2.5 transition-colors ${
                        q.correctIndex === ci
                          ? "border-success bg-success/10"
                          : "border-border bg-card"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`correct-${q.id}`}
                        checked={q.correctIndex === ci}
                        onChange={() => updateQuestion(q.id, { correctIndex: ci })}
                        className="size-4 accent-[var(--success)]"
                      />
                      <span className="font-display text-sm font-bold">{CHOICE_LABELS[ci]}</span>
                      <input
                        value={choice}
                        onChange={(e) => {
                          const choices = [...q.choices] as Question["choices"];
                          choices[ci] = e.target.value;
                          updateQuestion(q.id, { choices });
                        }}
                        placeholder={`Choice ${CHOICE_LABELS[ci]}`}
                        className="w-full bg-transparent text-sm outline-none"
                      />
                    </label>
                  ))}
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Tick the circle beside the correct answer.
                </p>
              </article>
            ))}
          </div>

          <button
            type="button"
            onClick={() => update({ questions: [...game.questions, emptyQuestion()] })}
            className="tactile btn-paper mt-5 w-full rounded-2xl py-4 font-display font-bold"
          >
            + Add question
          </button>
        </>
      )}

      <div className="sticky bottom-4 mt-8 flex flex-wrap items-center gap-3 rounded-full surface-glass p-3">
        <button type="button" onClick={persist} className="tactile btn-paper rounded-full px-6 py-3 font-bold">
          Save Game
        </button>
        <button
          type="button"
          disabled={!ready}
          onClick={() => {
            const clean = persist();
            navigate({ to: "/play/$gameId", params: { gameId: clean.id } });
          }}
          className="tactile btn-ink rounded-full px-6 py-3 font-bold"
        >
          Save &amp; Start Game
        </button>
        <span className="px-2 text-sm text-muted-foreground">
          {saved ? "Saved." : ready ? "" : "Fill in every question and all four choices to start."}
        </span>
      </div>
    </Shell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">
        {label}
      </span>
      <div className="mt-2">{children}</div>
    </label>
  );
}

function IconButton({
  label,
  children,
  onClick,
  disabled,
}: {
  label: string;
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className="tactile btn-paper flex size-9 items-center justify-center rounded-xl text-sm font-bold"
    >
      {children}
    </button>
  );
}
