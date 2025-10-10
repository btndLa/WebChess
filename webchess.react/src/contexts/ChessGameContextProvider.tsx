import { useState, ReactNode, useRef, useEffect } from "react";
import { Chess, Square, Move } from "chess.js";
import { ChessGameContext } from "./ChessGameContext";
import { HubConnection } from "@microsoft/signalr";
import { initSignalRConnection } from "../api/client/game-client";

// Utility function to parse FEN to 2D array
function parseFen(fen: string): (string | null)[][] {
  const rows = fen.split(" ")[0].split("/");
  return rows.map(row => {
    const result: (string | null)[] = [];
    for (const char of row) {
      if (/\d/.test(char)) {
        for (let i = 0; i < Number(char); i++) result.push(null);
      } else {
        result.push(char);
      }
    }
    return result;
  });
}

const initialFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

export function ChessGameContextProvider({ children }: { children: ReactNode }) {
  const chessRef = useRef(new Chess(initialFen));
  const connectionRef= useRef<HubConnection | null>(null);
  const [fen, setFen] = useState(initialFen);
  const [selected, setSelected] = useState<Square | null>(null);
    const [legalMoves, setLegalMoves] = useState<Square[]>([]);
    const [gameId, setGameId] = useState<string | null>(null);

  const turn = chessRef.current.turn() as "w" | "b";
  const board = parseFen(fen);

  const selectSquare = (square: Square) => {
    const piece = chessRef.current.get(square);
    if (
      piece &&
      ((turn === "w" && piece.color === "w") || (turn === "b" && piece.color === "b"))
    ) {
      setSelected(square);
      const moves = (chessRef.current.moves({ square, verbose: true }) as Move[]).map(m => m.to as Square);
      setLegalMoves(moves);
    } else if (selected) {
      makeMove(selected, square);
    } else {
      setSelected(null);
      setLegalMoves([]);
    }
  };

  // Handler function for moveReceived
  const handleMoveReceived = (from: string, to: string, newFen: string) => {
    chessRef.current.load(newFen);
    setFen(newFen);
    setSelected(null);
    setLegalMoves([]);
  };

  const makeMove = (from: Square, to: Square) => {
    const move = chessRef.current.move({ from, to });
    if (move) {
      setFen(chessRef.current.fen());
      setSelected(null);
      setLegalMoves([]);
      connectionRef.current?.invoke("MakeMove", gameId, from, to)
        .catch(err => console.error("MakeMove error", err));
    } else {
      setSelected(null);
      setLegalMoves([]);
    }
  };
  const startGame = async (
    onClose: () => void,
    setWaiting: (waiting: boolean) => void,
    setOpponentJoined: (joined: boolean) => void,
    navigate: (url: string) => void,
    id: string
  ) => {
    const conn = initSignalRConnection();
    conn.on("PlayerJoined", () => {
      setOpponentJoined(true);
      setWaiting(false);
      onClose();
      navigate(`/game/${id}`);
    });
    conn.on("moveReceived", handleMoveReceived);
    conn.on("gameOver", () => console.log("game over"));
    await conn.start();
    await conn.invoke("JoinGameGroup", id);
    connectionRef.current = conn;
    setGameId(id);
  };

  const joinGame = async (id: string) => {
    const conn = initSignalRConnection();
    conn.on("moveReceived", handleMoveReceived);
    conn.on("gameOver", () => console.log("mr"));
    await conn.start();
    await conn.invoke("JoinGameGroup", id);
    connectionRef.current = conn;
    setGameId(id);
  };

  const resetGame = () => {
    chessRef.current.reset();
    setFen(chessRef.current.fen());
    setSelected(null);
    setLegalMoves([]);
  };

  return (
    <ChessGameContext.Provider
      value={{
        board,
        fen,
        turn,
        selected,
        legalMoves,
        selectSquare,
        makeMove,
        resetGame,
        gameId,
        setGameId,
        startGame,
        joinGame,
        connectionRef,
      }}
    >
      {children}
    </ChessGameContext.Provider>
  );
};
