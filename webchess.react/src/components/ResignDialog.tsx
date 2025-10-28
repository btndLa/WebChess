import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

export interface ResignDialogProps {
    open: boolean;
    handleResign: () => void;
    onClose: () => void;
}

export function ResignDialog(props: ResignDialogProps) {//TODO onlyshow if game is active
    const { onClose, open, handleResign } = props;

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Resign Game?</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Are you sure you want to resign? This action cannot be undone.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" onClick={onClose} size="small">No</Button>
                <Button variant="contained" onClick={handleResign} color="error" size="small" autoFocus>
                    Yes, Resign
                </Button>
            </DialogActions>
        </Dialog>
    );
}