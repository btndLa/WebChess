using ChessDotNet;


var game = new ChessGame();
var board = game.GetBoard();
Console.WriteLine(game.GetFen());
foreach (var row in board)
{
    foreach (var cell in row)
    {
        Console.Write(cell + " ");
    }
    Console.WriteLine();
}
Console.WriteLine(game.GetBoard().ToString());
Console.WriteLine("Hello, World!");
