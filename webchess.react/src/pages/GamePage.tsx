import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ChessBoard from "@/components/ChessBoard";
import { getGame } from "@/api/client/game-client";
import type { GameDto } from "@/types/GameDto";
import { useChessGameContext } from "@/contexts/ChessGameContext";
import { PIECE_UNICODE } from "@/utils/pieces"


const GamePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [game, setGame] = useState<GameDto | null>(null);
  const [loading, setLoading] = useState(true);
  const { takenPieces } = useChessGameContext();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getGame(id)
      .then(setGame)
      .catch((err) => {
        if (err.message === "Forbidden") {
          navigate("/unauthorized");
        } else if (err.message === "Not Found") {
          navigate("/notfound");
        } else {
          navigate("/error");
        }
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) return <div>Loading...</div>;
    if (!game) return null;

    const takenWhite = takenPieces
        .filter(piece => piece.color === "w")
        .map(piece => piece.type.toUpperCase());
    const takenBlack = takenPieces
        .filter((piece) => piece.color == "b")
        .map(piece => piece.type.toLowerCase());

    console.log("piece",takenPieces)
    console.log("white",takenWhite)


  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "2rem",
      }}
      >
      <strong>Black taken:</strong> {takenBlack.map((p) => PIECE_UNICODE[p]).join(" ")} {/* change this based on flip position */}
          <ChessBoard />
          <strong>White taken:</strong> {takenWhite.map((p) => PIECE_UNICODE[p]).join(" ")}

    </div>
  );
};

export default GamePage;
