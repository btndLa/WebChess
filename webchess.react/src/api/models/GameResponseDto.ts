export interface GameResponseDto{
    id: string 
    whitePlayerId: string
    blackPlayerId: string
    playerColor: 'w' | 'b'
    fen: string
    takenPieces: string[]
    moveHistory: string[]
    status: string
}