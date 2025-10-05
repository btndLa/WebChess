import { ChessGameContextProvider } from "@/contexts/ChessGameContextProvider";
import ChessBoard from "@/components/ChessBoard";  

const GamePage: React.FC = () => {
  return (
    <ChessGameContextProvider>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "2rem" }}>
        <ChessBoard />
      </div>
    </ChessGameContextProvider>
  );
};

export default GamePage;
