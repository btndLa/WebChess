import { createContext, useContext } from "react";
import type { Square } from "chess.js";
import { HubConnection } from "@microsoft/signalr";
import { GameResponseDto } from "../api/models/GameResponseDto";


export interface ChessGameContextType {
    board: ({ square: string; type: string; color: "w" | "b" } | null)[][];
  fen: string;
  turn: "w" | "b";
  selected: Square | null;
  legalMoves: Square[];
  selectSquare: (square: Square) => void;
    deselectSquare: () => void; //TODO maybe error
  makeMove: (from: Square, to: Square, promotion?: string) => void;
  resetGame: () => void;
  gameId: string | null;
  setGameId: (id: string | null) => void;
    loadGame: (gameData: GameResponseDto) => Promise<void>;
  joinGame: (id: string) => void;
  connectionRef: React.RefObject<HubConnection | null>;
  playerColor: "w" | "b" | null;
  setPlayerColor: (color: "w" | "b" | null) => void;
    takenPieces: string[];
    chessRef: React.RefObject<Chess | null>;
    promotionMove: { from: Square; to: Square } | null;
    moveHistory: string[];
    resign: () => void;
    isActiveGame: boolean;
    setIsActiveGame: (isActive: boolean) => void;
}

export const ChessGameContext = createContext<ChessGameContextType | undefined>(undefined);

export function useChessGameContext() {
  const ctx = useContext(ChessGameContext);
  if (!ctx) throw new Error("useChessGameContext must be used within ChessGameContextProvider");
  return ctx;
}
