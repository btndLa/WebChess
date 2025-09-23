using ChessDotNet;


var game = new ChessGame();
game.MakeMove(new Move("e2", "e4", Player.White), true);
// See https://aka.ms/new-console-template for more information
Console.WriteLine("Hello, World!");
