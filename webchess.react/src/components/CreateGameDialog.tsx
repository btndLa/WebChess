import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import ShareIcon from '@mui/icons-material/Share';
import Divider from '@mui/material/Divider';
import { useChessGameContext } from "@/contexts/ChessGameContext";

export const CreateGameDialog: React.FC<{
    open: boolean;
    onClose: () => void;
}> = ({ open, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { gameId, createGameSession } = useChessGameContext();

    const handleCreate = async () => {
        setLoading(true);
        setError(null);
        try {
            await createGameSession();
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
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleClose = () => {
        onClose();
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
                    <SportsEsportsIcon color="primary" sx={{ fontSize: 28 }} />
                    <Typography variant="h5" component="span" fontWeight={600}>
                        Create New Game
                    </Typography>
                </Box>
            </DialogTitle>

            <Divider />

            <DialogContent sx={{ pt: 3, pb: 2 }}>
                {loading && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
                        <CircularProgress size={50} thickness={4} />
                        <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                            Creating your game...
                        </Typography>
                    </Box>
                )}

                {error && (
                    <Paper
                        elevation={0}
                        sx={{
                            p: 2,
                            bgcolor: 'error.light',
                            color: 'error.contrastText',
                            borderRadius: 2
                        }}
                    >
                        <Typography variant="body1" fontWeight={500}>
                            {error}
                        </Typography>
                    </Paper>
                )}

                {!loading && !gameId && !error && (
                    <Box sx={{ textAlign: 'center', py: 3 }}>
                        <Box
                            sx={{
                                display: 'inline-flex',
                                p: 3,
                                borderRadius: '50%',
                                bgcolor: 'primary.light',
                                mb: 2
                            }}
                        >
                            <SportsEsportsIcon sx={{ fontSize: 48, color: 'primary.main' }} />
                        </Box>
                        <Typography variant="h6" gutterBottom fontWeight={600}>
                            Ready to Start?
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Click the button below to create a new chess game and get your unique game code.
                        </Typography>
                    </Box>
                )}

                {gameId && (
                    <Box>
                        {/* Game Code Section */}
                        <Paper
                            elevation={3}
                            sx={{
                                p: 3,
                                mb: 3,
                                bgcolor: 'primary.main',
                                color: 'primary.contrastText',
                                borderRadius: 2,
                                textAlign: 'center'
                            }}
                        >
                            <Typography variant="body2" sx={{ mb: 1, opacity: 0.9 }}>
                                Your Game Code
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                                <Typography
                                    variant="h4"
                                    sx={{
                                        fontFamily: 'monospace',
                                        letterSpacing: 2
                                    }}
                                >
                                    {gameId}
                                </Typography>
                                <IconButton
                                    onClick={handleCopy}
                                    size="small"
                                    sx={{
                                        color: 'primary.contrastText',
                                        bgcolor: 'rgba(255,255,255,0.1)',
                                        '&:hover': {
                                            bgcolor: 'rgba(255,255,255,0.2)'
                                        }
                                    }}
                                >
                                    <ContentCopyIcon />
                                </IconButton>
                            </Box>
                            {copied && (
                                <Chip
                                    icon={<CheckCircleIcon />}
                                    label="Copied to clipboard!"
                                    color="success"
                                    size="small"
                                    sx={{ mt: 1 }}
                                />
                            )}
                        </Paper>

                        {/* Instructions */}
                        <Box sx={{ mb: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'start', gap: 2, mb: 2 }}>
                                <ShareIcon color="primary" />
                                <Box>
                                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                                        Share with Your Friend
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Send this code to your opponent so they can join your game
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        {/* Status Section */}
                        {(
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                                p: 2,
                                bgcolor: 'warning.light',
                                borderRadius: 2
                            }}>
                                <HourglassEmptyIcon color="warning" />
                                <Box>
                                    <Typography variant="subtitle2" fontWeight={600} color="warning.dark">
                                        Waiting for Opponent
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        The game will start automatically when your friend joins
                                    </Typography>
                                </Box>
                            </Box>
                        )}
                    </Box>
                )}
            </DialogContent>

            <Divider />

            <DialogActions sx={{ px: 3, py: 2 }}>
                {!gameId && (
                    <>
                        <Button
                            onClick={handleClose}
                            color="inherit"
                            sx={{ textTransform: 'none' }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleCreate}
                            variant="contained"
                            disabled={loading}
                            startIcon={<SportsEsportsIcon />}
                            sx={{
                                px: 3,
                                textTransform: 'none',
                                borderRadius: 2
                            }}
                        >
                            Create Game
                        </Button>
                    </>
                )}
                {gameId && (
                    <>
                        {(
                            <Button
                                onClick={handleClose}
                                color="inherit"
                                sx={{ textTransform: 'none' }}
                            >
                                Close
                            </Button>
                        )}
                    </>
                )}
            </DialogActions>
        </Dialog>
    );
};
