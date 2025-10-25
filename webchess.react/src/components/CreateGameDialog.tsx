import React, { useState, useRef, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import IconButton from '@mui/material/IconButton';
import { useNavigate } from "react-router-dom";
import { useChessGameContext } from "@/contexts/ChessGameContext";
import { createGame } from "../api/client/game-client";
import { useUserContext } from "../contexts/UserContext";

export const CreateGameDialog: React.FC<{
  open: boolean;
  onClose: () => void;
}> = ({ open, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [waiting, setWaiting] = useState(false);
  const [opponentJoined, setOpponentJoined] = useState(false);
    const navigate = useNavigate();
    const { gameId, joinGame, loadGame, connectionRef, setIsActiveGame } = useChessGameContext();

  const handleCreate = async () => {
    setLoading(true);
    setError(null);
      try {
          const gameData = await createGame(); // TODO sometimes code stays the same after game
          await joinGame(gameData.id);
          loadGame(gameData);
          connectionRef.current?.on("PlayerJoined", () => {// TODO when reloading page, check what happens if the player who made the game or the other player does the reload.
              if(gameData.status == "waiting"){
                  setOpponentJoined(true);
                  setWaiting(false);
                  onClose();
                  navigate(`/game/${gameData.id}`);
                  setIsActiveGame(true);
              }
          });
      setWaiting(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (gameId) {
      navigator.clipboard.writeText(gameId);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const handleGoToGame = () => {
    if (gameId) {
      navigate(`/game/${gameId}`);
      onClose();
    }
  };


  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create Game</DialogTitle>
      <DialogContent>
        {loading && <CircularProgress />}
        {error && <Typography color="error">{error}</Typography>}
        {gameId && (
          <>
            <Typography gutterBottom>
              Share this code with your friend to join:
            </Typography>
            <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center' }}>
              {gameId}
              <IconButton onClick={handleCopy} size="small" sx={{ ml: 1 }}>
                <ContentCopyIcon fontSize="small" />
              </IconButton>
              {copied && <span style={{ marginLeft: 8, color: 'green' }}>Copied!</span>}
            </Typography>
            {waiting && <Typography>Waiting for opponent to join...</Typography>}
            {opponentJoined && <Typography color="success.main">Opponent joined! You can start the game.</Typography>}
          </>
        )}
      </DialogContent>
      <DialogActions>
        {!gameId && <Button onClick={handleCreate} disabled={loading}>Create</Button>}
        {gameId && <Button onClick={handleGoToGame}>Go to Game</Button>}
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};
