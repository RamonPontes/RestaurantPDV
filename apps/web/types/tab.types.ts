import { ConsumerResponseDTO } from "./consumer.types"
import { OrderResponseDTO } from "./order.types"

export interface TabResponseDTO {
    id: number
    consumer: ConsumerResponseDTO,
    value: number,
    orders?: OrderResponseDTO[],
    serviceCharge: boolean,
    paymentMethod: PaymentMethods,
    createdAt: number,
    updatedAt: number,
    finishedAt: number
}

export interface RegisterTabRequestDTO {
    consumerName: string,
    consumerTelephone: string,
    tabNumber: number
}

export interface FinishTabRequestDTO {
    serviceCharge: boolean,
    paymentMethod: PaymentMethods
}

export enum PaymentMethods {
    PIX,
    CARTAO,
    DINHEIRO
}