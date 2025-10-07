public class GameDto
{
    public Guid Id { get; set; }
    public string WhitePlayerId { get; set; }
    public string BlackPlayerId { get; set; }
    public string Fen { get; set; }
}