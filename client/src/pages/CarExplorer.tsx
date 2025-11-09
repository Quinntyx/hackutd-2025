import React, { useEffect, useState } from "react"
import CarCard from "../components/toyota/CarCard"
import BannerCarCard from "../components/toyota/BannerCarCard"
import CondensedCarCard from "../components/toyota/CondensedCarCard"
import SearchResults from "../components/toyota/SearchResults"
import type { Car, SearchResult, FuelType, Transmission } from "../../../model/data"

function fmtCurrency(n: number) {
  return n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 })
}

type Filters = {
  priceTarget?: number
  pricePriority: number
  mpgTarget?: number
  mpgPriority: number
  transmission?: Transmission | ""
  transmissionPriority: number
  electric: boolean
  electricPriority: number
  mileageTarget?: number
  mileagePriority: number
  fuelType?: FuelType | ""
  fuelTypePriority: number
  city: string
  commuteDistance: number
}

export default function CarExplorer() {
  const [cars, setCars] = useState<Car[]>([]) // used when API returns array
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null) // used when API returns object
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [filters, setFilters] = useState<Filters>({
    pricePriority: 1,
    mpgPriority: 1,
    transmission: "",
    transmissionPriority: 1,
    electric: false,
    electricPriority: 1,
    mileagePriority: 1,
    fuelType: "",
    fuelTypePriority: 1,
    priceTarget: undefined,
    mpgTarget: undefined,
    mileageTarget: undefined,
    city: "",
    commuteDistance: 0,
  })

  useEffect(() => {
    // initial load
    fetchCars(filters)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function fetchCars(f: Filters) {
    setLoading(true)
    setError(null)
    setSearchResult(null)
    setCars([])

    const params = new URLSearchParams()

    if (typeof f.priceTarget === "number") params.set("priceTarget", String(f.priceTarget))
    params.set("pricePriority", String(f.pricePriority))

    if (typeof f.mpgTarget === "number") params.set("mpgTarget", String(f.mpgTarget))
    params.set("mpgPriority", String(f.mpgPriority))

    if (f.transmission) params.set("transmission", f.transmission)
    params.set("transmissionPriority", String(f.transmissionPriority))

    params.set("electric", String(f.electric))
    params.set("electricPriority", String(f.electricPriority))

    if (typeof f.mileageTarget === "number") params.set("mileageTarget", String(f.mileageTarget))
    params.set("mileagePriority", String(f.mileagePriority))

    if (f.fuelType) params.set("fuelType", f.fuelType)
    params.set("fuelTypePriority", String(f.fuelTypePriority))

    if (f.city) params.set("city", f.city)
    params.set("commuteDistance", String(f.commuteDistance))

    try {
      const res = await fetch(`/api/cars?${params.toString()}`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()

      if (Array.isArray(data)) {
        // fallback: array of cars — render full cards
        setCars(data as Car[])
        setSearchResult(null)
      } else if (data && typeof data === "object") {
        const sr = data as SearchResult
        // guard: ensure arrays exist
        const otherOptions = Array.isArray(sr.otherOptions) ? sr.otherOptions : []
        setSearchResult({
          bestFit: sr.bestFit,
          budgetPick: sr.budgetPick,
          luxuryPick: sr.luxuryPick,
          otherOptions
        })
        setCars([])
      } else {
        throw new Error("Unexpected response shape")
      }
    } catch (err) {
      setError(String(err))
    } finally {
      setLoading(false)
    }
  }

  function handleApply(e?: React.FormEvent) {
    e?.preventDefault()
    fetchCars(filters)
  }

  function handleReset() {
    const reset: Filters = {
      pricePriority: 1,
      mpgPriority: 1,
      transmission: "",
      transmissionPriority: 1,
      electric: false,
      electricPriority: 1,
      mileagePriority: 1,
      fuelType: "",
      fuelTypePriority: 1,
      priceTarget: undefined,
      mpgTarget: undefined,
      mileageTarget: undefined,
      city: "",
      commuteDistance: 0,
    }
    setFilters(reset)
    fetchCars(reset)
  }

  return (
    <div className="w-full min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-72 border-r border-gray-200 p-4 sticky top-0 h-screen">
        <form onSubmit={handleApply} className="space-y-4">
          <div>
            <label className="text-sm font-medium">City</label>
            <input
              className="mt-1 w-full rounded border px-2 py-1"
              value={filters.city}
              onChange={(e) => setFilters((s) => ({ ...s, city: e.target.value }))}
              placeholder="e.g. Austin"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Commute Distance (miles)</label>
            <input
              type="number"
              className="mt-1 w-full rounded border px-2 py-1"
              value={filters.commuteDistance}
              onChange={(e) => setFilters((s) => ({ ...s, commuteDistance: Number(e.target.value || 0) }))}
              min={0}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Price Target ($)</label>
            <input
              type="range"
              className="mt-1 w-full accent-red-600"
              min={2000}
              max={40000}
              step={1000}
              value={filters.priceTarget ?? 20000}
              onChange={(e) => setFilters((s) => ({ ...s, priceTarget: Number(e.target.value) }))}
            />
            <div className="mt-1 flex justify-between text-sm text-gray-500">
              <span>{fmtCurrency(filters.priceTarget ?? 20000)}</span>
              <span>$2k - $40k</span>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">MPG Target</label>
            <input
              type="number"
              className="mt-1 w-full rounded border px-2 py-1"
              value={filters.mpgTarget ?? ""}
              onChange={(e) => setFilters((s) => ({ ...s, mpgTarget: e.target.value === "" ? undefined : Number(e.target.value) }))}
              min={0}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Transmission</label>
            <select
              className="mt-1 w-full rounded border px-2 py-1"
              value={filters.transmission}
              onChange={(e) => setFilters((s) => ({ ...s, transmission: e.target.value as Transmission | "" }))}
            >
              <option value="">Any</option>
              <option value="Manual">Manual</option>
              <option value="Automatic">Automatic</option>
              <option value="Semi-Auto">Semi-Auto</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Electric</label>
            <div className="mt-1 flex items-center gap-2">
              <input
                id="electric"
                type="checkbox"
                checked={filters.electric}
                onChange={(e) => setFilters((s) => ({ ...s, electric: e.target.checked }))}
              />
              <label htmlFor="electric" className="text-sm">Only electric</label>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Mileage Target (mi)</label>
            <input
              type="number"
              className="mt-1 w-full rounded border px-2 py-1"
              value={filters.mileageTarget ?? ""}
              onChange={(e) => setFilters((s) => ({ ...s, mileageTarget: e.target.value === "" ? undefined : Number(e.target.value) }))}
              min={0}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Fuel Type</label>
            <select
              className="mt-1 w-full rounded border px-2 py-1"
              value={filters.fuelType}
              onChange={(e) => setFilters((s) => ({ ...s, fuelType: e.target.value as FuelType | "" }))}
            >
              <option value="">Any</option>
              <option value="Gasoline">Gasoline</option>
              <option value="Diesel">Diesel</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Other">Other</option>
            </select>
          </div>

            <div className="flex gap-2 pt-2 absolute bottom-2 left-2 right-2">
            <button type="button" onClick={handleReset} className="px-3 py-2 rounded border">Reset</button>
            <button type="submit" className="flex-1 px-3 py-2 rounded bg-red-600 text-white">Apply</button>
            </div>
        </form>
      </aside>
      
      {/* Results */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4 max-w-3xl mx-auto">
        {error && <div className="p-3 rounded bg-red-50 text-red-700 border border-red-100">Error: {error}</div>}

        {loading ? (
          <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="w-full bg-white shadow-sm rounded-lg overflow-hidden flex flex-row gap-4 p-4 items-stretch animate-pulse">
            <div className="w-44 flex-shrink-0">
          <div className="w-full h-28 sm:h-36 bg-gray-200 rounded-md" />
            </div>

            <div className="flex-1 flex flex-col">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="h-5 w-48 bg-gray-200 rounded" />
              <div className="h-4 w-32 bg-gray-200 rounded" />
            </div>

            <div className="text-right space-y-2">
              <div className="h-7 w-24 bg-gray-200 rounded ml-auto" />
              <div className="h-4 w-28 bg-gray-200 rounded" />
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <div className="h-3 w-24 bg-gray-200 rounded" />
              <div className="h-4 w-20 bg-gray-200 rounded" />
            </div>
            <div className="space-y-2">
              <div className="h-3 w-24 bg-gray-200 rounded" />
              <div className="h-4 w-20 bg-gray-200 rounded" />
            </div>

            <div className="space-y-2">
              <div className="h-3 w-24 bg-gray-200 rounded" />
              <div className="h-4 w-20 bg-gray-200 rounded" />
            </div>
            <div className="space-y-2">
              <div className="h-3 w-24 bg-gray-200 rounded" />
              <div className="h-4 w-20 bg-gray-200 rounded" />
            </div>
          </div>

          <div className="mt-auto pt-3 flex items-center justify-between">
            <div className="h-4 w-24 bg-gray-200 rounded" />
            <div className="flex gap-2">
              <div className="h-8 w-20 bg-gray-200 rounded" />
              <div className="h-8 w-20 bg-gray-200 rounded" />
            </div>
          </div>
            </div>
          </div>
        ))}
          </div>
        ) : (
          <SearchResults searchResult={searchResult} cars={cars} />
        )}
      </main>
    </div>
  )
}
