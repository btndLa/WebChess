import React from "react";
import { useChessGameContext } from "../contexts/ChessGameContext";
import { Square } from "chess.js";

const PIECE_UNICODE: Record<string, string> = {
  K: "♔", Q: "♕", R: "♖", B: "♗", N: "♘", P: "♙",
  k: "♚", q: "♛", r: "♜", b: "♝", n: "♞", p: "♟",
};

const files = ["a", "b", "c", "d", "e", "f", "g", "h"];

const ChessBoard: React.FC = () => {
  const {
    board,
    turn,
    selected,
    legalMoves,
    selectSquare,
    makeMove,
  } = useChessGameContext();

  return (
    <table style={{ borderCollapse: "collapse", margin: "auto" }}>
      <tbody>
        {board.map((row, rowIdx) => (
          <tr key={rowIdx}>
            {row.map((cell, colIdx) => {
              const file = files[colIdx];
              const rank = 8 - rowIdx;
              const square = `${file}${rank}`;
              const isSelected = selected === square;
              const isLegal = legalMoves.includes(square as Square);
              const isDark = (rowIdx + colIdx) % 2 === 1;

              return (
                <td
                  key={colIdx}
                  onClick={() => {
                    if (selected && isLegal) {
                        makeMove(selected, square as Square);
                        console.log(`Move from ${selected} to ${square}`);
                    } else if (
                      cell &&
                      ((turn === "w" && cell === cell.toUpperCase()) ||
                        (turn === "b" && cell === cell.toLowerCase()))
                    ) {
                      selectSquare(square as Square);
                    }
                  }}
                  style={{
                    width: 48,
                    height: 48,
                    backgroundColor: isSelected
                      ? "#f6f669"
                      : isLegal
                      ? "#baca44"
                      : isDark
                      ? "#769656"
                      : "#eeeed2",
                    border: "1px solid #333",
                    textAlign: "center",
                    fontSize: 32,
                    cursor: "pointer",
                    userSelect: "none",
                  }}
                >
                  {cell ? PIECE_UNICODE[cell] : ""}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ChessBoard;