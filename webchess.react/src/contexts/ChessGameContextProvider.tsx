import { useState, ReactNode, useRef } from "react";
import { Chess, Square, Move } from "chess.js";
import { ChessGameContext } from "./ChessGameContext";
import { HubConnection } from "@microsoft/signalr";
import { endGame, initSignalRConnection } from "../api/client/game-client";

// Utility function to parse FEN to 2D array

const initialFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

export function ChessGameContextProvider({ children }: { children: ReactNode }) {
  const chessRef = useRef(new Chess(initialFen));
  const connectionRef= useRef<HubConnection | null>(null);
  const [fen, setFen] = useState(initialFen);
  const [selected, setSelected] = useState<Square | null>(null);
    const [legalMoves, setLegalMoves] = useState<Square[]>([]);
    const [gameId, setGameId] = useState<string | null>(null);
    const [playerColor, setPlayerColor] = useState<"w" | "b" | null>(null);
    const [takenPieces, setTakenPieces] = useState<string[]>([]);

  const turn = chessRef.current.turn() as "w" | "b";
    const board = chessRef.current.board();


    const selectSquare = (square: Square) => {
        console.log(square)
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
    const handleEndGame = () => {
    }
  const handleMoveReceived = (from: string, to: string, newFen: string) => {
    const move = chessRef.current.move({ from, to });
    if (move && move.captured) {
      setTakenPieces(prev => [
          ...prev,
          move.color === "w" ? (move.captured as string).toLowerCase() : (move.captured as string).toUpperCase()
      ]);
    }
    chessRef.current.load(newFen);
    setFen(newFen);
    setSelected(null);
    setLegalMoves([]);
  };

  const makeMove = (from: Square, to: Square) => {
    const move = chessRef.current.move({ from, to });
    if (move && move.captured) {
        setTakenPieces(prev => [
            ...prev,
            move.color === "w" ? (move.captured as string).toLowerCase() : (move.captured as string).toUpperCase()]);
    }
    setFen(chessRef.current.fen());
      if (chessRef.current.isGameOver()) {
          connectionRef.current?.invoke("EndGame", gameId)

      }
      setSelected(null);
    setLegalMoves([]);
    connectionRef.current?.invoke("MakeMove", gameId, from, to)
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
      setGameId(id);
      conn.on("MoveReceived", handleMoveReceived); // TODO put this in a function as this is duplicated in joinGame
      conn.on("GameOver", () => endGame(id));

    await conn.start();
    await conn.invoke("JoinGameGroup", id);
      connectionRef.current = conn;
      
  };

  const joinGame = async (id: string) => {
    const conn = initSignalRConnection();
      conn.on("MoveReceived", handleMoveReceived);
      conn.on("GameOver", () => endGame(id));
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
    <ChessGameContext.Provider // TODO review what to pass
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
        playerColor,
        setPlayerColor,
        takenPieces,
        chessRef
      }}
    >
      {children}
    </ChessGameContext.Provider>
  );
};
