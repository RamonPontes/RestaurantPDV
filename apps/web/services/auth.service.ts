import { LoginRequest, LoginResponse } from "@/types/auth.types";
import { apiRequest } from "./api.service";


export async function userLogin(
    data: LoginRequest
): Promise<LoginResponse> {
    const response = await apiRequest<LoginResponse>(
        "/auth/login",
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

    localStorage.setItem("role", response.data.user.role.toString())
    localStorage.setItem("accessToken", response.data.auth.accessToken);
    localStorage.setItem("tokenType", response.data.auth.tokenType);

    return response.data;
}