import { ProductResponseDTO } from "./product.type"
import { TabResponseDTO } from "./tab.types"
import { UserResponseDTO } from "./user.types"

export interface OrderResponseDTO {
    id: number
    // tab: TabResponseDTO,
    user: UserResponseDTO,
    products: ProductsData[],
    value: number,
    created_at: number,
    updated_at: number,
    finished_at: number
}

interface ProductsData {
    amount: number,
    product: ProductResponseDTO,
    note: string
}