import { useState, useEffect } from "react";
import NumberEnemy from "./NumberEnemy";
import PrimeGun from "./PrimeGun";

function GameBoard() {
  const [enemies, setEnemies] = useState([]);
  const [score, setScore] = useState(0);
  const [hearts, setHearts] = useState(5);
  const [gameOver, setGameOver] = useState(false);
  const [startTime] = useState(Date.now());
  const [endTime, setEndTime] = useState(null);

  const SPEED = 2.1; // movement speed
  const SPAWN_INTERVAL = 1200; // ms

  const isPrime = (num) => {
    for (let i = 2; i <= Math.sqrt(num); i++)
      if (num % i === 0) return false;
    return true;
  };

  const primeFactors = (num) => {
    let n = num;
    let factors = [];
    for (let i = 2; i <= n; i++) {
      while (n % i === 0) {
        factors.push(i);
        n /= i;
      }
    }
    return factors;
  };

  const shoot = (id, value, x, y) => {
    if (isPrime(value)) {
      setScore((prev) => prev + 1);
      setEnemies((prev) => prev.filter((e) => e.id !== id));
    } else {
      setScore((prev) => prev - 1);

      const factors = primeFactors(value);
      const offsets = [-40, -20, 0, 20, 40];

      setEnemies((prev) => [
        ...prev.filter((e) => e.id !== id),
        ...factors.map((f, i) => ({
          id: `${Date.now()}_${i}`,
          value: f,
          x: x + offsets[i % offsets.length],
          y: y + offsets[i % offsets.length],
        })),
      ]);
    }
  };

  const spawnEnemy = () => {
    const id = Date.now();
    const value = Math.floor(Math.random() * 95) + 2;

    setEnemies((prev) => [
      ...prev,
      {
        id,
        value,
        x: window.innerWidth - 100,
        y: Math.random() * (window.innerHeight - 150),
      },
    ]);
  };

  useEffect(() => {
    const spawnTimer = setInterval(spawnEnemy, SPAWN_INTERVAL);

    const moveTimer = setInterval(() => {
      setEnemies((prev) =>
        prev
          .map((enemy, index) => ({
            ...enemy,
            x: enemy.x - SPEED,
            y: enemy.y + Math.sin((enemy.x + index * 50) / 60) * 1.6,
          }))
          .filter((enemy) => {
            if (enemy.x <= 30) {
              if (isPrime(enemy.value)) {
                setHearts((prev) => {
                  const newHearts = prev - 1;
                  if (newHearts <= 0) {
                    setGameOver(true);
                    setEndTime(Date.now());
                  }
                  return newHearts;
                });
              }
              return false;
            }
            return true;
          })
      );
    }, 30);

    return () => {
      clearInterval(spawnTimer);
      clearInterval(moveTimer);
    };
  }, []);

  const survivalTime =
    endTime !== null
      ? ((endTime - startTime) / 1000).toFixed(1)
      : ((Date.now() - startTime) / 1000).toFixed(1);

  return (
    <div className="w-screen h-screen bg-black overflow-hidden relative">

      {/* Score */}
      <div className="absolute left-4 top-4 text-2xl font-bold">
        Score: <span className="text-purple-400">{score}</span>
      </div>

      {/* Hearts */}
      <div className="absolute left-4 top-14 text-2xl font-bold">
        ❤️ {hearts}
      </div>

      {/* Castle */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-5xl">
        🏰
      </div>

      {/* Enemies */}
      {enemies.map((enemy) => (
        <NumberEnemy key={enemy.id} {...enemy} shoot={shoot} />
      ))}

      {/* Gun Hint */}
      <PrimeGun />

      {/* Game Over */}
      {gameOver && (
        <div className="absolute inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center">
          <h2 className="text-4xl font-bold mb-4">Game Over</h2>
          <p className="text-2xl mb-2">Final Score: {score}</p>
          <p className="text-lg mb-6">
            Survival Time: {survivalTime} seconds
          </p>
          <button
            className="px-5 py-3 bg-purple-600 hover:bg-purple-500 rounded text-lg font-bold"
            onClick={() => window.location.reload()}
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}

export default GameBoard;
