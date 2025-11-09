import React, { useEffect, useState } from "react"
import CarCard from "../components/toyota/CarCard"
import type { Car, SearchResult, FuelType, Transmission } from "../../../model/data"

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
  const [cars, setCars] = useState<Car[]>([])
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

      let list: Car[] = []
      if (Array.isArray(data)) {
        list = data
      } else if (data && typeof data === "object") {
        const sr = data as Partial<SearchResult>
        const candidates: (Car | undefined)[] = [
          sr.bestFit,
          sr.budgetPick,
          sr.luxuryPick,
          ...(sr.otherOptions ?? []),
        ]
        list = candidates.filter(Boolean) as Car[]
      } else {
        throw new Error("Unexpected response shape")
      }

      setCars(list)
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

  if (loading) return <div className="p-6">Loading cars…</div>
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>

  return (
    <div className="w-full h-[80vh] flex">
      {/* Sidebar */}
      <aside className="w-72 border-r border-gray-200 p-4 overflow-y-auto">
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
              type="number"
              className="mt-1 w-full rounded border px-2 py-1"
              value={filters.priceTarget ?? ""}
              onChange={(e) => setFilters((s) => ({ ...s, priceTarget: e.target.value === "" ? undefined : Number(e.target.value) }))}
              placeholder="max sticker price"
              min={0}
            />
            <div className="mt-1 flex items-center gap-2 text-sm">
              <span>Priority</span>
              <select
                value={filters.pricePriority}
                onChange={(e) => setFilters((s) => ({ ...s, pricePriority: Number(e.target.value) }))}
                className="ml-auto rounded border px-2 py-1"
              >
                <option value={1}>1 (low)</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5 (high)</option>
              </select>
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
            <div className="mt-1 flex items-center gap-2 text-sm">
              <span>Priority</span>
              <select
                value={filters.mpgPriority}
                onChange={(e) => setFilters((s) => ({ ...s, mpgPriority: Number(e.target.value) }))}
                className="ml-auto rounded border px-2 py-1"
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
              </select>
            </div>
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
            <div className="mt-1 text-sm flex items-center gap-2">
              <span>Priority</span>
              <select
                value={filters.transmissionPriority}
                onChange={(e) => setFilters((s) => ({ ...s, transmissionPriority: Number(e.target.value) }))}
                className="ml-auto rounded border px-2 py-1"
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
              </select>
            </div>
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
              <select
                value={filters.electricPriority}
                onChange={(e) => setFilters((s) => ({ ...s, electricPriority: Number(e.target.value) }))}
                className="ml-auto rounded border px-2 py-1 text-sm"
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
              </select>
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
            <div className="mt-1 text-sm flex items-center gap-2">
              <span>Priority</span>
              <select
                value={filters.mileagePriority}
                onChange={(e) => setFilters((s) => ({ ...s, mileagePriority: Number(e.target.value) }))}
                className="ml-auto rounded border px-2 py-1"
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
              </select>
            </div>
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
            <div className="mt-1 text-sm flex items-center gap-2">
              <span>Priority</span>
              <select
                value={filters.fuelTypePriority}
                onChange={(e) => setFilters((s) => ({ ...s, fuelTypePriority: Number(e.target.value) }))}
                className="ml-auto rounded border px-2 py-1"
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button type="submit" className="flex-1 px-3 py-2 rounded bg-blue-600 text-white">Apply</button>
            <button type="button" onClick={handleReset} className="px-3 py-2 rounded border">Reset</button>
          </div>
        </form>
      </aside>

      {/* Results */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {cars.length === 0 ? (
          <div className="text-gray-500">No vehicles found.</div>
        ) : (
          cars.map((c, idx) => (
            <div key={`${c.model}-${c.year}-${idx}`} className="w-full">
              <CarCard car={c} />
            </div>
          ))
        )}
      </main>
    </div>
  )
}
