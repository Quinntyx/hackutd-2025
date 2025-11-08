export type Car = {
  model: string
  stickerPrice: number
  downPayment: number
  monthlyPayment: number
  transmission: Transmission
  mileage: number
  fuelType: FuelType
  mpg: number
  engineSize: number
  estimatedDailyCost: number
}

export type FuelType = "Gasoline" | "Diesel" | "Hybrid" | "Other"

export type Transmission = "Manual" | "Automatic" | "Semi-Auto"
