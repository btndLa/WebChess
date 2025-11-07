import React from "react";
import { useChessGameContext } from "../contexts/ChessGameContext";
import { Square } from "chess.js";
import { PIECE_IMAGES } from "@/utils/pieces";
import { PromotionDialog } from "./PromotionDialog";
import { Box, Typography } from "@mui/material";

const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
const ranks = ["1", "2", "3", "4", "5", "6", "7", "8"];

const ChessBoard: React.FC = () => {
  const {
    board,
    turn,
    selected,
    legalMoves,
    selectSquare,
    deselectSquare,
    makeMove,
    playerColor
  } = useChessGameContext();

  function getPieceImage(cell: any): JSX.Element | null {
    if (!cell) return null;
    
    let key: string;
    if (typeof cell === "object" && cell.type && cell.color) {
      key = cell.color === "w" ? cell.type.toUpperCase() : cell.type.toLowerCase();
    } else {
      key = cell;
    }

    const imageSrc = PIECE_IMAGES[key];
    if (!imageSrc) return null;

    const pieceNames: Record<string, string> = {
      'K': 'White King', 'Q': 'White Queen', 'R': 'White Rook',
      'B': 'White Bishop', 'N': 'White Knight', 'P': 'White Pawn',
      'k': 'Black King', 'q': 'Black Queen', 'r': 'Black Rook',
      'b': 'Black Bishop', 'n': 'Black Knight', 'p': 'Black Pawn',
    };

    return (
      <img 
        src={imageSrc} 
        alt={pieceNames[key] || 'Chess piece'}
        style={{ 
          width: '80%', 
          height: '80%',
          pointerEvents: 'none',
          userSelect: 'none',
          filter: 'drop-shadow(0 2px 1px rgba(0, 0, 0, 0.4))',
          position: 'relative',
          top: '4px'
        }}
        draggable={false}
      />
    );
  }

  const displayBoard = playerColor === "b" ? board.slice().reverse().map(row => row.slice().reverse()) : board;
  const fileLabels = playerColor === "b" ? [...files].reverse() : files;
  const rankLabels = playerColor === "b" ? [...ranks] : [...ranks].reverse();

  const labelStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'text.secondary',
    fontSize: '0.8rem',
    fontWeight: 'bold'
  };

  return (
    <>
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: '20px 1fr',
        gridTemplateRows: '1fr 20px',
        gap: '4px',
        width: 'fit-content',
        margin: 'auto'
      }}>
        <Box sx={{ gridRow: '1 / 2', display: 'flex', flexDirection: 'column', justifyContent: 'space-around' }}>
          {rankLabels.map(rank => <Typography key={rank} sx={labelStyle}>{rank}</Typography>)}
        </Box>

        <table style={{ borderCollapse: "collapse", gridColumn: '2 / 3', gridRow: '1 / 2' }}>
          <tbody>
            {displayBoard.map((row, rowIdx) => (
              <tr key={rowIdx}>
                {row.map((cell, colIdx) => {
                  const file = files[playerColor === "b" ? 7 - colIdx : colIdx];
                  const rank = playerColor === "b" ? rowIdx + 1 : 8 - rowIdx;
                  const square = `${file}${rank}` as Square;
                  const isSelected = selected === square;
                  const isLegal = legalMoves.includes(square);
                  const isDark = (rowIdx + colIdx) % 2 === 1;

                  return (
                    <td
                      key={colIdx} 
                      onClick={() => {
                        if (selected === square) {
                          deselectSquare();
                        } else if (selected && isLegal) {
                          makeMove(selected, square);
                        } else if (
                          cell &&
                          typeof cell === "object" &&
                          cell.color === turn && 
                          playerColor === turn
                        ) {
                          selectSquare(square);
                        }
                      }}
                      style={{
                        width: 64,
                        height: 64,
                        backgroundColor: isSelected
                          ? "#f6f669"
                          : isLegal
                          ? "#baca44"
                          : isDark
                          ? "#769656"
                          : "#eeeed2",
                        border: "1px solid #333",
                        textAlign: "center",
                        verticalAlign: "middle",
                        cursor: "pointer",
                        userSelect: "none",
                        position: "relative"
                      }}
                    >
                      {getPieceImage(cell)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>

        <Box sx={{ gridColumn: '2 / 3', gridRow: '2 / 3', display: 'flex', justifyContent: 'space-around' }}>
          {fileLabels.map(file => <Typography key={file} sx={labelStyle}>{file}</Typography>)}
        </Box>
      </Box>
      <PromotionDialog />
    </>
  );
};

export default ChessBoard;