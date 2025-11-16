import { useState, ReactNode, useRef } from "react";
import { Chess, Square, Move } from "chess.js";
import { ChessGameContext } from "./ChessGameContext";
import { HubConnection } from "@microsoft/signalr";
import { createGame, endGame, initSignalRConnection } from "../api/client/game-client";
import { GameResponseDto } from "../api/models/GameResponseDto";
import { useNavigate } from "react-router-dom";


const initialFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

export function ChessGameContextProvider({ children }: { children: ReactNode }) {
    const chessRef = useRef(new Chess(initialFen));
    const connectionRef = useRef<HubConnection | null>(null);
    const [fen, setFen] = useState(initialFen);
    const [selected, setSelected] = useState<Square | null>(null);
    const [legalMoves, setLegalMoves] = useState<Square[]>([]);
    const [gameId, setGameId] = useState<string | null>(null);
    const [playerColor, setPlayerColor] = useState<"w" | "b" | null>(null);
    const [takenPieces, setTakenPieces] = useState<string[]>([]);
    const [moveHistory, setMoveHistory] = useState<string[]>([]);
    const [promotionMove, setPromotionMove] = useState<{ from: Square; to: Square } | null>(null);
    const [isActiveGame, setIsActiveGame] = useState<boolean>(false)
    const [gameResult, setGameResult] = useState<string | null>(null);

    const navigate = useNavigate();

    const turn = chessRef.current.turn() as "w" | "b";
    const board = chessRef.current.board();

    const deselectSquare = () => {
        setSelected(null);
        setLegalMoves([]);
    };

    const selectSquare = (square: Square) => {
        if (!isActiveGame) return;
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
    const handleMoveReceived = (from: string, to: string, promotion?: string, newFen?: string) => {
        const finalFen = newFen === undefined ? promotion : newFen;
        if (!finalFen) return;

        const move = chessRef.current.move({ from, to, promotion });
        chessRef.current.load(finalFen);
        setFen(finalFen);

        if (move && move.captured) {
            setTakenPieces(prev => [
                ...prev,
                move.color === "w" ? (move.captured as string).toLowerCase() : (move.captured as string).toUpperCase()
            ]);
        }
        if (move) {
            setMoveHistory(prev => [...prev, move.san]);
        }
        setSelected(null);
        setLegalMoves([]);
    };

    const makeMove = (from: Square, to: Square, promotion?: string) => {
        if (!isActiveGame) return;
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
            if (chessRef.current.isDraw()) {
                connectionRef.current?.invoke("EndGame", gameId, "draw")
            } else {
                connectionRef.current?.invoke("EndGame", gameId, playerColor)
            }
        }
        setSelected(null);
        setLegalMoves([]);
        connectionRef.current?.invoke("MakeMove", gameId, from, to, move.san, promotion)
        setMoveHistory(prev => [...prev, move.san]);
        setPromotionMove(null);
    };


    const loadGame = async (gameData: GameResponseDto) => {
        setGameId(gameData.id);
        setPlayerColor(gameData.playerColor);
        chessRef.current.load(gameData.fen);
        setFen(gameData.fen);
        setTakenPieces(gameData.takenPieces);
        setMoveHistory(gameData.moveHistory);
    };

    const joinGameSession = async (id: string) => {
        const conn = initSignalRConnection();
        conn.on("PlayerJoined", () => {
            console.log("Player reconnected");
        })
        conn.on("MoveReceived", handleMoveReceived);
        conn.on("GameOver", (winner) => {
            endGame(id, winner);
            setIsActiveGame(false);
            setGameResult(winner);
            setGameId(null);
        });
        await conn.start();
        await conn.invoke("JoinGameGroup", id);
        connectionRef.current = conn;
        setGameId(id);
        setIsActiveGame(true);
    };

    const createGameSession = async () => {
        const gameData = await createGame();
        await joinGameSession(gameData.id);
        loadGame(gameData);
        connectionRef.current?.on("PlayerJoined", () => {
            if (gameData.status === "waiting") {
                setIsActiveGame(true);
                navigate(`/game/${gameData.id}`);
            }
        });
    };

    const resetGame = () => {
        chessRef.current.reset();
        setFen(chessRef.current.fen());
        setSelected(null);
        setLegalMoves([]);
    };

    const resign = () => {
        connectionRef.current?.invoke("EndGame", gameId, playerColor === 'w' ? 'b' : 'w')
        setIsActiveGame(false);
    }

    return (
        <ChessGameContext.Provider
            value={{
                board,
                fen,
                turn,
                selected,
                legalMoves,
                selectSquare,
                deselectSquare,
                makeMove,
                resetGame,
                gameId,
                setGameId,
                loadGame,
                joinGameSession,
                createGameSession,
                connectionRef,
                playerColor,
                setPlayerColor,
                takenPieces,
                chessRef,
                promotionMove,
                moveHistory,
                resign,
                isActiveGame,
                setIsActiveGame,
                gameResult,
            }}
        >
            {children}
        </ChessGameContext.Provider>
    );
};
