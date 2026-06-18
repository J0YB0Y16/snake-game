import { useEffect, useState } from "react";
import "./App.css";

const GRID_SIZE = 20;

const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 9, y: 10 },
];

function randomFood(snake) {
  while (true) {
    const food = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };

    if (!snake.some((s) => s.x === food.x && s.y === food.y)) {
      return food;
    }
  }
}

export default function App() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState(randomFood(INITIAL_SNAKE));
  const [direction, setDirection] = useState("RIGHT");
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const [isMobile, setIsMobile] = useState(
    window.innerWidth <= 768
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);

    return () =>
      window.removeEventListener("resize", handleResize);
  }, []);

  const changeDirection = (newDirection) => {
    if (
      newDirection === "UP" &&
      direction !== "DOWN"
    ) {
      setDirection("UP");
    }

    if (
      newDirection === "DOWN" &&
      direction !== "UP"
    ) {
      setDirection("DOWN");
    }

    if (
      newDirection === "LEFT" &&
      direction !== "RIGHT"
    ) {
      setDirection("LEFT");
    }

    if (
      newDirection === "RIGHT" &&
      direction !== "LEFT"
    ) {
      setDirection("RIGHT");
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case "ArrowUp":
          changeDirection("UP");
          break;

        case "ArrowDown":
          changeDirection("DOWN");
          break;

        case "ArrowLeft":
          changeDirection("LEFT");
          break;

        case "ArrowRight":
          changeDirection("RIGHT");
          break;

        default:
          break;
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () =>
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
  }, [direction]);

  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      setSnake((prevSnake) => {
        const head = { ...prevSnake[0] };

        switch (direction) {
          case "UP":
            head.y -= 1;
            break;

          case "DOWN":
            head.y += 1;
            break;

          case "LEFT":
            head.x -= 1;
            break;

          case "RIGHT":
            head.x += 1;
            break;

          default:
            break;
        }

        // Wall collision
        if (
          head.x < 0 ||
          head.x >= GRID_SIZE ||
          head.y < 0 ||
          head.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        // Self collision
        if (
          prevSnake.some(
            (segment) =>
              segment.x === head.x &&
              segment.y === head.y
          )
        ) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [head, ...prevSnake];

        // Food collision
        if (
          head.x === food.x &&
          head.y === food.y
        ) {
          setFood(randomFood(newSnake));
          setScore((prev) => prev + 1);
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [direction, food, gameOver]);

  const restartGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood(randomFood(INITIAL_SNAKE));
    setDirection("RIGHT");
    setGameOver(false);
    setScore(0);
  };

  return (
    <div className="container">
      <h1>🐍 Snake Game</h1>

      <h2>Score: {score}</h2>

      <div className="board">
        {Array.from({
          length: GRID_SIZE * GRID_SIZE,
        }).map((_, index) => {
          const x = index % GRID_SIZE;
          const y = Math.floor(
            index / GRID_SIZE
          );

          const isSnake = snake.some(
            (s) => s.x === x && s.y === y
          );

          const isHead =
            snake[0].x === x &&
            snake[0].y === y;

          const isFood =
            food.x === x && food.y === y;

          return (
            <div
              key={index}
              className={`cell
                ${isSnake ? "snake" : ""}
                ${isHead ? "head" : ""}
                ${isFood ? "food" : ""}
              `}
            />
          );
        })}
      </div>

      {isMobile && (
        <div className="mobile-controls">
          <button
            onTouchStart={() =>
              changeDirection("UP")
            }
            onClick={() =>
              changeDirection("UP")
            }
          >
            ⬆️
          </button>

          <div className="middle-row">
            <button
              onTouchStart={() =>
                changeDirection("LEFT")
              }
              onClick={() =>
                changeDirection("LEFT")
              }
            >
              ⬅️
            </button>

            <button
              onTouchStart={() =>
                changeDirection("RIGHT")
              }
              onClick={() =>
                changeDirection("RIGHT")
              }
            >
              ➡️
            </button>
          </div>

          <button
            onTouchStart={() =>
              changeDirection("DOWN")
            }
            onClick={() =>
              changeDirection("DOWN")
            }
          >
            ⬇️
          </button>
        </div>
      )}

      {gameOver && (
        <div className="game-over">
          <h2>💀 Game Over</h2>

          <button
            className="restart-btn"
            onClick={restartGame}
          >
            Restart
          </button>
        </div>
      )}
    </div>
  );
}
