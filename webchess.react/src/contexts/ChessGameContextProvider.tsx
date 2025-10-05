import { useState, ReactNode, useRef } from "react";
import { Chess, Square, Move } from "chess.js";
import { ChessGameContext } from "./ChessGameContext";

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
  const [fen, setFen] = useState(initialFen);
  const [selected, setSelected] = useState<Square | null>(null);
  const [legalMoves, setLegalMoves] = useState<Square[]>([]);

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

  const makeMove = (from: Square, to: Square) => {
    const move = chessRef.current.move({ from, to });
    if (move) {
      setFen(chessRef.current.fen());
      setSelected(null);
      setLegalMoves([]);
    } else {
      // Invalid move, just clear selection
      setSelected(null);
      setLegalMoves([]);
    }
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
      }}
    >
      {children}
    </ChessGameContext.Provider>
  );
};
