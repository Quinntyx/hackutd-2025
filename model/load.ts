import { FuelType, Transmission } from "./data"

export type CarCsvEntry = {
    model: string
    year: number
    price: number
    transmission: Transmission
    mileage: number
    fuelType: FuelType
    mpg: number
    engineSize: number
}