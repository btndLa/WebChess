import React from "react";
import { useChessGameContext } from "../contexts/ChessGameContext";
import { Square } from "chess.js";
import { PIECE_UNICODE } from "@/utils/pieces";
import { PromotionDialog } from "./PromotionDialog";

const files = ["a", "b", "c", "d", "e", "f", "g", "h"];

const ChessBoard: React.FC = () => {
  const {
    board,
    turn,
    selected,
    legalMoves,
    selectSquare,
    makeMove,
    playerColor
  } = useChessGameContext();

  function getPieceSymbol(cell: any): string {
    if (!cell) return "";
    if (typeof cell === "object" && cell.type && cell.color) {
      const key = cell.color === "w" ? cell.type.toUpperCase() : cell.type.toLowerCase();
      return PIECE_UNICODE[key] || "";
    }
    return PIECE_UNICODE[cell] || "";
  }

  const displayBoard = playerColor === "b" ? board.slice().reverse().map(row => row.slice().reverse()) : board;

  return (
    <>
      <table style={{ borderCollapse: "collapse", margin: "auto" }}>
        <tbody>
          {displayBoard.map((row, rowIdx) => (
            <tr key={rowIdx}>
              {row.map((cell, colIdx) => {
                  const file = files[playerColor === "b" ? files.length - 1 - colIdx : colIdx];
                  const rank = playerColor === "b" ? rowIdx + 1 : 8 - rowIdx;
                  const square = `${file}${rank}` as Square;
                  const isSelected = selected === square;
                  const isLegal = legalMoves.includes(square);
                  const isDark = (rowIdx + colIdx) % 2 === 1;

                  return (
                    <td
                      key={colIdx}
                      onClick={() => {
                        if (selected && isLegal) {
                          // makeMove will now handle the promotion logic internally
                          makeMove(selected, square);
                        } else if (
                          cell &&
                          typeof cell === "object" &&
                          cell.color === turn && playerColor === turn
                        ) {
                          selectSquare(square);
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
                      {getPieceSymbol(cell)}
                    </td>
                  );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <PromotionDialog />
    </>
  );
};

export default ChessBoard;