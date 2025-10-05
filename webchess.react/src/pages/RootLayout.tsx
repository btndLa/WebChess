import { Outlet } from "react-router-dom";
import HeaderBar from "../components/HeaderBar";

export function RootLayout(){
  return (
    <div className="root-layout">
      {/* Header */}
       <header>
              <HeaderBar></HeaderBar>
      </header>
      {/* Main Content */}
      <main>
        <Outlet />
      </main>
      {/* Footer */}
      <footer>
        <span>&copy; {new Date().getFullYear()} WebChess</span>
      </footer>
    </div>
  );
};

export default RootLayout;