import React, { useState, useEffect } from "react";

// Spigot algorithm to generate digits of π progressively
function generatePiDigits(count) {
  const digits = [];
  const len = Math.floor((10 * count) / 3) + 1;
  const a = new Array(len).fill(2);

  let nines = 0;
  let predigit = 0;

  for (let j = 0; j < count; j++) {
    let q = 0;

    for (let i = len; i > 0; i--) {
      const x = 10 * a[i - 1] + q * i;
      a[i - 1] = x % (2 * i - 1);
      q = Math.floor(x / (2 * i - 1));
    }

    a[0] = q % 10;
    q = Math.floor(q / 10);

    if (q === 9) {
      nines++;
    } else if (q === 10) {
      digits.push(predigit + 1);
      for (let k = 0; k < nines; k++) digits.push(0);
      predigit = 0;
      nines = 0;
    } else {
      digits.push(predigit);
      predigit = q;
      if (nines !== 0) {
        for (let k = 0; k < nines; k++) digits.push(9);
        nines = 0;
      }
    }
  }

  digits.push(predigit);
  return digits.join("");
}

export default function PiGame() {
  const [digits, setDigits] = useState(() => generatePiDigits(1000));
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [record, setRecord] = useState(0);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const r = localStorage.getItem("pi_record");
    if (r) setRecord(Number(r));
  }, []);

  function ensureDigits(index) {
    if (index >= digits.length - 5) {
      const more = generatePiDigits(digits.length + 1000);
      setDigits(more);
    }
  }

  function press(val) {
    if (message) return;

    const nextIndex = input.length;
    ensureDigits(nextIndex);

    const correct = nextIndex === 1 ? "." : digits[nextIndex];

    if (val === correct) {
      const newInput = input + val;
      setInput(newInput);
      const newScore = score + 1;
      setScore(newScore);

      if (newScore > record) {
        setRecord(newScore);
        localStorage.setItem("pi_record", newScore);
      }
    } else {
      setMessage(`Wrong! Correct digit was '${correct}'. Restarting...`);
      setTimeout(() => {
        setInput("");
        setScore(0);
        setMessage("");
      }, 2000);
    }
  }

  const buttons = ["0","1","2","3","4","5","6","7","8","9","."];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-gray-100 p-6">
      <h1 className="text-3xl font-bold">π Memory Game</h1>

      <div className="text-lg">Score: {score}</div>
      <div className="text-lg">Record: {record}</div>

      <div className="bg-white rounded-2xl shadow p-4 w-80 text-center">
        <div className="text-sm text-gray-500 mb-2">Your input</div>
        <div className="font-mono text-lg break-all">{input || "Start with 3"}</div>
      </div>

      {message && (
        <div className="text-red-600 font-semibold">{message}</div>
      )}

      <div className="grid grid-cols-3 gap-3 w-64">
        {buttons.map((b) => (
          <button
            key={b}
            onClick={() => press(b)}
            className="bg-white shadow rounded-2xl p-4 text-xl hover:bg-gray-200 active:scale-95"
          >
            {b}
          </button>
        ))}
      </div>

      <div className="text-xs text-gray-500 text-center max-w-xs">
        Press the digits of π in order. Each correct decimal gives 1 point.
      </div>
    </div>
  );
}

