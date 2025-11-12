import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { useChessGameContext } from "../contexts/ChessGameContext";
import { useEffect, useRef } from "react";

export default function MoveHistoryTable() {
    const { moveHistory } = useChessGameContext();
    const tableContainerRef = useRef<HTMLDivElement>(null);

    const movePairs: { moveNumber: number; white: string; black: string }[] = [];
    for (let i = 0; i < moveHistory.length; i += 2) {
        movePairs.push({
            moveNumber: i / 2 + 1,
            white: moveHistory[i],
            black: moveHistory[i + 1] || "",
        });
    }

    useEffect(() => {
        if (tableContainerRef.current) {
            tableContainerRef.current.scrollTop = tableContainerRef.current.scrollHeight;
        }
    }, [moveHistory]);

    return (
        <Paper sx={{ width: '100%', height: '100%', maxHeight: '400px', display: 'flex', flexDirection: 'column' }}>
            <TableContainer
                ref={tableContainerRef}
                sx={{ maxHeight: '400px', overflow: 'auto' }}
            >
                <Table stickyHeader aria-label="move history table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center" style={{ fontWeight: 'bold' }}>Move</TableCell>
                            <TableCell align="center" style={{ fontWeight: 'bold' }}>White</TableCell>
                            <TableCell align="center" style={{ fontWeight: 'bold' }}>Black</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {movePairs.map((pair) => (
                            <TableRow hover key={pair.moveNumber}>
                                <TableCell align="center">{pair.moveNumber}</TableCell>
                                <TableCell align="center">{pair.white}</TableCell>
                                <TableCell align="center">{pair.black}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
}