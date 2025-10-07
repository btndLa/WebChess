import type { GameDto } from "@/types/GameDto";
import { get } from "@/api/client/http";

export async function getGame(id: string): Promise<GameDto> {
    return await get<GameDto>(`game/${id}`)
}