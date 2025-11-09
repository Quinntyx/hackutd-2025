import React from "react"
import type { Car } from "../../../../model/data"

const placeholder = "https://www.motortrend.com/uploads/2023/09/2024-Toyota-Tundra-1794-Limited-Edition_001.jpg"

function fmtCurrency(n: number) {
  return n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 })
}

export default function BannerCarCard({ car }: { car: Car }) {
  return (
    <div className="w-full rounded-lg overflow-hidden relative shadow-lg">
      {/* crown badge */}
      <div className="absolute z-20 left-4 top-4 flex items-center gap-2 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full shadow-sm">
        <span className="text-lg">👑</span>
        <span className="text-sm font-semibold">Best match</span>
      </div>

      {/* image banner */}
      <div className="relative h-64 sm:h-80 w-full">
        <img
          src={placeholder}
          alt={car.model}
          className="w-full h-full object-cover"
        />

        {/* gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />

        {/* overlayed text */}
        <div className="absolute bottom-4 left-6 right-6 z-30 text-white">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold leading-snug">{car.model}</h2>
              <p className="text-sm sm:text-base text-white/80 mt-1">
                {car.year} • {car.transmission} • {car.fuelType} • {car.mileage.toLocaleString()} miles
              </p>
            </div>

            <div className="text-right">
              <div className="text-3xl sm:text-4xl font-extrabold">{fmtCurrency(car.monthlyPayment)}/mo</div>
              <div className="text-base text-white/70">Down: {fmtCurrency(car.downPayment)}</div>
              <div className="text-sm text-white/70">(12-month term)</div>
              <div className="text-sm text-white/70 mt-1">Est. daily gas: {fmtCurrency(car.estimatedDailyCost)}</div>
            </div>
          </div>

          {/* action buttons */}
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-white text-black rounded-md font-medium shadow-sm">View details</button>
            <button className="px-4 py-2 bg-white/20 text-white rounded-md font-medium border border-white/30">Contact dealer</button>
          </div>
        </div>
      </div>
    </div>
  )
}
