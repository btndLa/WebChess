import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Box,
    Typography,
    Divider,
    Paper
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import HomeIcon from '@mui/icons-material/Home';
import CloseIcon from '@mui/icons-material/Close';

export interface GameOverDialogProps {
    open: boolean;
    winner: string | null;
    playerColor: "w" | "b" | null;
    onClose: () => void;
}

export function GameOverDialog(props: GameOverDialogProps) {
    const { onClose, open, winner, playerColor } = props;
    const navigate = useNavigate();

    const getResultData = () => {
        const didPlayerWin = winner === playerColor;
        
        if (winner === "draw") {
            return {
                title: "Game Drawn",
                message: "The game ended in a draw. Well played by both sides!",
                color: "#000000",
                bgColor: "warning.light",
                subMessage: "Both players demonstrated great skill and strategy."
            };
        } else if (didPlayerWin) {
            // Player won
            return {
                title: "Victory!",
                message: "Congratulations! You won the game!",
                color: "#1b5e20",
                bgColor: "success.light",
                subMessage: "Excellent play! Your strategy led you to victory."
            };
        } else {
            // Player lost
            return {
                title: "Defeat",
                message: `${winner === "w" ? "White" : "Black"} wins the game.`,
                color: "#b71c1c",
                bgColor: "error.light",
                subMessage: "Better luck next time! Learn from this game and come back stronger."
            };
        }
    };

    const handleGoHome = () => {
        onClose();
        navigate("/");
    };

    const resultData = getResultData();

    return (
        <Dialog
            open={open}
            onClose={onClose}
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
                    <Typography variant="h5" component="span" fontWeight={600}>
                        {resultData.title}
                    </Typography>
                </Box>
            </DialogTitle>

            <Divider />

            <DialogContent sx={{ pt: 3, pb: 2 }}>
                <Box sx={{ textAlign: 'center' }}>
                    <Box
                        sx={{
                            display: 'inline-flex',
                            px: 4,
                            py: 2,
                            borderRadius: 2,
                            bgcolor: resultData.bgColor,
                            mb: 3,
                            boxShadow: 2
                        }}
                    >
                        <Typography
                            variant="h3"
                            sx={{
                                fontWeight: 700,
                                color: resultData.color
                            }}
                        >
                            {resultData.title}
                        </Typography>
                    </Box>

                    {/* Message */}
                    <Typography
                        variant="h6"
                        gutterBottom
                        fontWeight={600}
                        sx={{ mb: 2 }}
                    >
                        {resultData.message}
                    </Typography>

                    <Paper
                        elevation={0}
                        sx={{
                            p: 2,
                            mt: 3,
                            bgcolor: 'background.default',
                            borderRadius: 2,
                            border: `2px solid ${resultData.color}30`
                        }}
                    >
                        <Typography variant="body2" color="text.secondary">
                            {resultData.subMessage}
                        </Typography>
                    </Paper>
                </Box>
            </DialogContent>

            <Divider />

            <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
                <Button
                    onClick={onClose}
                    color="inherit"
                    startIcon={<CloseIcon />}
                    sx={{
                        textTransform: 'none',
                        px: 2
                    }}
                >
                    Close
                </Button>
                <Button
                    onClick={handleGoHome}
                    variant="contained"
                    startIcon={<HomeIcon />}
                    sx={{
                        px: 3,
                        textTransform: 'none',
                        borderRadius: 2,
                        fontWeight: 600
                    }}
                    autoFocus
                >
                    Go to Home
                </Button>
            </DialogActions>
        </Dialog>
    );
}