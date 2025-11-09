export type Car = {
  model: string
  year: number
  stickerPrice: number
  downPayment: number
  monthlyPayment: number
  transmission: Transmission
  mileage: number
  fuelType: FuelType
  mpg: number
  engineSize: number
  estimatedDailyCost: number
  score: number
}

export type FuelType = "Gasoline" | "Diesel" | "Hybrid" | "Other"

export type Transmission = "Manual" | "Automatic" | "Semi-Auto"

export type CompoundPricing = {
  gasoline: number
  diesel: number
  electric: number
}

export type SearchResult = {
    bestFit: Car;
    budgetPick: Car;
    luxuryPick: Car;
    otherOptions: Car[];
}
