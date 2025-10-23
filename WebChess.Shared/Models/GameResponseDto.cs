public class GameResponseDto {
    public Guid Id { get; set; }
    public string Fen { get; set; }
    public string? WhitePlayerId { get; set; }
    public string? BlackPlayerId { get; set; }
    public string[]? MoveHistory { get; set; }
    public char[] TakenPieces { get; set; } 
	public string Status { get; set; }
    public string PlayerColor { get; set; }
}