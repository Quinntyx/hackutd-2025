// src/components/toyota/VehicleInventory.tsx
import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Row = {
  model: string;
  year: number;
  price: number;
  transmission?: string;
  mileage?: number;
  fuelType?: string;
  mpg?: number | string;
  engineSize?: number | string; // liters or string trim note if needed
};

// --- Hardcoded U.S. lineup (mixed mainstream + GR) ---
const INVENTORY: Row[] = [
  { model: "GR86 Premium", year: 2024, price: 31995, transmission: "Manual", mileage: 120, fuelType: "Gasoline", mpg: "22/31", engineSize: 2.4 },
  { model: "GR Supra 3.0", year: 2024, price: 56995, transmission: "Automatic", mileage: 85, fuelType: "Gasoline", mpg: "23/31", engineSize: 3.0 },
  { model: "Camry XSE", year: 2025, price: 35990, transmission: "Automatic", mileage: 15, fuelType: "Hybrid", mpg: "50+", engineSize: "Hybrid" },
  { model: "RAV4 Hybrid XSE", year: 2025, price: 37990, transmission: "Automatic", mileage: 20, fuelType: "Hybrid", mpg: "41", engineSize: 2.5 },
  { model: "Prius Prime XSE", year: 2024, price: 36495, transmission: "Automatic", mileage: 30, fuelType: "Plug-in Hybrid", mpg: "52 (EV 127 MPGe)", engineSize: 2.0 },
  { model: "Corolla SE", year: 2025, price: 24990, transmission: "CVT", mileage: 10, fuelType: "Gasoline", mpg: "34", engineSize: 2.0 },
  { model: "Highlander Platinum", year: 2025, price: 52990, transmission: "Automatic", mileage: 12, fuelType: "Gasoline", mpg: "24", engineSize: 2.4 },
  { model: "Sequoia TRD Pro", year: 2025, price: 79990, transmission: "Automatic", mileage: 8, fuelType: "Hybrid", mpg: "20", engineSize: "i-FORCE MAX" },
  { model: "Tacoma TRD Off-Road", year: 2024, price: 45990, transmission: "Automatic", mileage: 2200, fuelType: "Gasoline", mpg: "21", engineSize: 2.4 },
  { model: "Tundra Platinum", year: 2025, price: 68990, transmission: "Automatic", mileage: 18, fuelType: "Gasoline", mpg: "20", engineSize: 3.5 },
];

const prettyNumber = (v: number | string | undefined) => {
  if (v === undefined || v === null || v === "") return "—";
  const n = typeof v === "string" ? Number(String(v).replace(/[^0-9.]/g, "")) : v;
  if (Number.isNaN(n)) return String(v);
  return n.toLocaleString();
};

const prettyPrice = (v: number | string | undefined) => {
  if (v === undefined || v === null || v === "") return "—";
  const n = typeof v === "string" ? Number(String(v).replace(/[^0-9.]/g, "")) : v;
  if (Number.isNaN(n)) return String(v);
  return `$${n.toLocaleString()}`;
};

const VehicleInventory: React.FC = () => {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<"relevance" | "priceAsc" | "priceDesc" | "yearDesc" | "mileageAsc">("relevance");

  const filtered = useMemo(() => {
    const base = INVENTORY.filter((r) => {
      if (!q.trim()) return true;
      const hay = `${r.model} ${r.year} ${r.fuelType ?? ""} ${r.transmission ?? ""}`.toLowerCase();
      return hay.includes(q.toLowerCase());
    });

    const byPrice = (r: Row) => r.price ?? Number.MAX_VALUE;
    const byMileage = (r: Row) => r.mileage ?? Number.MAX_VALUE;
    const byYear = (r: Row) => r.year ?? 0;

    switch (sort) {
      case "priceAsc":
        return [...base].sort((a, b) => byPrice(a) - byPrice(b));
      case "priceDesc":
        return [...base].sort((a, b) => byPrice(b) - byPrice(a));
      case "yearDesc":
        return [...base].sort((a, b) => byYear(b) - byYear(a));
      case "mileageAsc":
        return [...base].sort((a, b) => byMileage(a) - byMileage(b));
      default:
        return base; // keep original order
    }
  }, [q, sort]);

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-[#111827]">Explore All Inventory</h1>
        <p className="mt-2 text-[#4B5563]">
          U.S. lineup — mixed Toyota & GR models. Search and sort to browse everything.
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mb-8">
        <div className="flex-1">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by model, fuel type, transmission…"
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-[#111827] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#EB0A1E]/50"
          />
        </div>
        <div className="flex items-center gap-3">
          <label className="text-sm text-[#4B5563]">Sort by</label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as any)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#EB0A1E]/40"
          >
            <option value="relevance">Relevance (default)</option>
            <option value="priceAsc">Price: Low to High</option>
            <option value="priceDesc">Price: High to Low</option>
            <option value="yearDesc">Newest Year</option>
            <option value="mileageAsc">Lowest Mileage</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center">
          <p className="text-[#111827] font-semibold">No vehicles match your search.</p>
          <p className="text-[#6B7280] text-sm mt-1">Try clearing the search or changing the sort.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((r, idx) => (
            <Card
              key={`${r.model}-${r.year}-${idx}`}
              className={cn("rounded-2xl border border-gray-200 bg-white hover:shadow-lg transition-shadow")}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-xl font-bold text-[#111827]">
                    {r.model}
                  </CardTitle>
                  <Badge className="bg-[#111827] text-white">{r.year}</Badge>
                </div>
                <div className="mt-1 text-2xl font-extrabold text-[#111827]">
                  {prettyPrice(r.price)}
                </div>
              </CardHeader>

              <CardContent className="text-sm text-[#374151] space-y-2">
                <div className="grid grid-cols-2 gap-y-2">
                  <div className="text-[#6B7280]">Transmission</div>
                  <div className="font-medium text-[#111827]">{r.transmission ?? "—"}</div>

                  <div className="text-[#6B7280]">Mileage</div>
                  <div className="font-medium text-[#111827]">{prettyNumber(r.mileage ?? "—")}</div>

                  <div className="text-[#6B7280]">Fuel</div>
                  <div className="font-medium text-[#111827]">{r.fuelType ?? "—"}</div>

                  <div className="text-[#6B7280]">MPG</div>
                  <div className="font-medium text-[#111827]">{typeof r.mpg === "number" ? prettyNumber(r.mpg) : (r.mpg ?? "—")}</div>

                  <div className="text-[#6B7280]">Engine</div>
                  <div className="font-medium text-[#111827]">
                    {typeof r.engineSize === "number" ? `${r.engineSize}L` : (r.engineSize ?? "—")}
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <Button className="bg-[#EB0A1E] hover:bg-[#d10a1a] text-white w-full">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default VehicleInventory;

