import { DefaultResponse } from "@/types/api.types";

const API_URL = "http://localhost:8080"

export class ApiError extends Error {
    status: number;

    constructor(message: string, status: number) {
        super(message);
        this.name = "ApiError";
        this.status = status;
    }
}

export async function apiRequest<T>(
    endpoint: string,
    options?: RequestInit
): Promise<DefaultResponse<T>> {
    const headers = new Headers(options?.headers);

    headers.set("Content-Type", "application/json");

    const accessToken = localStorage.getItem("accessToken");
    const tokenType = localStorage.getItem("tokenType") || "Bearer";

    if (accessToken != null) {
        headers.set("Authorization", `${tokenType} ${accessToken}`);
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    const body: DefaultResponse<T> = await response
        .json()
        .catch(() => ({}));

    if (!response.ok) {
        if (
            response.status === 401 &&
            body.details?.code === "INVALID_ACCESS_TOKEN"
        ) {
            localStorage.removeItem("role");
            localStorage.removeItem("accessToken");
            localStorage.removeItem("tokenType");

            window.location.href = "/";
        }

        throw new ApiError(
            body.message || "Erro ao realizar requisição",
            response.status
        );
    }

    return body;
}