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
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import HandshakeIcon from '@mui/icons-material/Handshake';
import HomeIcon from '@mui/icons-material/Home';
import CloseIcon from '@mui/icons-material/Close';

export interface GameOverDialogProps {
    open: boolean;
    winner: string | null;
    onClose: () => void;
}

export function GameOverDialog(props: GameOverDialogProps) {
    const { onClose, open, winner } = props;
    const navigate = useNavigate();

    const getResultData = () => {
        if (winner === "draw") {
            return {
                title: "Game Drawn",
                message: "The game ended in a draw. Well played by both sides!",
                icon: <HandshakeIcon sx={{ fontSize: 80 }} />,
                color: "#ed6c02",
                bgColor: "warning.light"
            };
        } else if (winner === "w") {
            return {
                title: "White Wins!",
                message: "Congratulations! White has won the game.",
                icon: <EmojiEventsIcon sx={{ fontSize: 80 }} />,
                color: "#2196f3",
                bgColor: "primary.light"
            };
        } else if (winner === "b") {
            return {
                title: "Black Wins!",
                message: "Congratulations! Black has won the game.",
                icon: <EmojiEventsIcon sx={{ fontSize: 80 }} />,
                color: "#424242",
                bgColor: "grey.300"
            };
        }
        return {
            title: "Game Over",
            message: "The game has ended.",
            icon: <HandshakeIcon sx={{ fontSize: 80 }} />,
            color: "#757575",
            bgColor: "grey.200"
        };
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
                    {/* Trophy/Icon Section */}
                    <Box
                        sx={{
                            display: 'inline-flex',
                            p: 3,
                            borderRadius: '50%',
                            bgcolor: resultData.bgColor,
                            mb: 3,
                            boxShadow: 2
                        }}
                    >
                        <Box sx={{ color: resultData.color }}>
                            {resultData.icon}
                        </Box>
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

                    {/* Decorative Element */}
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
                            {winner === "draw"
                                ? "Both players demonstrated great skill and strategy."
                                : "Thank you for playing! Start a new game to play again."
                            }
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