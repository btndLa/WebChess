import { ReactNode, useCallback, useEffect, useState } from "react";
import { UserInfo, UserContext, UserContextModel } from "./UserContext";
import { LoginResponseDto } from "@/api/models/LoginResponseDto";
import { getJwtExpiration } from "@/utils/jwt";
import { login, logout, refresh } from "@/api/client/users-client";
import { HttpError } from "@/api/errors/HttpError";
import { LoginRequestDto } from "@/api/models/LoginRequestDto";

export function UserContextProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserInfo | null>(null);
    const [authError, setAuthError] = useState<string| null>(null);
    const [initialized, setInitialized] = useState<boolean>(false);
    const loggedIn = user !== null;

    const handleLoginResponse = useCallback((response: LoginResponseDto) => {
        const user: UserInfo = {
            userId: response.userId,
            authToken: response.authToken,
            refreshToken: response.refreshToken,
            authTokenExpiration: getJwtExpiration(response.authToken)
        };
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
    }, []);

    const redeemToken = useCallback(async (refreshToken: string) => {
        try {
            const response = await refresh(refreshToken);
            handleLoginResponse(response);
        } catch (e) {
            if (e instanceof HttpError && e.status === 403) {
                localStorage.removeItem("user");
                setUser(null);
            } else if (e instanceof Error) {
                setAuthError(e.message);
            } else {
                setAuthError('An unknown error occurred');
            }
        }
    }, [handleLoginResponse]);

    const handleLogin = useCallback(async (data: LoginRequestDto) => {
        console.log("here");
        const response = await login(data);
        handleLoginResponse(response);
    }, [handleLoginResponse]);

    const handleLogout = useCallback(async () => {
        if (!loggedIn) {
            return
        }
        await logout();
        localStorage.removeItem('user');
        setUser(null);
    }, [loggedIn]);

    useEffect(() => {
        async function initialize() {
            try {
                const userSessionItem = localStorage.getItem("user");
                if (!userSessionItem) {
                    return;
                }

                const userFromSession: UserInfo = JSON.parse(userSessionItem) as UserInfo;
                if (userFromSession.authTokenExpiration * 60_000 < Date.now()) {
                    await redeemToken(userFromSession.refreshToken);
                } else {
                    setUser(userFromSession);
                }
            } finally {
                setInitialized(true);
            }
        }
        initialize();
    }, [redeemToken]);

    useEffect(() => {
        if (!user) {
            return;
        }

        const timeRemaining = user.authTokenExpiration - Date.now();
        const timeDuration = timeRemaining - 60_000;
        const timeoutId = setTimeout(async () => {
            await redeemToken(user.refreshToken);
        }, timeDuration);

        return () => clearTimeout(timeoutId);
    }, [user, redeemToken]);

    const contextValue: UserContextModel = {
        userId: user ? user.userId : null,
        loggedIn,
        initialized,
        authError,
        handleLogin,
        handleLogout,
    }

    return (
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
    );
}