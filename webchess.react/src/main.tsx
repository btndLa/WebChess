import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createHashRouter, RouterProvider } from 'react-router-dom'
import RootLayout from './pages/RootLayout'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { GamePage } from './pages/GamePage'
import './index.css'

const router = createHashRouter([
    {
        element: <RootLayout />,
        children: [
            {
                path: "/",
                element: <HomePage />,
            },
            {
                path: "/login",
                element: <LoginPage />,
            },
            {
                path: "/register",
                element: <RegisterPage />,
            },
            {
                path: "/game/:id",
                element: <GamePage />,
            },
        ],
    },
], { basename: "/WebChess" });
                

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>

)