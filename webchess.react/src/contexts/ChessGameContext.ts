import { createContext, useContext } from "react";
import type { Square } from "chess.js";

export interface ChessGameContextType {
  board: (string | null)[][];
  fen: string;
  turn: "w" | "b";
  selected: Square | null;
  legalMoves: Square[];
  selectSquare: (square: Square) => void;
  makeMove: (from: Square, to: Square) => void;
  resetGame: () => void;
}

export const ChessGameContext = createContext<ChessGameContextType | undefined>(undefined);

export function useChessGameContext() {
  const ctx = useContext(ChessGameContext);
  if (!ctx) throw new Error("useChessGameContext must be used within ChessGameContextProvider");
  return ctx;
}
