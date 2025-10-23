import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";
import { useChessGameContext } from "../contexts/ChessGameContext";

export const JoinGameDialog: React.FC<{
  open: boolean;
  onClose: () => void;
}> = ({ open, onClose }) => {
  const [gameCode, setGameCode] = useState("");
  const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [gameId, setGameId] = useState<string | null>(null);
    const navigate = useNavigate();
    const { joinGame, setPlayerColor } = useChessGameContext();
    //TODO add error messages
    const handleJoin = async () => {
    setLoading(true);
    setError(null);
    try {
        const res = await fetch(`${import.meta.env.VITE_APP_API_BASEURL}/game/join`, { // TODO Move this to provider
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!).authToken : ""}`
        },
        body: JSON.stringify({ gameId: gameCode })
        });
        console.log(res);

      if (!res.ok) throw new Error("Invalid or unavailable game code");
        const data = await res.json();
        setPlayerColor(data.playerColor);
      setGameId(data.id);
      await joinGame(data.id);
      navigate(`/game/${data.id}`);
      onClose();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (open) {
      setGameCode("");
      setError(null);
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Join Game</DialogTitle>
      <DialogContent>
        <TextField
          label="Game Code"
          value={gameCode}
          onChange={e => setGameCode(e.target.value)}
          fullWidth
          margin="normal"
          autoFocus
        />
        {loading && <CircularProgress size={24} sx={{ mt: 2 }} />}
        {error && <Typography color="error">{error}</Typography>}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleJoin} disabled={loading || !gameCode}>Join</Button>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};