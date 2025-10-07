import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChessGameContextProvider } from "@/contexts/ChessGameContextProvider";
import ChessBoard from "@/components/ChessBoard";
import { getGame } from "@/api/client/game-client";
import type { GameDto } from "@/types/GameDto";

const GamePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [game, setGame] = useState<GameDto | null>(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <ChessGameContextProvider>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "2rem" }}>
        <ChessBoard />
      </div>
    </ChessGameContextProvider>
  );
};

export default GamePage;
