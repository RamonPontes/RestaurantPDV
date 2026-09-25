import { RegisterTabRequestDTO, TabResponseDTO } from "@/types/tab.types";
import { apiRequest } from "./api.service";

export async function registerNewTab(
    data: RegisterTabRequestDTO
): Promise<TabResponseDTO> {
    const response = await apiRequest<TabResponseDTO>(
        "/tab/",
        {
            method: "POST",
            body: JSON.stringify(data),
        }
    );

    if (response.data === null) {
        throw new Error(
            "Erro ao realizar requisição"
        );
    }

    return response.data;
}

export async function getAllTabs(): Promise<TabResponseDTO[]> {
    const response = await apiRequest<TabResponseDTO[]>(
        "/tab/"
    );

    if (response.data === null) {
        throw new Error(
            "Erro ao realizar requisição"
        );
    }

    return response.data;
}