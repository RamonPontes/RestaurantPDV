import { ProductResponseDTO } from "./product.type"
import { TabResponseDTO } from "./tab.types"
import { UserResponseDTO } from "./user.types"

export interface OrderResponseDTO {
    id: number
    tab?: TabResponseDTO,
    user: UserResponseDTO,
    products: Map<ProductResponseDTO, number>,
    value: number,
    status: OrderStatusEnum,
    createdAt: number,
    updatedAt: number,
    finishedAt: number
}


export enum OrderStatusEnum {
    CREATED,
    PREPARING,
    FINISHED
}