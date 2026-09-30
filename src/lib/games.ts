export type Question = {
  id: string;
  text: string;
  choices: [string, string, string, string];
  correctIndex: number;
};

export type Game = {
  id: string;
  title: string;
  description: string;
  instructions: string;
  questions: Question[];
  createdAt: number;
};

const STORAGE_KEY = "sumo-quiz.games.v1";

export function newId() {
  return Math.random().toString(36).slice(2, 10);
}

export function emptyQuestion(): Question {
  return { id: newId(), text: "", choices: ["", "", "", ""], correctIndex: 0 };
}

export function emptyGame(): Game {
  return {
    id: newId(),
    title: "",
    description: "",
    instructions: "",
    questions: [emptyQuestion()],
    createdAt: Date.now(),
  };
}

export const sampleGame: Game = {
  id: "sample-grade-5",
  title: "Grade 5 Warm-Up Match",
  description: "Quick math and Philippine geography round for classroom battles.",
  instructions: "Player 1 answers on the left, Player 2 on the right. Fastest correct answers push hardest!",
  createdAt: 0,
  questions: [
    { id: "q1", text: "What is 5 × 5?", choices: ["10", "15", "25", "30"], correctIndex: 2 },
    {
      id: "q2",
      text: "What is the capital of the Philippines?",
      choices: ["Cebu", "Manila", "Davao", "Baguio"],
      correctIndex: 1,
    },
    { id: "q3", text: "What is 10 ÷ 2?", choices: ["2", "5", "8", "10"], correctIndex: 1 },
    {
      id: "q4",
      text: "Which number is a prime number?",
      choices: ["9", "15", "21", "17"],
      correctIndex: 3,
    },
    {
      id: "q5",
      text: "How many sides does a hexagon have?",
      choices: ["5", "6", "7", "8"],
      correctIndex: 1,
    },
    { id: "q6", text: "What is 12 × 3?", choices: ["24", "32", "36", "42"], correctIndex: 2 },
    {
      id: "q7",
      text: "Which is the longest river in the Philippines?",
      choices: ["Pasig River", "Cagayan River", "Agno River", "Agusan River"],
      correctIndex: 1,
    },
    { id: "q8", text: "What is 144 ÷ 12?", choices: ["11", "12", "14", "16"], correctIndex: 1 },
    {
      id: "q9",
      text: "What is 25% of 80?",
      choices: ["15", "20", "25", "40"],
      correctIndex: 1,
    },
    {
      id: "q10",
      text: "Which planet is closest to the Sun?",
      choices: ["Venus", "Earth", "Mercury", "Mars"],
      correctIndex: 2,
    },
  ],
};

export function loadGames(): Game[] {
  if (typeof window === "undefined") return [sampleGame];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [sampleGame];
    const parsed = JSON.parse(raw) as Game[];
    if (!Array.isArray(parsed)) return [sampleGame];
    const hasSample = parsed.some((g) => g.id === sampleGame.id);
    return hasSample ? parsed : [...parsed, sampleGame];
  } catch {
    return [sampleGame];
  }
}

function persist(games: Game[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(games));
}

export function saveGame(game: Game) {
  const games = loadGames();
  const index = games.findIndex((g) => g.id === game.id);
  if (index >= 0) games[index] = game;
  else games.unshift(game);
  persist(games);
}

export function deleteGame(id: string) {
  persist(loadGames().filter((g) => g.id !== id));
}

export function getGame(id: string): Game | undefined {
  return loadGames().find((g) => g.id === id);
}

export function isPlayable(game: Game) {
  return game.questions.some((q) => q.text.trim() && q.choices.every((c) => c.trim()));
}

export const CHOICE_LABELS = ["A", "B", "C", "D"] as const;
