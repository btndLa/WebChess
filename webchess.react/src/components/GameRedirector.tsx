import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useChessGameContext } from "@/contexts/ChessGameContext";
import { useUserContext } from "../contexts/UserContext";

export function GameRedirector() {
    const { gameId } = useChessGameContext();
    const { loggedIn, initialized } = useUserContext();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (initialized && loggedIn && gameId && !location.pathname.startsWith(`/game/${gameId}`)) {
            navigate(`/game/${gameId}`, { replace: true });
        }
    }, [gameId, location.pathname, navigate, initialized, loggedIn]);

    return null;
};