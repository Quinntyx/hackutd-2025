import React from "react"
import type { Car } from "../../../../model/data"

const placeholder = "https://www.motortrend.com/uploads/2023/09/2024-Toyota-Tundra-1794-Limited-Edition_001.jpg"

function fmtCurrency(n: number) {
  return n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 })
}

export default function CondensedCarCard({ car }: { car: Car }) {
  return (
    <div className="w-full bg-white shadow-sm rounded-md overflow-hidden flex items-center gap-4 p-3">
      <div className="w-24 flex-shrink-0">
        <img src={placeholder} alt={car.model} className="w-full h-16 object-cover rounded-md" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="font-medium truncate">{car.model}</div>
            <div className="text-sm text-gray-500">
              {car.year} • {car.transmission} • {car.fuelType} • {car.mileage.toLocaleString()} miles
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-lg font-bold text-emerald-600">{fmtCurrency(car.monthlyPayment)}/mo</div>
            <div className="text-sm text-gray-500">(12-month term)</div>
            <div className="text-xs text-gray-500">Est. daily gas: {fmtCurrency(car.estimatedDailyCost)}</div>
          </div>
        </div>
        
        <div className="mt-2 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Sticker: {fmtCurrency(car.stickerPrice)} • Down: {fmtCurrency(car.downPayment)}
          </div>
          <div className="flex gap-2">
            <button className="px-2 py-1 text-sm rounded bg-blue-600 text-white">View</button>
            <button className="px-2 py-1 text-sm rounded border border-gray-200">Contact</button>
          </div>
        </div>
      </div>
    </div>
  )
}
