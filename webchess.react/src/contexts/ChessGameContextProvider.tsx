import { useState, ReactNode, useRef } from "react";
import { Chess, Square, Move } from "chess.js";
import { ChessGameContext } from "./ChessGameContext";
import { HubConnection } from "@microsoft/signalr";
import { endGame, initSignalRConnection } from "../api/client/game-client";
import { useUserContext } from "./UserContext";
import { GameResponseDto } from "../api/models/GameResponseDto";

// Utility function to parse FEN to 2D array

//TODO transfer to always update and receive from backend

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
    const [moveHistory, setMoveHistory] = useState<string[]>([]);
    const [promotionMove, setPromotionMove] = useState<{ from: Square; to: Square } | null>(null);


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
    const handleMoveReceived = (from: string, to: string, promotion: string, newFen: string) => {
        const move = chessRef.current.move({ from, to, promotion });
    if (move && move.captured) {
      setTakenPieces(prev => [
          ...prev,
          move.color === "w" ? (move.captured as string).toLowerCase() : (move.captured as string).toUpperCase()
      ]);
    }
    chessRef.current.load(newFen);
        setFen(newFen);
    setMoveHistory(prev => [...prev, move.san]);
    setSelected(null);
    setLegalMoves([]);
  };

    const makeMove = (from: Square, to: Square, promotion?: string) => {
        const piece = chessRef.current.get(from);
        const isPromotion = (piece?.type === 'p') && ((piece.color === 'w' && to[1] === '8') || (piece.color === 'b' && to[1] === '1'));

        if (isPromotion && !promotion) {
            setPromotionMove({ from, to });
            return;
        }
        const move = chessRef.current.move({ from, to, promotion });
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
        connectionRef.current?.invoke("MakeMove", gameId, from, to, move.san, promotion)// TODO not perfect san
        setMoveHistory(prev => [...prev, move.san]);
        setPromotionMove(null);
    };


    const loadGame = async (gameData: GameResponseDto) => {
        setGameId(gameData.id);
        setPlayerColor(gameData.playerColor);
      chessRef.current.load(gameData.fen);
      setFen(gameData.fen);
      //setTakenPieces(gameData.takenPieces); should add
  };

  const joinGame = async (id: string) => {
    const conn = initSignalRConnection();
      conn.on("MoveReceived", handleMoveReceived);
      conn.on("GameOver", () => endGame(id));
    await conn.start();
    await conn.invoke("JoinGameGroup", id);
      connectionRef.current = conn;
    //TODO loadGame
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
        loadGame,
        joinGame,
        connectionRef,
        playerColor,
        setPlayerColor,
        takenPieces,
        chessRef,
              promotionMove,
        moveHistory
      }}
    >
      {children}
    </ChessGameContext.Provider>
  );
};
