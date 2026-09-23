import { ProductResponseDTO } from "./product.type"
import { TabResponseDTO } from "./tab.types"
import { UserResponseDTO } from "./user.types"

export interface OrderResponseDTO {
    id: number
    tab: TabResponseDTO,
    user: UserResponseDTO,
    products: Record<string, ProductResponseDTO>,
    value: number,
    status: OrderStatusEnum,
    created_at: number,
    updated_at: number,
    finished_at: number
}


export enum OrderStatusEnum {
    CREATED,
    PREPARING,
    FINISHED
}