import React, { useEffect, useState } from "react"
import SearchResults from "../components/toyota/SearchResults"
import type { Car, SearchResult, FuelType, Transmission } from "../../../model/data"
import type { CompoundFilter } from "../../../model/filter"
import toyotalogo from "@/assets/toyota/toyotalogo.png"

function fmtCurrency(n: number) {
  return n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 })
}

interface CarExplorerProps {
  initialFilters?: CompoundFilter;
}

export default function CarExplorer({ initialFilters }: CarExplorerProps = {}) {
  const [cars, setCars] = useState<Car[]>([]) // used when API returns array
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null) // used when API returns object
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refinementQuery, setRefinementQuery] = useState("")
  const [refining, setRefining] = useState(false)

  type LeaseTerm = '1' | '3' | '6' | '12' | '24';
  const [purchaseType, setPurchaseType] = useState<'buy' | 'lease'>('buy')
  const [leaseTerm, setLeaseTerm] = useState<LeaseTerm>('12')
  const [filters, setFilters] = useState<CompoundFilter>(initialFilters ?? {
    pricePriority: 5,
    mpgPriority: 5,
    transmission: undefined,
    transmissionPriority: 5,
    electric: false,
    electricPriority: 5,
    mileagePriority: 5,
    fuelType: undefined,
    fuelTypePriority: 5,
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

  async function fetchCars(f: CompoundFilter) {
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
    const reset: CompoundFilter = {
      pricePriority: 5,
      mpgPriority: 5,
      transmission: undefined,
      transmissionPriority: 5,
      electric: false,
      electricPriority: 5,
      mileagePriority: 5,
      fuelType: undefined,
      fuelTypePriority: 5,
      priceTarget: undefined,
      mpgTarget: undefined,
      mileageTarget: undefined,
      city: "",
      commuteDistance: 0,
    }
    setFilters(reset)
    fetchCars(reset)
  }

  async function handleRefine(e?: React.FormEvent) {
    e?.preventDefault()
    if (!refinementQuery.trim()) return
    
    setRefining(true)
    setError(null)
    
    try {
      const res = await fetch('/api/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          refinementQuery: refinementQuery.trim(),
          currentFilters: filters
        })
      })
      
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      
      const updatedFilters = await res.json() as CompoundFilter
      setFilters(updatedFilters)
      setRefinementQuery("") // Clear the input
      fetchCars(updatedFilters)
    } catch (err) {
      setError(`Refinement failed: ${String(err)}`)
    } finally {
      setRefining(false)
    }
  }

  // Calculate lease adjustments based on term
  const getLeaseAdjustments = (term: LeaseTerm) => {
    switch (term) {
      case '1': return { monthlyMultiplier: 0.7, depositMultiplier: 1.2 };
      case '3': return { monthlyMultiplier: 0.6, depositMultiplier: 1.0 };
      case '6': return { monthlyMultiplier: 0.55, depositMultiplier: 0.85 };
      case '12': return { monthlyMultiplier: 0.5, depositMultiplier: 0.7 };
      case '24': return { monthlyMultiplier: 0.25, depositMultiplier: 0.5 };
      default: return { monthlyMultiplier: 0.5, depositMultiplier: 0.7 };
    }
  };

  // Adjust car prices based on purchase type and lease term
  const adjustCarForPurchaseType = (car: Car): Car => {
    if (purchaseType === 'buy') return car;
    
    const { monthlyMultiplier, depositMultiplier } = getLeaseAdjustments(leaseTerm);
    
    return {
      ...car,
      downPayment: car.downPayment * depositMultiplier,
      monthlyPayment: car.monthlyPayment * monthlyMultiplier,
      // Add lease-specific fields
      isLease: true,
      leaseTerm: parseInt(leaseTerm)
    };
  };

  // Adjust search results for purchase type
  const adjustSearchResult = (result: SearchResult | null): SearchResult | null => {
    if (!result) return null;
    
    return {
      bestFit: adjustCarForPurchaseType(result.bestFit),
      budgetPick: adjustCarForPurchaseType(result.budgetPick),
      luxuryPick: adjustCarForPurchaseType(result.luxuryPick),
      otherOptions: result.otherOptions?.map(adjustCarForPurchaseType) || []
    };
  };

  return (
    <div className="w-full min-h-screen">
      {/* NAV */}
      <header className="w-full border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={toyotalogo} className="h-8 w-auto" alt="Toyota" />
            <span className="font-extrabold text-xl tracking-wider">TOYOTA</span>
          </div>

          <nav className="flex items-center gap-6 text-sm font-medium text-[#2D2D2D]">
            <a href="/" className="hover:text-[#EB0A1E] cursor-pointer">Home</a>
            <span className="text-[#EB0A1E] font-semibold">Car Explorer</span>
          </nav>
        </div>
      </header>

      <div className="w-full flex">
        {/* Sidebar */}
        <form onSubmit={handleApply} className="w-72 border-r border-gray-200 p-4 sticky top-[73px] h-[calc(100vh-73px)] overflow-y-auto">
          {/* Purchase Type Toggle */}
          <div className="mb-6 space-y-3">
            <div className="flex rounded-md shadow-sm" role="group">
              <button
                type="button"
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-l-lg border ${
                  purchaseType === 'buy' 
                    ? 'bg-[#EB0A1E] text-white border-[#EB0A1E]' 
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => setPurchaseType('buy')}
              >
                Buy
              </button>
              <button
                type="button"
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-r-lg border ${
                  purchaseType === 'lease' 
                    ? 'bg-[#EB0A1E] text-white border-[#EB0A1E]' 
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => setPurchaseType('lease')}
              >
                Lease
              </button>
            </div>
            
            {purchaseType === 'lease' && (
              <div className="space-y-2">
                <label htmlFor="lease-term" className="block text-sm font-medium text-gray-700">
                  Lease Term
                </label>
                <select
                  id="lease-term"
                  value={leaseTerm}
                  onChange={(e) => setLeaseTerm(e.target.value as LeaseTerm)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#EB0A1E] focus:border-[#EB0A1E] sm:text-sm rounded-md"
                >
                  <option value="1">1 Month</option>
                  <option value="3">3 Months</option>
                  <option value="6">6 Months</option>
                  <option value="12">12 Months</option>
                  <option value="24">24 Months</option>
                </select>
              </div>
            )}
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
              onChange={(e) => setFilters((s) => ({ ...s, transmission: e.target.value === "" ? undefined : (e.target.value as Transmission) }))}
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
              onChange={(e) => setFilters((s) => ({ ...s, fuelType: e.target.value === "" ? undefined : (e.target.value as FuelType) }))}
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
      
      {/* Results */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {error && <div className="p-3 rounded bg-red-50 text-red-700 border border-red-100">Error: {error}</div>}

          {loading ? (
          <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="w-full bg-white shadow-sm rounded-lg overflow-hidden flex flex-row gap-4 p-4 items-stretch animate-pulse">
            <div className="w-44 shrink-0">
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
          <SearchResults 
            searchResult={searchResult ? adjustSearchResult(searchResult) : null} 
            cars={purchaseType === 'lease' ? cars.map(adjustCarForPurchaseType) : cars}
            refinementQuery={refinementQuery}
            setRefinementQuery={setRefinementQuery}
            onRefine={handleRefine}
            refining={refining}
            purchaseType={purchaseType}
          />
        )}
      </main>
      </div>
    </div>
  )
}
