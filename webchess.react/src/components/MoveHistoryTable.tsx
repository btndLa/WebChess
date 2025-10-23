import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { useChessGameContext } from "../contexts/ChessGameContext";

export default function StickyHeadTable() {
    const { moveHistory } = useChessGameContext();
    return (
        <Paper sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            <TableCell key="turn" align="left"//TODO auto scroll to bototm
                            //style={{ minWidth: move.minWidth }} 
                            >Turn</TableCell>
                            <TableCell key="whiteMove" align="left">White</TableCell>  {/*TODO Maybe bold*/ }
                            <TableCell key="blackMove" align="left">Black</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {moveHistory.map((move, idx) => {
                            if (idx % 2 === 0) {
                                const whiteMove = move;
                                const blackMove = moveHistory[idx + 1] ?? '';
                                return (
                                    <TableRow hover tabIndex={-1} key={idx}>
                                        <TableCell key={idx} align="left">{idx / 2 + 1}</TableCell>
                                        <TableCell>{whiteMove}</TableCell>
                                        <TableCell>{blackMove}</TableCell>
                                    </TableRow>
                                );
                            }
                            return null;
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
}