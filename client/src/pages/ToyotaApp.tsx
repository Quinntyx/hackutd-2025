// src/components/toyota/ToyotaApp.tsx
import React, { useState } from "react";
import LifestyleSelector from "@/components/toyota/LifestyleSelector";
import VehicleInventory from "@/components/toyota/VehicleInventory";
import toyotalogo from "@/assets/toyota/toyotalogo.png";
import { Button } from "@/components/ui/button";

import { ShieldCheck, Gauge, Layers, SlidersHorizontal } from "lucide-react";
import CarExplorer from "@/pages/CarExplorer";
import type { CompoundFilter } from "../../../model/filter";
import type { Lifestyle } from "@/components/toyota/LifestyleSelector";

type View = "home" | "lifestyle" | "inventory" | "explorer";

const ToyotaApp: React.FC = () => {
  const [view, setView] = useState<View>("home");
  const [initialFilters, setInitialFilters] = useState<CompoundFilter | undefined>(undefined);

  const handleLifestyleComplete = (selectedLifestyles: Lifestyle[]) => {
    // Accumulate values from all lifestyles
    const accumulator = {
      priceTargets: [] as number[],
      mpgTargets: [] as number[],
      mileageTargets: [] as number[],
      commuteDistances: [] as number[],
      mpgPriorities: [] as number[],
      pricePriorities: [] as number[],
      electricPriorities: [] as number[],
      fuelTypePriorities: [] as number[],
      transmissions: [] as string[],
      fuelTypes: [] as string[],
      electricCount: 0,
    };

    // Collect values from each lifestyle
    selectedLifestyles.forEach((lifestyle) => {
      switch (lifestyle.name) {
        case "Daily Commuter":
          accumulator.mpgTargets.push(30);
          accumulator.mpgPriorities.push(2);
          accumulator.priceTargets.push(25000);
          accumulator.fuelTypes.push("Hybrid");
          accumulator.commuteDistances.push(20);
          break;

        case "Adventure Seeker":
          accumulator.priceTargets.push(35000);
          accumulator.mileageTargets.push(50000);
          accumulator.transmissions.push("Automatic");
          break;

        case "Family Focused":
          accumulator.priceTargets.push(32000);
          accumulator.mileageTargets.push(40000);
          accumulator.fuelTypes.push("Hybrid");
          accumulator.mpgTargets.push(28);
          break;

        case "Urban Professional":
          accumulator.priceTargets.push(28000);
          accumulator.mpgTargets.push(35);
          accumulator.mpgPriorities.push(2);
          accumulator.fuelTypes.push("Hybrid");
          accumulator.commuteDistances.push(15);
          break;

        case "Commercial Vehicle Use":
          accumulator.priceTargets.push(30000);
          accumulator.mileageTargets.push(60000);
          accumulator.transmissions.push("Automatic");
          break;

        case "Environment-Forward Driver":
          accumulator.electricCount++;
          accumulator.electricPriorities.push(3);
          accumulator.fuelTypes.push("Hybrid");
          accumulator.fuelTypePriorities.push(3);
          accumulator.mpgTargets.push(40);
          accumulator.mpgPriorities.push(3);
          break;

        case "First-Time Buyer":
          accumulator.priceTargets.push(20000);
          accumulator.pricePriorities.push(3);
          accumulator.mileageTargets.push(30000);
          break;
      }
    });

    // Average numeric values
    const avg = (arr: number[]) => arr.length > 0 ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : undefined;
    
    // Most common value for categorical fields
    const mostCommon = (arr: string[]) => {
      if (arr.length === 0) return undefined;
      const counts = arr.reduce((acc, val) => {
        acc[val] = (acc[val] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
    };

    // Build final filters
    const filters: CompoundFilter = {
      priceTarget: avg(accumulator.priceTargets),
      pricePriority: avg(accumulator.pricePriorities) ?? 1,
      mpgTarget: avg(accumulator.mpgTargets),
      mpgPriority: avg(accumulator.mpgPriorities) ?? 1,
      mileageTarget: avg(accumulator.mileageTargets),
      mileagePriority: 1,
      commuteDistance: avg(accumulator.commuteDistances) ?? 0,
      transmission: mostCommon(accumulator.transmissions) as any,
      transmissionPriority: 1,
      fuelType: mostCommon(accumulator.fuelTypes) as any,
      fuelTypePriority: avg(accumulator.fuelTypePriorities) ?? 1,
      electric: accumulator.electricCount > 0,
      electricPriority: avg(accumulator.electricPriorities) ?? 1,
      city: "",
    };

    setInitialFilters(filters);
    setView("explorer");
  };

  if (view === "lifestyle") {
    return <LifestyleSelector onComplete={handleLifestyleComplete} />;
  }

  if (view === "inventory") {
    return <VehicleInventory />;
  }

  if (view === "explorer") {
    return <CarExplorer initialFilters={initialFilters} />
  }

  return (
    <div className="min-h-screen bg-white text-[#0E0E0E]">
      {/* NAV */}
      <header className="w-full border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={toyotalogo} className="h-8 w-auto" alt="Toyota" />
            <span className="font-extrabold text-xl tracking-wider">TOYOTA</span>
          </div>

          <nav className="flex items-center gap-6 text-sm font-medium text-[#2D2D2D]">
            <span className="hover:text-[#EB0A1E] cursor-pointer" onClick={() => setView("home")}>Home</span>
            <span className="hover:text-[#EB0A1E] cursor-pointer" onClick={() => setView("inventory")}>Inventory</span>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h1 className="text-6xl font-light tracking-tight text-[#111111] leading-tight">
          Crafted for every journey.
        </h1>
        <p className="mt-4 text-lg text-[#3A3A3A] max-w-2xl mx-auto">
          A refined shopping experience built around real drivers, their needs, and the road ahead.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-6">
          <Button className="bg-[#111111] hover:bg-[#111111]/85 text-white px-8 py-6 text-base rounded-xl" onClick={() => setView("lifestyle")}>
            Find My Match
          </Button>
          <Button variant="outline" className="px-8 py-6 text-base rounded-xl border-[#111111] hover:bg-gray-100" onClick={() => setView("inventory")}>
            Browse Full Inventory
          </Button>
        </div>
      </section>

      {/* BRAND PILLARS */}
      <section className="max-w-7xl mx-auto px-6 pb-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            icon: <ShieldCheck className="h-6 w-6 text-[#111111]" />,
            title: "Safety First",
            text: "Toyota Safety Sense and proven safety innovation built to protect every passenger."
          },
          {
            icon: <Gauge className="h-6 w-6 text-[#111111]" />,
            title: "Efficiency Matters",
            text: "Hybrid engineering that elevates efficiency without sacrificing everyday performance."
          },
          {
            icon: <Layers className="h-6 w-6 text-[#111111]" />,
            title: "Built To Last",
            text: "Durability and retained value remain core to every Toyota platform."
          },
          {
            icon: <SlidersHorizontal className="h-6 w-6 text-[#111111]" />,
            title: "Designed For You",
            text: "We align recommendations to how you actually drive and live—no complexity needed."
          }
        ].map((p, i) => (
          <div key={i} className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm hover:shadow-md transition">
            <div className="flex justify-center mb-3">{p.icon}</div>
            <h3 className="font-semibold text-lg text-[#111111] tracking-wide">{p.title}</h3>
            <p className="mt-2 text-sm text-[#525252] leading-relaxed">{p.text}</p>
          </div>
        ))}
      </section>

      {/* OWNERSHIP / FINANCE ADVISORY */}
      <section className="border-t border-gray-200 bg-[#EBE6DD] py-14">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-light tracking-tight text-[#111111]">
            Navigate Ownership with Confidence
          </h2>
          <p className="mt-3 text-[#4B4B4B] text-base">
            Leasing, financing, warranties and cost of ownership — explained clearly so you choose from
            informed understanding, not guesswork.
          </p>
          <div className="mt-6 flex justify-center">
            <Button variant="outline" className="px-6 py-3 rounded-lg border-[#111111] hover:bg-white" onClick={() => setView("inventory")}>
              Explore Offers & Models
            </Button>
          </div>
        </div>
      </section>

      {/* SHOWCASE BAND is unchanged */}
      {/* ... keep your existing black showcase section code exactly here ... */}

      <footer className="border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-8 text-sm text-[#6B7280] flex flex-col sm:flex-row justify-between gap-4">
          <span>© {new Date().getFullYear()} Toyota. All Rights Reserved.</span>
          <div className="flex gap-6">
            <span className="hover:text-[#EB0A1E] cursor-pointer">Privacy</span>
            <span className="hover:text-[#EB0A1E] cursor-pointer">Terms</span>
            <span className="hover:text-[#EB0A1E] cursor-pointer" onClick={() => setView("inventory")}>
              Inventory
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ToyotaApp;

