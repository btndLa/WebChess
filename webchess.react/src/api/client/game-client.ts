import { HubConnectionBuilder, LogLevel, HubConnection, IHttpConnectionOptions } from "@microsoft/signalr";
import type { GameDto } from "@/types/GameDto";
import { get } from "@/api/client/http";
import { accessTokenFactory } from "@/signalR/accessTokenFactory";

export async function getGame(id: string): Promise<GameDto> {
    return await get<GameDto>(`game/${id}`);
}

export function initSignalRConnection(): HubConnection {
    const connection = new HubConnectionBuilder()
        .withUrl(`${import.meta.env.VITE_APP_SIGNALR_BASEURL}/chessHub`, {
            accessTokenFactory: accessTokenFactory
        } as IHttpConnectionOptions)
        .withAutomaticReconnect()
        .configureLogging(LogLevel.Information)
        .build();

    console.log("inside hub connection:", connection)
    return connection;
}