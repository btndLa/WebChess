import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { useNavigate } from "react-router-dom";

export interface GameOverDialogProps {
    open: boolean;
    winner: string | null;
    onClose: () => void;
}

export function GameOverDialog(props: GameOverDialogProps) {
    const { onClose, open, winner } = props;
    const navigate = useNavigate();

    const getResultMessage = () => {
        if (winner === "draw") {
            return "The game ended in a draw.";
        } else if (winner === "w") {
            return "White won the game!";
        } else if (winner === "b") {
            return "Black won the game!";
        }
        return "The game has ended.";
    };

    const handleGoHome = () => {
        onClose();
        navigate("/");
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Game Over</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {getResultMessage()}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleGoHome} autoFocus>
                    Go to Home
                </Button>
                <Button onClick={onClose}>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
}