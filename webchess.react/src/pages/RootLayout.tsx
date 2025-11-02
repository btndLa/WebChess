import { Outlet } from "react-router-dom";
import HeaderBar from "../components/HeaderBar";
import { ChessGameContextProvider } from "../contexts/ChessGameContextProvider";
import { UserContextProvider } from "../contexts/UserContextProvider";

export function RootLayout(){
    return (
        <UserContextProvider>
            <ChessGameContextProvider>
                            <HeaderBar></HeaderBar>
                    <main>
                    <Outlet />
                    </main>
                <footer>
                {/* TODO*/}
                    </footer>
            </ChessGameContextProvider>
        </UserContextProvider>
  );
};

export default RootLayout;