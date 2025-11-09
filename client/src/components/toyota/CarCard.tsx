import React from "react"
import type { Car } from "../../../../model/data"

type Props = {
  car: Car
}

const placeholder = "https://www.motortrend.com/uploads/2023/09/2024-Toyota-Tundra-1794-Limited-Edition_001.jpg"

function fmtCurrency(n: number) {
  return n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 })
}

export default function CarCard({ car }: Props) {
  const {
    model,
    year,
    stickerPrice,
    downPayment,
    monthlyPayment,
    transmission,
    mileage,
    fuelType,
    mpg,
    engineSize,
    estimatedDailyCost,
    score,
  } = car

  return (
    <div className="w-full bg-white shadow-sm rounded-lg overflow-hidden flex flex-row gap-4 p-3 items-stretch">
      {/* image (left) */}
      <div className="w-56 sm:w-64 flex-shrink-0">
        <img
          src={placeholder}
          alt={model}
          className="w-full h-24 sm:h-28 object-cover rounded-md"
        />
      </div>

      {/* content (right) */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold leading-tight">{model}</h3>
            <p className="text-sm text-gray-500">{year} • {transmission} • {fuelType}</p>
          </div>

          <div className="text-right">
            <div className="text-2xl font-extrabold text-emerald-600">
              {fmtCurrency(monthlyPayment)}/mo
            </div>
            <div className="text-sm text-gray-500">(12-month term)</div>
            <div className="text-sm text-gray-500">Est. daily gas: {fmtCurrency(estimatedDailyCost)}</div>
          </div>
        </div>

        <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-gray-700">
          <div>
            <div className="text-xs text-gray-400">Sticker Price</div>
            <div>{fmtCurrency(stickerPrice)}</div>
          </div>
          <div>
            <div className="text-xs text-gray-400">Down Payment</div>
            <div>{fmtCurrency(downPayment)}</div>
          </div>

          <div>
            <div className="text-xs text-gray-400">Mileage</div>
            <div>{mileage.toLocaleString()} mi</div>
          </div>
          <div>
            <div className="text-xs text-gray-400">MPG</div>
            <div>{mpg} mpg</div>
          </div>

          <div>
            <div className="text-xs text-gray-400">Engine</div>
            <div>{engineSize} L</div>
          </div>
          <div>
            <div className="text-xs text-gray-400">Score</div>
            <div className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-gray-800 text-sm font-medium">
              {score}
            </div>
          </div>
        </div>

        <div className="mt-auto pt-2 flex items-center justify-between">
          <div />
          <div className="flex gap-2">
            <button className="px-3 py-1 rounded-md bg-red-600 text-white text-sm hover:bg-red-700">View</button>
            <button className="px-3 py-1 rounded-md border border-gray-200 text-sm">Contact</button>
          </div>
        </div>
      </div>
    </div>
  )
}
