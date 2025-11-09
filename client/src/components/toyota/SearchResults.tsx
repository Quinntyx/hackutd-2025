import React from "react"
import type { Car, SearchResult } from "../../../../model/data"
import BannerCarCard from "./BannerCarCard"
import CarCard from "./CarCard"
import CondensedCarCard from "./CondensedCarCard"

type Props = {
  searchResult: SearchResult | null
  cars: Car[]
}

export default React.memo(function SearchResults({ searchResult, cars }: Props) {
  if (searchResult) {
    return (
      <div className="space-y-4">
        {searchResult.bestFit && <BannerCarCard car={searchResult.bestFit} />}

        <div className="grid gap-4">
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
          <>
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
          </>
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
}, (prevProps, nextProps) => {
  // Custom comparison to prevent unnecessary re-renders
  if (prevProps.cars.length !== nextProps.cars.length) return false
  if (!!prevProps.searchResult !== !!nextProps.searchResult) return false
  if (prevProps.searchResult && nextProps.searchResult) {
    if (prevProps.searchResult.bestFit?.model !== nextProps.searchResult.bestFit?.model) return false
    if (prevProps.searchResult.otherOptions.length !== nextProps.searchResult.otherOptions.length) return false
  }
  return true
})
