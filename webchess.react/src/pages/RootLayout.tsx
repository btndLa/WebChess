import { Outlet } from "react-router-dom";
import HeaderBar from "../components/HeaderBar";
import { ChessGameContextProvider } from "../contexts/ChessGameContextProvider";
import { UserContextProvider } from "../contexts/UserContextProvider";

export function RootLayout(){
    return (
        <UserContextProvider>
            <ChessGameContextProvider>
                    {/* Header */}
                            <HeaderBar></HeaderBar>
                    {/* Main Content */}
                    <main>
                    <Outlet />
                    </main>
                    {/* Footer */}
                    <footer>
                    <span>&copy; {new Date().getFullYear()} WebChess</span>
                    </footer>
            </ChessGameContextProvider>
        </UserContextProvider>
  );
};

export default RootLayout;