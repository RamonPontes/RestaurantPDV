export interface UserResponseDTO {
    id: number,
    name: string,
    role: UserRoleEnum,
    createdAt: string,
    updatedAt: string
}

export enum UserRoleEnum {
    ADMIN,
    MANAGER
}