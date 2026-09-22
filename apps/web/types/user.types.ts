export interface UserResponseDTO {
    id: number,
    name: string,
    role: UserRoleEnum,
    created_at: string,
    updated_at: string
}

export enum UserRoleEnum {
    ADMIN,
    MANAGER
}