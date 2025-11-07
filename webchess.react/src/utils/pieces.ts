import WhiteKing from '@/assets/pieces/white-king.svg';
import WhiteQueen from '@/assets/pieces/white-queen.svg';
import WhiteRook from '@/assets/pieces/white-rook.svg';
import WhiteBishop from '@/assets/pieces/white-bishop.svg';
import WhiteKnight from '@/assets/pieces/white-knight.svg';
import WhitePawn from '@/assets/pieces/white-pawn.svg';
import BlackKing from '@/assets/pieces/black-king.svg';
import BlackQueen from '@/assets/pieces/black-queen.svg';
import BlackRook from '@/assets/pieces/black-rook.svg';
import BlackBishop from '@/assets/pieces/black-bishop.svg';
import BlackKnight from '@/assets/pieces/black-knight.svg';
import BlackPawn from '@/assets/pieces/black-pawn.svg';

export const PIECE_IMAGES: Record<string, string> = {
    K: WhiteKing,
    Q: WhiteQueen,
    R: WhiteRook,
    B: WhiteBishop,
    N: WhiteKnight,
    P: WhitePawn,
    k: BlackKing,
    q: BlackQueen,
    r: BlackRook,
    b: BlackBishop,
    n: BlackKnight,
    p: BlackPawn,
};