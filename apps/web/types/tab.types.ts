import { ConsumerResponseDTO } from "./consumer.types"
import { OrderResponseDTO } from "./order.types"

export interface TabResponseDTO {
    id: number
    consumer: ConsumerResponseDTO,
    value: number,
    orders?: OrderResponseDTO[],
    created_at: number,
    updated_at: number,
    finished_at: number
}