import { apiRequest } from "./api.service";
import { UserResponseDTO } from "@/types/user.types";

export async function getMe(): Promise<UserResponseDTO> {
    const response = await apiRequest<UserResponseDTO>(
        "/auth/me",
        {
            method: "get",
        }
    );

    if (response.data === null) {
        throw new Error(
            "Erro ao realizar requisição"
        );
    }

    return response.data;
}