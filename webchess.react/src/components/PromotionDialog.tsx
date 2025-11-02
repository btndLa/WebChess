import React from 'react';
import { Dialog, DialogTitle, DialogContent, Button, Stack, Box } from '@mui/material';
import { useChessGameContext } from '@/contexts/ChessGameContext';
import { PieceSymbol } from 'chess.js';
import { PIECE_IMAGES } from '@/utils/pieces';

export const PromotionDialog: React.FC = () => {
  const { promotionMove, makeMove, turn } = useChessGameContext();

  if (!promotionMove) {
    return null;
  }

  const handleSelect = (piece: PieceSymbol) => {
    makeMove(promotionMove.from, promotionMove.to, piece);
  };

  const promotionPieces: PieceSymbol[] = ['q', 'r', 'b', 'n'];

  const getPieceKey = (piece: PieceSymbol): string => {
    return turn === 'w' ? piece.toUpperCase() : piece.toLowerCase();
  };

  return (
    <Dialog 
      open={true}
      PaperProps={{
        sx: {
          borderRadius: 3,
          minWidth: 400
        }
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', fontWeight: 600, pb: 1 }}>
        Promote Your Pawn
      </DialogTitle>
      <DialogContent>
        <Stack 
          direction="row" 
          spacing={2} 
          justifyContent="center"
          sx={{ py: 2 }}
        >
          {promotionPieces.map((piece) => {
            const pieceKey = getPieceKey(piece);
            const imageSrc = PIECE_IMAGES[pieceKey];
            
            return (
              <Button
                key={piece}
                onClick={() => handleSelect(piece)}
                sx={{
                  minWidth: 80,
                  minHeight: 80,
                  p: 1,
                  borderRadius: 2,
                  border: '2px solid',
                  borderColor: 'divider',
                  backgroundColor: 'background.paper',
                  transition: 'all 0.2s',
                  '&:hover': {
                    borderColor: 'primary.main',
                    backgroundColor: 'primary.light',
                    transform: 'scale(1.05)',
                    boxShadow: 3
                  }
                }}
              >
                <Box
                  component="img"
                  src={imageSrc}
                  alt={`Promote to ${piece}`}
                  sx={{
                    width: '100%',
                    height: '100%',
                    filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))',
                    pointerEvents: 'none'
                  }}
                />
              </Button>
            );
          })}
        </Stack>
      </DialogContent>
    </Dialog>
  );
};