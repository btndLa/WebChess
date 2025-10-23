import { HubConnectionBuilder, LogLevel, HubConnection, IHttpConnectionOptions } from "@microsoft/signalr";
import type { GameResponseDto } from "@/api/models/GameResponseDto";
import { get, postAsJson, postAsJsonWithoutResponse } from "@/api/client/http";
import { accessTokenFactory } from "@/signalR/accessTokenFactory";

export async function getGame(id: string): Promise<GameResponseDto> {
    return await get<GameResponseDto>(`game/${id}`);
}

export async function createGame(): Promise<GameResponseDto> {
    return await postAsJson<undefined, GameResponseDto>("game/create"); // TODO might need to adjust return types
}

export function initSignalRConnection(): HubConnection {
    const connection = new HubConnectionBuilder()
        .withUrl(`${import.meta.env.VITE_APP_SIGNALR_BASEURL}/chessHub`, {
            accessTokenFactory: accessTokenFactory
        } as IHttpConnectionOptions)
        .withAutomaticReconnect()
        .configureLogging(LogLevel.Information)
        .build();

    return connection;
}

export async function endGame(gameId: string) : Promise<void> {
    return await postAsJsonWithoutResponse<{ gameId: string }>("game/end", { gameId }); //TODO error here
}
