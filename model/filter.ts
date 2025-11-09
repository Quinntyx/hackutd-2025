import { FuelType, Transmission } from "./data"

export type CompoundFilter = {
    priceTarget?: number
    pricePriority: number
    mpgTarget?: number
    mpgPriority: number
    transmission?: Transmission
    transmissionPriority: number
    electric?: boolean
    electricPriority: number
    mileageTarget?: number
    mileagePriority: number
    fuelType?: FuelType | undefined
    fuelTypePriority: number
    city: string
}