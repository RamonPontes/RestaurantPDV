import { UserResponseDTO } from "./user.types";

export interface LoginRequest {
    name: string;
    password: string;
}

export interface LoginResponse {
    auth: TokenResponseDTO,
    user: UserResponseDTO
}

export interface TokenResponseDTO {
    accessToken: string,
    tokenType: string
}