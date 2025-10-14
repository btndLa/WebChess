import { useEffect, useState} from "react";
import { useParams, useNavigate } from "react-router-dom";
import ChessBoard from "@/components/ChessBoard";
import { getGame } from "@/api/client/game-client";
import type { GameDto } from "@/types/GameDto";
import { useChessGameContext } from "@/contexts/ChessGameContext";
import { PIECE_UNICODE } from "@/utils/pieces";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";

const GamePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [game, setGame] = useState<GameDto | null>(null);
  const [loading, setLoading] = useState(true);
  const { chessRef, takenPieces, playerColor } = useChessGameContext();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getGame(id)
      .then(setGame)
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
  }, [id, navigate]);

  if (loading) return <div>Loading...</div>;
  if (!game) return null;

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

  // Determine status message
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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "2rem",
      }}
    >
      <Box sx={{ width: "100%", mb: 2 }}>
        <Alert severity={severity}>{statusMessage}</Alert>
      </Box>
      <div>
        {playerPieces.map((p) => PIECE_UNICODE[p]).join(" ")}
        <ChessBoard />
        {opponentPieces.map((p) => PIECE_UNICODE[p]).join(" ")}
      </div>
    </div>
  );
};

export default GamePage;
