import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import InputAdornment from '@mui/material/InputAdornment';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';
import { useNavigate } from "react-router-dom";
import { useChessGameContext } from "../contexts/ChessGameContext";

export const JoinGameDialog: React.FC<{
  open: boolean;
  onClose: () => void;
}> = ({ open, onClose }) => {
  const [gameCode, setGameCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { joinGame, setPlayerColor, loadGame, setIsActiveGame } = useChessGameContext();// TODO add error messages

  const handleJoin = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_APP_API_BASEURL}/game/join`, { // TODO Move this to the provider
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!).authToken : ""}`
        },
        body: JSON.stringify({ gameId: gameCode.trim() })
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Invalid or unavailable game code");
      }
      
      const data = await res.json();
      setPlayerColor(data.playerColor);
      await joinGame(data.id);
      loadGame(data);
      setIsActiveGame(true);
      navigate(`/game/${data.id}`);
      onClose();
    } catch (e: any) {
      setError(e.message || "Failed to join game. Please check the code and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  React.useEffect(() => {
    if (open) {
      setGameCode("");
      setError(null);
    }
  }, [open]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && gameCode.trim() && !loading) {
      handleJoin();
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          backgroundImage: 'linear-gradient(to bottom, rgba(255,255,255,0.95), rgba(255,255,255,1))'
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PersonAddIcon color="secondary" sx={{ fontSize: 28 }} />
          <Typography variant="h5" component="span" fontWeight={600}>
            Join Existing Game
          </Typography>
        </Box>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 3, pb: 2 }}>
        {!loading && (
          <>
            {/* Info Section */}
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Box 
                sx={{ 
                  display: 'inline-flex',
                  p: 3,
                  borderRadius: '50%',
                  bgcolor: 'secondary.light',
                  mb: 2
                }}
              >
                <VpnKeyIcon sx={{ fontSize: 48, color: 'secondary.main' }} />
              </Box>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Enter Game Code
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Ask your friend for their game code to join their match
              </Typography>
            </Box>

            {/* Game Code Input */}
            <Paper 
              elevation={2}
              sx={{ 
                p: 3, 
                mb: 2,
                borderRadius: 2,
                bgcolor: 'background.paper'
              }}
            >
              <TextField
                label="Game Code"
                placeholder="Enter the game code here"
                value={gameCode}
                onChange={(e) => setGameCode(e.target.value.toUpperCase())}
                onKeyPress={handleKeyPress}
                fullWidth
                autoFocus
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <VpnKeyIcon color="action" />
                    </InputAdornment>
                  ),
                  sx: {
                    fontFamily: 'monospace',
                    fontSize: '1.2rem',
                    letterSpacing: 1
                  }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: 'secondary.main',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'secondary.main',
                      borderWidth: 2
                    }
                  }
                }}
              />
              <Typography 
                variant="caption" 
                color="text.secondary" 
                sx={{ mt: 1, display: 'block' }}
              >
                Game codes are in UUID format (e.g., 12345678-1234-5678-1234-567812345678)
              </Typography>
            </Paper>

            {/* Error Display */}
            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  borderRadius: 2,
                  '& .MuiAlert-message': {
                    width: '100%'
                  }
                }}
              >
                <Typography variant="body2" fontWeight={500}>
                  {error}
                </Typography>
              </Alert>
            )}
          </>
        )}

        {/* Loading State */}
        {loading && (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
            <CircularProgress size={50} thickness={4} color="secondary" />
            <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
              Joining game...
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Please wait while we connect you to the match
            </Typography>
          </Box>
        )}
      </DialogContent>

      <Divider />

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button 
          onClick={handleClose}
          color="inherit"
          disabled={loading}
          sx={{ textTransform: 'none' }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleJoin} 
          variant="contained"
          color="secondary"
          disabled={loading || !gameCode.trim()}
          startIcon={<PersonAddIcon />}
          sx={{ 
            px: 3,
            textTransform: 'none',
            borderRadius: 2
          }}
        >
          Join Game
        </Button>
      </DialogActions>
    </Dialog>
  );
};