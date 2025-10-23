export interface GameResponseDto
{
    id: string 
    whitePlayerId: string
    blackPlayerId: string
    playerColor: 'w' | 'b'
    fen: string
    takenPiecesWhite: string[]
    moveHistory: string[]
}