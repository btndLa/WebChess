export interface ChessGameInfo {
    gameId: string;
    playerWhite: string;
    playerBlack: string;
    currentTurn: 'white' | 'black';
    status: 'ongoing' | 'checkmate' | 'stalemate' | 'draw' | 'resigned';
    board
    moves: string[];
}