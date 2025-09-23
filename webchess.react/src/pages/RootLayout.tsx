import React from "react";
import { Outlet } from "react-router-dom";

export function RootLayout(){
  return (
    <div className="root-layout">
      {/* Header */}
      <header>
        <h1>WebChess</h1>
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