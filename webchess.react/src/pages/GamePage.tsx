import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ChessBoard from "@/components/ChessBoard";
import { getGame } from "@/api/client/game-client";
import type { GameResponseDto } from "@/api/models/GameResponseDto";
import { useChessGameContext } from "@/contexts/ChessGameContext";
import { PIECE_UNICODE } from "@/utils/pieces";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import MoveHistoryTable from "../components/MoveHistoryTable";
import { Button, Typography } from "@mui/material";
import { ResignDialog } from "../components/ResignDialog";
import { GameOverDialog } from "../components/GameOverDialog";

const GamePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [game, setGame] = useState<GameResponseDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [gameOverOpen, setGameOverOpen] = useState(false);
    const { joinGame, gameId, chessRef, takenPieces, playerColor, resign, loadGame, isActiveGame } = useChessGameContext();
    const initializedRef = useRef(false);

    useEffect(() => {
    if (!id || initializedRef.current) return;
    initializedRef.current = true;
    setLoading(true);
    getGame(id)
        .then((fetchedGame) => {
            if (!gameId) {
                loadGame(fetchedGame);
                if (fetchedGame.status == "active" || fetchedGame.status == "waiting") {

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

  let statusMessage = "";
  let severity: "info" | "warning" | "success" | "error" = "info";

  if (chessRef.current.isCheckmate()) {
    statusMessage = `Checkmate! ${chessRef.current.turn() === "w" ? "Black" : "White"} wins.`;
    severity = "error";
  } else if (chessRef.current.isStalemate()) {
    statusMessage = "Stalemate! The game is a draw.";
    severity = "warning";
  } else if (chessRef.current.isDraw()) {
    statusMessage = "Draw!";
    severity = "warning";
  } else if (chessRef.current.isCheck()) {
    statusMessage = `${chessRef.current.turn() === "w" ? "White" : "Black"} is in check.`;
    severity = "warning";
  } else {
    statusMessage = `${chessRef.current.turn() === "w" ? "White" : "Black"}'s turn.`;
      severity = "info";

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
      >{isActiveGame &&
      <Box sx={{ width: "80%", maxWidth: '900px', mb: 2 }}>
        <Alert severity={severity}>{statusMessage}</Alert>
      </Box>}

      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 4, alignItems: 'stretch' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'left', justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ minHeight: '32px', fontFamily: 'monospace', pl: '24px' }}>
            {opponentPieces.map((p) => PIECE_UNICODE[p]).join("")}
          </Typography>
          <ChessBoard />
          <Typography variant="h6" sx={{ minHeight: '32px', fontFamily: 'monospace', pl: '24px' }}>
            {playerPieces.map((p) => PIECE_UNICODE[p]).join("")}
          </Typography>
        </Box>

              <Box sx={{ width: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <MoveHistoryTable />
                  {isActiveGame &&  < Button variant="contained" color="error" onClick={() => handleOpenResignDialog()}
                    sx={{
                        mt: 2,
                        fontWeight: 'bold',
                        width: '70%',
                        fontFamily: ''
                      }}
                  >Resign
                  </Button>}
                  <ResignDialog open={open} handleResign={handleResign} onClose={handleCloseResignDialog} />
                  <GameOverDialog
                      open={gameOverOpen}
                      winner="white" //TODO extend info in gameover dialog
                      onClose={() => setGameOverOpen(false)}
                  />
        </Box>
      </Box>
    </Box>
  );
};

export default GamePage;
