import { HubConnectionBuilder, LogLevel, HubConnection, IHttpConnectionOptions } from "@microsoft/signalr";
import type { GameResponseDto } from "@/api/models/GameResponseDto";
import { get, postAsJson, postAsJsonWithoutResponse } from "@/api/client/http";
import { accessTokenFactory } from "@/signalR/accessTokenFactory";

export async function getGame(id: string): Promise<GameResponseDto | null> {
    return await get<GameResponseDto | null>(`game/${id}`);
}

export async function getActiveGame(): Promise<GameResponseDto | null> {
    return await get<GameResponseDto | null>("game/active");
}

export async function createGame(): Promise<GameResponseDto> {
    return await postAsJson<undefined, GameResponseDto>("game/create");
}

export function initSignalRConnection(): HubConnection {
    const connection = new HubConnectionBuilder()
        .withUrl(`${import.meta.env.VITE_APP_SIGNALR_BASEURL}/chessHub`, {
            accessTokenFactory: accessTokenFactory
        } as IHttpConnectionOptions)
        .withAutomaticReconnect()
        .configureLogging(LogLevel.Warning)
        .build();

    return connection;
}

export async function endGame(gameId: string, winner: string) : Promise<void> {
    return await postAsJsonWithoutResponse<{ gameId: string, winner: string }>("game/end", { gameId, winner });
}
