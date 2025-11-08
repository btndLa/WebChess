import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChessBoard } from "@/components/ChessBoard";
import { getGame } from "@/api/client/game-client";
import type { GameResponseDto } from "@/api/models/GameResponseDto";
import { useChessGameContext } from "@/contexts/ChessGameContext";
import { PIECE_IMAGES } from "@/utils/pieces";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import MoveHistoryTable from "../components/MoveHistoryTable";
import { Button, Typography, Chip } from "@mui/material";
import { ResignDialog } from "../components/ResignDialog";
import { GameOverDialog } from "../components/GameOverDialog";
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';
import ErrorIcon from '@mui/icons-material/Error';
import CircleIcon from '@mui/icons-material/Circle';

export function GamePage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [game, setGame] = useState<GameResponseDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [gameOverOpen, setGameOverOpen] = useState(false);
    const { joinGameSession, gameId, chessRef, takenPieces, playerColor, resign, loadGame, isActiveGame, gameResult } = useChessGameContext();
    const initializedRef = useRef(false);

  useEffect(() => {
    if (!id || initializedRef.current) return;
    initializedRef.current = true;
    setLoading(true);
    getGame(id)
      .then((fetchedGame) => {
        if (!fetchedGame) {
          navigate("/notfound");
          return;
        }
        
        if (!gameId) {
          loadGame(fetchedGame);
          if (fetchedGame.status === "active" || fetchedGame.status === "waiting") {
            joinGame(fetchedGame.id);
          }
        }
        setGame(fetchedGame); // TODO load game only if user was one of the players
      })
      .catch((err) => {
        if (err.message === "Forbidden") {
          navigate("/unauthorized");
        } else if (err.message === "Not Found") {
          navigate("/notfound");
        } else {
          navigate("/error");
        }
      })
      .finally(() => setLoading(false));
  }, [id, gameId, navigate, loadGame, joinGame]);

    const wasActiveRef = useRef(isActiveGame);
    useEffect(() => {
        if (wasActiveRef.current && !isActiveGame) {
            setGameOverOpen(true);
        }
        wasActiveRef.current = isActiveGame;
    }, [isActiveGame]);

    if (loading) return <div>Loading...</div>;
    if (!game) return null;

    if (!chessRef.current) {
        return <div>Loading game state...</div>;
    }

    const handleOpenResignDialog = () => {
        setOpen(true);
    }
    const handleCloseResignDialog = () => {
        setOpen(false);
    }
    const handleResign = () => {
        resign();
        setOpen(false);
    }

    const playerPieces = takenPieces.filter(
        (piece) =>
            (playerColor === "w" && piece === piece.toUpperCase()) ||
            (playerColor === "b" && piece === piece.toLowerCase())
    );

    const opponentPieces = takenPieces.filter(
        (piece) =>
            (playerColor === "w" && piece === piece.toLowerCase()) ||
            (playerColor === "b" && piece === piece.toUpperCase())
    );

  if (!chessRef.current) {
    return <div>Loading game state...</div>;
  }

  let statusMessage = "";
  let statusType: "checkmate" | "stalemate" | "draw" | "check" | "turn" = "turn";
  let statusIcon: React.ReactElement;
  let statusColor: string;
  let chipColor: "error" | "warning" | "info" | "success" = "info";
  const currentTurn = chessRef.current.turn();
  const currentPlayer = currentTurn === "w" ? "White" : "Black";
  const playerColorIndicator = currentTurn === "w" ? "#ffffff" : "#000000";

    if (chessRef.current.isCheckmate()) {
        statusMessage = `Checkmate! ${currentTurn === "w" ? "Black" : "White"} wins.`;
        statusType = "checkmate";
        statusIcon = <ErrorIcon />;
        statusColor = "#d32f2f";
        chipColor = "error";
    } else if (chessRef.current.isStalemate()) {
        statusMessage = "Stalemate! The game is a draw.";
        statusType = "stalemate";
        statusIcon = <WarningAmberIcon />;
        statusColor = "#ed6c02";
        chipColor = "warning";
    } else if (chessRef.current.isDraw()) {
        statusMessage = "Draw!";
        statusType = "draw";
        statusIcon = <CheckCircleIcon />;
        statusColor = "#ed6c02";
        chipColor = "warning";
    } else if (chessRef.current.isCheck()) {
        statusType = "check";
        statusIcon = <WarningAmberIcon />;
        statusColor = "#ed6c02";
        chipColor = "warning";
    } else {
        statusType = "turn";
        statusIcon = <InfoIcon />;
        statusColor = "#0288d1";
        chipColor = "info";
    }

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginTop: "2rem",
                gap: 2,
            }}
        >
            {isActiveGame && (
                <Paper
                    elevation={3}
                    sx={{
                        width: "80%",
                        maxWidth: '900px',
                        mb: 2,
                        borderRadius: 3,
                        overflow: 'hidden',
                        background: `linear-gradient(135deg, ${statusColor}15 0%, ${statusColor}05 100%)`,
                        border: `2px solid ${statusColor}30`,
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            px: 3,
                            py: 2,
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: 40,
                                    height: 40,
                                    borderRadius: '50%',
                                    bgcolor: `${statusColor}20`,
                                    color: statusColor,
                                }}
                            >
                                {statusIcon}
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                {(statusType === "turn" || statusType === "check") && (
                                    <Box
                                        sx={{
                                            width: 16,
                                            height: 16,
                                            borderRadius: '50%',
                                            bgcolor: playerColorIndicator,
                                            border: currentTurn === "w" ? '2px solid #666' : 'none',
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                        }}
                                    />
                                )}
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 600,
                                        color: 'text.primary',
                                    }}
                                >
                                    {statusType === "check"
                                        ? `${currentPlayer} is in check!`
                                        : statusType === "turn"
                                            ? `${currentPlayer}'s turn`
                                            : statusMessage
                                    }
                                </Typography>
                            </Box>
                        </Box>

                        <Chip
                            label={statusType === "turn"
                                ? (currentTurn === "w" ? "White to move" : "Black to move")
                                : statusType.charAt(0).toUpperCase() + statusType.slice(1)
                            }
                            color={chipColor}
                            icon={
                                (statusType === "turn" || statusType === "check") ? (
                                    <CircleIcon sx={{
                                        fontSize: 14,
                                        color: `${playerColorIndicator} !important`,
                                        filter: currentTurn === "w" ? 'drop-shadow(0 0 2px rgba(0,0,0,0.5))' : 'none'
                                    }} />
                                ) : undefined
                            }
                            sx={{
                                fontWeight: 600,
                                px: 1,
                            }}
                        />
                    </Box>
                </Paper>
            )}

            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 4, alignItems: 'stretch' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'left', justifyContent: 'space-between' }}>
                    {/* Player's taken pieces */}
                    <Box sx={{
                        minHeight: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        pl: '24px',
                        flexWrap: 'wrap'
                    }}>
                        {playerPieces.map((piece, index) => (
                            <img
                                key={index}
                                src={PIECE_IMAGES[piece]}
                                alt={`Taken ${piece}`}
                                style={{
                                    width: '25px',
                                    height: '25px',
                                    filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3))'
                                }}
                            />
                        ))}
                    </Box>
                    <ChessBoard />
                    {/* Opponent's taken pieces */}
                    <Box sx={{
                        minHeight: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        pl: '24px',
                        flexWrap: 'wrap'
                    }}>
                        {opponentPieces.map((piece, index) => (
                            <img
                                key={index}
                                src={PIECE_IMAGES[piece]}
                                alt={`Taken ${piece}`}
                                style={{
                                    width: '25px',
                                    height: '25px',
                                    filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3))'
                                }}
                            />
                        ))}
                    </Box>

                </Box>

                <Box sx={{ width: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <MoveHistoryTable />
                    {isActiveGame && (
                        <Button
                            variant="contained"
                            color="error"
                            onClick={() => handleOpenResignDialog()}
                            sx={{
                                mt: 2,
                                fontWeight: 'bold',
                                width: '70%',
                            }}
                        >
                            Resign
                        </Button>
                    )}
                    <ResignDialog open={open} handleResign={handleResign} onClose={handleCloseResignDialog} />
                    <GameOverDialog
                        open={gameOverOpen}
                        winner={gameResult}
                        playerColor={playerColor}
                        onClose={() => setGameOverOpen(false)}
                    />
                </Box>
            </Box>
        </Box>
    );
};
