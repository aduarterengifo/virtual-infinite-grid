import { createSignal, Show, type Component } from "solid-js";
import styles from "./tic-tac-toe.module.css";
import { Effect } from "effect";

type SpaceState = "E" | "X" | "O";
const initialGameState = Array<SpaceState>(9).fill("E");

const winningPositions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8], // Rows
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8], // Columns
  [0, 4, 8],
  [2, 4, 6], // Diagonals
];

const initialM = 3;
const initialN = 3;
const initialK = 3;
const mPercent = 100 / initialM;

const angleBetweenPoints = (x1: number, y1: number, x2: number, y2: number) =>
  Math.atan2(y2 - y1, x2 - x1);

const getCurrentMark = (gameCounter: number) =>
  gameCounter % 2 === 0 ? "O" : "X";



export const TicTacToe: Component = () => {
  const [m, setM] = createSignal(initialM);
  const [n, setN] = createSignal(initialN);
  const [k, setK] = createSignal(initialK);
  const [gameCounter, setGameCounter] = createSignal(0);
  const [gameState, setGameState] = createSignal(initialGameState);
  const [gameHistory, setGameHistory] = createSignal([initialGameState]);
  const [gameWinner, setGameWinner] = createSignal<SpaceState>("E");
  const [winningPosition, setWinningPosition] = createSignal<number[]>([]);
  const [xStart, setXStart] = createSignal<number>(0);
  const [yStart, setYStart] = createSignal<number>(0);
  const [xEnd, setXEnd] = createSignal<number>(0);
  const [yEnd, setYEnd] = createSignal<number>(0);
  const [winningAngle, setWinningAngle] = createSignal<number>(0);
  return (
    <div class={`${styles.App} ${styles.mainGrid}`}>
      <div class={styles.ui}>
        <div class="flex">
          <div>
            <div>m</div>
            <input
              type="number"
              min={1}
              value={m()}
              onChange={(e) => setM(Number(e.target.value))}
            />
          </div>
          <div>
            <div>n</div>
            <input
              type="number"
              min={1}
              value={n()}
              onChange={(e) => setN(Number(e.target.value))}
            />
          </div>
          <div>
            <div>k</div>
            <input
              type="number"
              min={1}
              value={k()}
              onChange={(e) => setK(Number(e.target.value))}
            />
          </div>
          <div>{gameCounter()}</div>
          <div>{gameState()}</div>
          <div>{gameHistory()}</div>
          <div>{gameWinner()}</div>
          <div>{winningPosition()}</div>
          <div>{winningAngle()}</div>
        </div>
        <div
          class={styles.grid}
          style={{
            "grid-template-columns": `repeat(${m()}, 1fr)`,
            "grid-template-rows": `repeat(${n()}, 1fr)`,
          }}
        >
          {[...Array(m() * n())].map((_, i) => (
            <div
              class={styles.gridSpace}
              onClick={() => {
                // valid move guard
                if (gameHistory()[gameCounter()][i] === "E") {
                  setGameHistory((gameHistory) => {
                    gameHistory[gameCounter() + 1] = [
                      ...gameHistory[gameCounter()],
                    ];
                    gameHistory[gameCounter() + 1][i] =
                      getCurrentMark(gameCounter());

                    return gameHistory;
                  });
                  setGameCounter((x) => x + 1);
                  setGameState(gameHistory()[gameCounter()]);
                  // check winner
                  for (let wP of winningPositions) {
                    const [x, y, z] = wP;
                    const subset = [
                      gameState()[x],
                      gameState()[y],
                      gameState()[z],
                    ];
                    console.log("sub", subset);
                    if (
                      subset[0] !== "E" &&
                      subset.every((x) => x === subset[0])
                    ) {
                      setGameWinner(subset[0]);
                      setWinningPosition(wP);
                      setXStart(x % m());
                      setYStart(Math.floor(x / m()));
                      setXEnd(z % m());
                      setYEnd(Math.floor(z / m()));
                      setWinningAngle(
                        angleBetweenPoints(xStart(), yStart(), xEnd(), yEnd()),
                      );
                    }
                  }
                }
              }}
            >
              <Show when={gameState()[i] !== "E"}>
                <div>{gameState()[i]}</div>
                {/* <div>+</div> */}
              </Show>
            </div>
          ))}
          <div
            class={styles.strikethrough}
            style={{
              left: `${xStart() * mPercent + mPercent / 2}%`,
              top: `${yStart() * mPercent + mPercent / 2}%`,
              visibility: `${gameWinner() !== "E" ? "visible" : "hidden"}`,
              rotate: `${winningAngle()}rad`,
            }}
          />
        </div>
      </div>
    </div>
  );
};


