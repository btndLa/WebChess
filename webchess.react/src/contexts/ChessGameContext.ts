import { createContext, useContext } from "react";
import type { Square } from "chess.js";
import { HubConnection } from "@microsoft/signalr";


export interface ChessGameContextType {
    board: ({ square: string; type: string; color: "w" | "b" } | null)[][];
  fen: string;
  turn: "w" | "b";
  selected: Square | null;
  legalMoves: Square[];
  selectSquare: (square: Square) => void;
  makeMove: (from: Square, to: Square) => void;
  resetGame: () => void;
  gameId: string | null;
  setGameId: (id: string | null) => void;
  startGame: (
    onClose: () => void,
    setWaiting: (waiting: boolean) => void,
      setOpponentJoined: (joined: boolean) => void,
      navigate: (url: string) => void,
      gameId: string

    ) => Promise<void>;
    joinGame: (id: string) => void;
    connectionRef: React.RefObject<HubConnection | null>;
    playerColor: "w" | "b" | null;
    setPlayerColor: (color: "w" | "b" | null) => void;
}

export const ChessGameContext = createContext<ChessGameContextType | undefined>(undefined);

export function useChessGameContext() {
  const ctx = useContext(ChessGameContext);
  if (!ctx) throw new Error("useChessGameContext must be used within ChessGameContextProvider");
  return ctx;
}
