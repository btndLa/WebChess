import React from 'react';
import { Dialog, DialogTitle, DialogContent, Button, Stack } from '@mui/material';
import { useChessGameContext } from '@/contexts/ChessGameContext';
import { PieceSymbol } from 'chess.js';

export const PromotionDialog: React.FC = () => {
  const { promotionMove, makeMove, turn } = useChessGameContext();

  if (!promotionMove) {
    return null;
  }

  const handleSelect = (piece: PieceSymbol) => {
    makeMove(promotionMove.from, promotionMove.to, piece);
  };

  const pieces: Record<PieceSymbol, string> = {
    q: turn === 'w' ? '♕' : '♛',
    r: turn === 'w' ? '♖' : '♜',
    b: turn === 'w' ? '♗' : '♝',
    n: turn === 'w' ? '♘' : '♞',
    p: '', // Pawn can't be a promotion choice
    k: '', // King can't be a promotion choice
  };

  return (
    <Dialog open={true}>
      <DialogTitle>Promote Pawn</DialogTitle>
      <DialogContent>
        <Stack direction="row" spacing={2}>
          {(['q', 'r', 'b', 'n'] as const).map((p) => (
            <Button key={p} onClick={() => handleSelect(p)} style={{ fontSize: 48 }}>
              {pieces[p]}
            </Button>
          ))}
        </Stack>
      </DialogContent>
    </Dialog>
  );
};