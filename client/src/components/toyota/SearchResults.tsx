import React from "react"
import type { Car, SearchResult } from "../../../../model/data"
import BannerCarCard from "./BannerCarCard"
import CarCard from "./CarCard"
import CondensedCarCard from "./CondensedCarCard"

interface Props {
  searchResult: SearchResult | null
  cars: Car[]
  refinementQuery: string
  setRefinementQuery: (query: string) => void
  onRefine: (e?: React.FormEvent) => Promise<void>
  refining: boolean
  purchaseType: 'buy' | 'lease'
}

function SearchResults({ searchResult, cars, refinementQuery, setRefinementQuery, onRefine, refining, purchaseType }: Props) {
  if (searchResult) {
    return (
      <div className="space-y-4">
        {/* Refinement Bar */}
        {searchResult.bestFit && setRefinementQuery && onRefine && (
          <div className="max-w-4xl mx-auto">
            <form onSubmit={onRefine} className="flex gap-2 mb-4">
              <input
                type="text"
                value={refinementQuery ?? ""}
                onChange={(e) => setRefinementQuery(e.target.value)}
                placeholder="Not satisfied? Enter a refinement query here"
                disabled={refining}
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              <button
                type="submit"
                disabled={refining || !refinementQuery?.trim()}
                className="px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {refining ? "Refining..." : "Refine"}
              </button>
            </form>
          </div>
        )}
        
        {searchResult.bestFit && (
          <div className="max-w-4xl mx-auto">
            <BannerCarCard car={searchResult.bestFit} />
          </div>
        )}

        <div className="grid gap-4 max-w-3xl mx-auto">
          {searchResult.budgetPick && (
            <div>
              <h3 className="text-sm text-gray-500 mb-2">Budget pick</h3>
              <CarCard car={searchResult.budgetPick} />
            </div>
          )}
          {searchResult.luxuryPick && (
            <div>
              <h3 className="text-sm text-gray-500 mb-2">Luxury pick</h3>
              <CarCard car={searchResult.luxuryPick} />
            </div>
          )}
        </div>

        {searchResult.otherOptions && searchResult.otherOptions.length > 0 && (
          <div className="max-w-3xl mx-auto">
            <h3 className="text-lg font-medium text-gray-900 mt-8 mb-4">Other Matches</h3>
            <div className="space-y-3">
              {/* Only render what's visible in the viewport */}
              {searchResult.otherOptions.slice(0, 20).map((c, idx) => (
                <CondensedCarCard key={`${c.model}-${c.year}-${idx}`} car={c} />
              ))}
              {searchResult.otherOptions.length > 20 && (
                <div className="text-sm text-gray-500 text-center py-2">
                  + {searchResult.otherOptions.length - 20} more matches
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }

  if (cars.length === 0) {
    return <div className="text-gray-500">No vehicles found.</div>
  }

  return (
    <>
      {cars.map((c, idx) => (
        <div key={`${c.model}-${c.year}-${idx}`} className="w-full">
          <CarCard car={c} />
        </div>
      ))}
    </>
  )
}

export default SearchResults
