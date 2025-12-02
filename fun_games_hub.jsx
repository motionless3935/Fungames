import React, { useState, useEffect } from "react";

// FunGamesHub.jsx
// Single-file React app with two small dynamic games: Tic-Tac-Toe and Memory Match.
// Tailwind CSS assumed available in the host environment.

export default function FunGamesHub() {
  const [view, setView] = useState("menu");
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-white dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">Fun Games Hub 🎮</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
              className="px-3 py-1 rounded-lg border bg-white/60 dark:bg-slate-700/60 border-slate-200 dark:border-slate-700"
            >
              {theme === "light" ? "Dark" : "Light"}
            </button>
            <a
              href="#play"
              onClick={(e) => { e.preventDefault(); setView("menu"); }}
              className="text-sm text-slate-500 hover:underline"
            >
              Home
            </a>
          </div>
        </header>

        <main className="bg-white/80 dark:bg-slate-900/60 rounded-2xl p-6 shadow-lg">
          {view === "menu" && (
            <Menu onChoose={(game) => setView(game)} />
          )}

          {view === "tictactoe" && (
            <div>
              <Back title="Tic‑Tac‑Toe" onBack={() => setView("menu")} />
              <TicTacToe />
            </div>
          )}

          {view === "memory" && (
            <div>
              <Back title="Memory Match" onBack={() => setView("menu")} />
              <MemoryGame />
            </div>
          )}

          {view === "surprise" && (
            <div>
              <Back title="Surprise Spinner" onBack={() => setView("menu")} />
              <SurpriseSpinner onChoose={(g) => setView(g)} />
            </div>
          )}
        </main>

        <footer className="text-center text-sm text-slate-500 mt-4">Made with ❤️ — click any game to play instantly.</footer>
      </div>
    </div>
  );
}

function Back({ title, onBack }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">{title}</h2>
      <button onClick={onBack} className="px-3 py-1 rounded-lg border bg-white/60 dark:bg-slate-700/60 border-slate-200 dark:border-slate-700">Back</button>
    </div>
  );
}

function Menu({ onChoose }) {
  return (
    <div className="grid md:grid-cols-3 gap-4">
      <Card title="Tic‑Tac‑Toe" desc="Classic 3×3. Play vs Human or quick CPU." onClick={() => onChoose("tictactoe")} />
      <Card title="Memory Match" desc="Flip cards and find pairs. Test your memory!" onClick={() => onChoose("memory")} />
      <Card title="Surprise Spinner" desc="Spin to pick a game for you." onClick={() => onChoose("surprise")} />
    </div>
  );
}

function Card({ title, desc, onClick }) {
  return (
    <button onClick={onClick} className="p-4 rounded-xl border hover:scale-[1.02] transition shadow-sm bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-left">
      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-300 mt-2">{desc}</p>
    </button>
  );
}

// -------------------------
// TicTacToe Component
// -------------------------
function TicTacToe() {
  const emptyBoard = Array(9).fill(null);
  const [board, setBoard] = useState(emptyBoard);
  const [xIsNext, setXIsNext] = useState(true);
  const [status, setStatus] = useState("Your move");
  const [mode, setMode] = useState("human"); // or 'cpu'

  useEffect(() => {
    const winner = calculateWinner(board);
    if (winner) setStatus(winner === "draw" ? "Draw!" : `Winner: ${winner}`);
    else setStatus(`${xIsNext ? "X" : "O"}'s turn`);

    if (mode === "cpu") {
      const turn = xIsNext ? "X" : "O";
      // simple CPU: if it's O's turn, make a random move after short delay
      if (turn === "O" && !winner) {
        const timeout = setTimeout(() => {
          const moves = board.map((v, i) => v === null ? i : null).filter((v) => v !== null);
          if (moves.length === 0) return;
          const choice = moves[Math.floor(Math.random() * moves.length)];
          makeMove(choice);
        }, 420);
        return () => clearTimeout(timeout);
      }
    }
  }, [board, xIsNext, mode]);

  function makeMove(i) {
    if (board[i] || calculateWinner(board)) return;
    setBoard((b) => {
      const nb = b.slice();
      nb[i] = xIsNext ? "X" : "O";
      return nb;
    });
    setXIsNext((s) => !s);
  }

  function handleClick(i) {
    if (mode === "cpu" && !xIsNext) return; // human is always X in cpu mode
    makeMove(i);
  }

  function reset() {
    setBoard(emptyBoard);
    setXIsNext(true);
    setStatus("Your move");
  }

  return (
    <div className="py-4">
      <div className="flex items-center gap-3 mb-4">
        <label className="text-sm">Mode:</label>
        <select value={mode} onChange={(e) => setMode(e.target.value)} className="px-2 py-1 rounded border">
          <option value="human">Human vs Human</option>
          <option value="cpu">Human (X) vs CPU (O)</option>
        </select>
        <button onClick={reset} className="ml-auto px-3 py-1 rounded border">Reset</button>
      </div>

      <div className="grid grid-cols-3 gap-2 w-[min(320px,100%)] mx-auto">
        {board.map((v, i) => (
          <button
            key={i}
            onClick={() => handleClick(i)}
            className={`h-20 flex items-center justify-center text-2xl font-bold rounded-lg border ${v ? "bg-slate-200 dark:bg-slate-700" : "bg-white/60 dark:bg-slate-800/40"}`}
          >
            {v}
          </button>
        ))}
      </div>

      <p className="mt-4 text-center text-slate-600 dark:text-slate-300">{status}</p>
    </div>
  );
}

