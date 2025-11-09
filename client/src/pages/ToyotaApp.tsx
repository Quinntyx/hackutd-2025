/// <reference types="react" />

import React, { useState } from "react";
import LifestyleSelector from "@/components/toyota/LifestyleSelector";
import VehicleInventory from "@/components/toyota/VehicleInventory";
import BuyersGuide from "@/components/toyota/CarBuyingGuide";
import toyotalogo from "@/assets/toyota/toyotalogo.png";
import { Button } from "@/components/ui/button";
import CarExplorer from "@/pages/CarExplorer";
import type { CompoundFilter } from "../../../model/filter";
import type { Lifestyle } from "@/components/toyota/LifestyleSelector";

type View = "home" | "lifestyle" | "inventory" | "explorer" | "guide";

const ToyotaApp: React.FC = () => {
  const [view, setView] = useState<View>("home");
  const [initialFilters, setInitialFilters] = useState<CompoundFilter | undefined>(undefined);

  const handleLifestyleComplete = (selectedLifestyles: Lifestyle[]) => {
    // Keep your existing logic
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

    const avg = (arr: number[]) => arr.length > 0 ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : undefined;
    const mostCommon = (arr: string[]) => {
      if (arr.length === 0) return undefined;
      const counts = arr.reduce((acc, val) => {
        acc[val] = (acc[val] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
    };

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

  const Navigation = () => (
    <header className="w-full bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={toyotalogo} className="h-8 w-auto" alt="Toyota" />
          <span className="font-bold text-xl tracking-wider text-[#1a1a1a]">TOYOTA</span>
        </div>

        <nav className="flex items-center gap-8 text-sm font-medium">
          <span 
            className={`cursor-pointer transition-colors ${view === "home" ? "text-[#d71921] border-b-2 border-[#d71921] pb-1" : "text-[#4a4a4a] hover:text-[#d71921]"}`} 
            onClick={() => setView("home")}
          >
            Home
          </span>
          <span 
            className={`cursor-pointer transition-colors ${view === "lifestyle" ? "text-[#d71921] border-b-2 border-[#d71921] pb-1" : "text-[#4a4a4a] hover:text-[#d71921]"}`} 
            onClick={() => setView("lifestyle")}
          >
            Find My Match
          </span>
          <span 
            className={`cursor-pointer transition-colors ${view === "guide" ? "text-[#d71921] border-b-2 border-[#d71921] pb-1" : "text-[#4a4a4a] hover:text-[#d71921]"}`} 
            onClick={() => setView("guide")}
          >
            Buyer's Guide
          </span>
          <span 
            className={`cursor-pointer transition-colors ${view === "inventory" ? "text-[#d71921] border-b-2 border-[#d71921] pb-1" : "text-[#4a4a4a] hover:text-[#d71921]"}`} 
            onClick={() => setView("inventory")}
          >
            Inventory
          </span>
        </nav>
      </div>
    </header>
  );

  if (view === "lifestyle") {
    return (
      <div className="min-h-screen bg-[#fafafa]">
        <Navigation />
        <LifestyleSelector onComplete={handleLifestyleComplete} onNeedHelp={() => setView("guide")} />
      </div>
    );
  }

  if (view === "inventory") {
    return (
      <div className="min-h-screen bg-[#fafafa]">
        <Navigation />
        <VehicleInventory />
      </div>
    );
  }

  if (view === "guide") {
    return (
      <div className="min-h-screen bg-[#fafafa]">
        <Navigation />
        <BuyersGuide />
      </div>
    );
  }

  if (view === "explorer") {
    return (
      <div className="min-h-screen bg-[#fafafa]">
        <Navigation />
        <CarExplorer initialFilters={initialFilters} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero with Toyota aesthetic */}
      <section className="relative bg-linear-to-b from-[#f8f9fa] to-white">
        <div className="max-w-7xl mx-auto px-6 pt-20 pb-24">
          <div className="text-center">
            <h1 className="text-5xl lg:text-6xl font-light text-[#1a1a1a] mb-8 leading-tight">
              Let's Go Places
            </h1>
            <p className="text-xl text-[#666666] mb-12 max-w-2xl mx-auto leading-relaxed">
              Discover the Toyota that matches your journey. From daily commutes to weekend adventures.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button 
                size="lg"
                className="bg-[#d71921] hover:bg-[#b91419] text-white px-10 py-4 text-lg font-medium rounded-none shadow-lg transition-all hover:shadow-xl"
                onClick={() => setView("lifestyle")}
              >
                Find My Match
              </Button>
              <Button 
                size="lg"
                variant="outline" 
                className="border-2 border-[#d71921] text-[#d71921] hover:bg-[#d71921] hover:text-white px-10 py-4 text-lg font-medium rounded-none transition-all"
                onClick={() => setView("inventory")}
              >
                View All Models
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Models */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-light text-[#1a1a1a] mb-4">Popular Models</h2>
            <p className="text-[#666666]">Trusted by millions of drivers worldwide</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group cursor-pointer" onClick={() => setView("inventory")}>
              <div className="bg-[#f8f9fa] rounded-lg h-56 mb-6 flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105">
                <div className="w-48 h-28 bg-linear-to-r from-[#e6e6e6] to-[#d4d4d4] rounded-lg flex items-center justify-center">
                  <span className="text-[#999999] font-medium">RAV4 Hybrid</span>
                </div>
              </div>
              <h3 className="text-xl font-medium text-[#1a1a1a] mb-2">RAV4 Hybrid</h3>
              <p className="text-[#666666] mb-2">America's best-selling SUV</p>
              <p className="text-lg font-semibold text-[#d71921]">Starting at $32,980</p>
            </div>

            <div className="group cursor-pointer" onClick={() => setView("inventory")}>
              <div className="bg-[#f8f9fa] rounded-lg h-56 mb-6 flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105">
                <div className="w-48 h-28 bg-linear-to-r from-[#e6e6e6] to-[#d4d4d4] rounded-lg flex items-center justify-center">
                  <span className="text-[#999999] font-medium">Camry</span>
                </div>
              </div>
              <h3 className="text-xl font-medium text-[#1a1a1a] mb-2">Camry</h3>
              <p className="text-[#666666] mb-2">Midsize sedan leader</p>
              <p className="text-lg font-semibold text-[#d71921]">Starting at $26,420</p>
            </div>

            <div className="group cursor-pointer" onClick={() => setView("inventory")}>
              <div className="bg-[#f8f9fa] rounded-lg h-56 mb-6 flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105">
                <div className="w-48 h-28 bg-linear-to-r from-[#e6e6e6] to-[#d4d4d4] rounded-lg flex items-center justify-center">
                  <span className="text-[#999999] font-medium">Prius</span>
                </div>
              </div>
              <h3 className="text-xl font-medium text-[#1a1a1a] mb-2">Prius</h3>
              <p className="text-[#666666] mb-2">Hybrid pioneer</p>
              <p className="text-lg font-semibold text-[#d71921]">Starting at $28,545</p>
            </div>
          </div>
        </div>
      </section>

      {/* OWNERSHIP / FINANCE ADVISORY */}
      <section className="border-t border-gray-200 bg-gray-300 py-14">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-light tracking-tight text-[#111111]">
            Navigate Ownership with Confidence
          </h2>
          <p className="mt-3 text-[#4B4B4B] text-base">
            Leasing, financing, warranties and cost of ownership — explained clearly so you choose from
            informed understanding, not guesswork.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <img src={toyotalogo} className="h-6 w-auto" alt="Toyota" />
              <span className="text-[#666666] text-sm">© 2025 Toyota Motor Corporation</span>
            </div>
            <div className="flex gap-8 text-sm text-[#666666]">
              <span className="hover:text-[#d71921] cursor-pointer transition-colors">Privacy Policy</span>
              <span className="hover:text-[#d71921] cursor-pointer transition-colors">Terms of Use</span>
              <span className="hover:text-[#d71921] cursor-pointer transition-colors" onClick={() => setView("inventory")}>
                All Models
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ToyotaApp;
