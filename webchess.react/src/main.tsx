import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import RootLayout from './pages/RootLayout'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import GamePage from './pages/GamePage'
import { UserContextProvider } from './contexts/UserContextProvider'
import { ChessGameContextProvider } from './contexts/ChessGameContextProvider'

const router = createBrowserRouter([
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
]);
                

createRoot(document.getElementById('root')!).render(
    <UserContextProvider>
        <ChessGameContextProvider>
            <StrictMode>
                <RouterProvider router={router} />
            </StrictMode>,
        </ChessGameContextProvider>
    </UserContextProvider>

)