function calculateWinner(b) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b2, c] = lines[i];
    if (b[a] && b[a] === b[b2] && b[a] === b[c]) {
      return b[a];
    }
  }
  if (b.every((x) => x !== null)) return "draw";
  return null;
}

// -------------------------
// Memory Match Component
// -------------------------
function MemoryGame() {
  const icons = [
    "🍎",
    "🍌",
    "🍇",
    "🍓",
    "🍍",
    "🥝",
  ];
  const deckTemplate = [...icons, ...icons];
  const [deck, setDeck] = useState(shuffle(deckTemplate).map((val, idx) => ({ id: idx, val, flipped: false, matched: false })));
  const [first, setFirst] = useState(null);
  const [second, setSecond] = useState(null);
  const [moves, setMoves] = useState(0);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    if (first && second) {
      setDisabled(true);
      if (first.val === second.val) {
        setDeck((d) => d.map((c) => (c.val === first.val ? { ...c, matched: true } : c)));
        resetTurn();
      } else {
        setTimeout(() => {
          setDeck((d) => d.map((c) => (c.id === first.id || c.id === second.id ? { ...c, flipped: false } : c)));
          resetTurn();
        }, 700);
      }
    }
  }, [second]);

  useEffect(() => {
    if (deck.every((c) => c.matched)) {
      // all matched
    }
  }, [deck]);

  function flipCard(card) {
    if (disabled || card.flipped || card.matched) return;
    setDeck((d) => d.map((c) => (c.id === card.id ? { ...c, flipped: true } : c)));
    if (!first) setFirst(card);
    else if (!second) {
      setSecond(card);
      setMoves((m) => m + 1);
    }
  }

  function resetTurn() {
    setFirst(null);
    setSecond(null);
    setDisabled(false);
  }

  function restart() {
    setDeck(shuffle(deckTemplate).map((val, idx) => ({ id: idx, val, flipped: false, matched: false })));
    setFirst(null);
    setSecond(null);
    setMoves(0);
    setDisabled(false);
  }

  return (
    <div className="py-4">
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-slate-600 dark:text-slate-300">Moves: {moves}</div>
        <button onClick={restart} className="px-3 py-1 rounded border">Restart</button>
      </div>

      <div className="grid grid-cols-4 gap-3 w-[min(480px,100%)] mx-auto">
        {deck.map((card) => (
          <button key={card.id} onClick={() => flipCard(card)} className={`aspect-[3/4] rounded-lg text-2xl flex items-center justify-center text-center border ${card.flipped || card.matched ? "bg-white dark:bg-slate-700" : "bg-slate-200 dark:bg-slate-800/40"}`}>
            {card.flipped || card.matched ? card.val : "❓"}
          </button>
        ))}
      </div>

      {deck.every((c) => c.matched) && (
        <div className="mt-4 text-center text-green-600 dark:text-green-300">You matched everything in {moves} moves! 🎉</div>
      )}
    </div>
  );
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// -------------------------
// Surprise Spinner
// -------------------------
function SurpriseSpinner({ onChoose }) {
  const games = [
    { id: "tictactoe", name: "Tic‑Tac‑Toe" },
    { id: "memory", name: "Memory Match" },
  ];
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);

  function spin() {
    setSpinning(true);
    setResult(null);
    setTimeout(() => {
      const pick = games[Math.floor(Math.random() * games.length)];
      setResult(pick);
      setSpinning(false);
      setTimeout(() => onChoose(pick.id), 700);
    }, 1200 + Math.random() * 800);
  }

  return (
    <div className="py-4 text-center">
      <div className={`mx-auto w-48 h-48 rounded-full flex items-center justify-center text-center text-xl font-bold ${spinning ? "animate-spin-slow" : ""} bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-700/30`}>🎲</div>
      <p className="mt-4">Click spin to choose a game at random.</p>
      <div className="mt-4 flex items-center justify-center gap-3">
        <button onClick={spin} className="px-4 py-2 rounded-lg border">Spin</button>
        {result && <div className="text-sm">Going to <strong>{result.name}</strong>…</div>}
      </div>
    </div>
  );
}

// small utility animation class
// Add this to global CSS when available:
// .animate-spin-slow { animation: spin 1.2s cubic-bezier(.2,.9,.4,.9) infinite; }
