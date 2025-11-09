// src/components/toyota/LifestyleSelector.tsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Mountain, Users, Building2, Wrench, Leaf, Key, Car } from "lucide-react";

interface Lifestyle {
  id: number;
  name: string;
  description: string;
  icon: React.ReactNode;
}

interface LifestyleSelectorProps {
  onComplete: (selected: Lifestyle[]) => void;
}

const LifestyleSelector: React.FC<LifestyleSelectorProps> = ({ onComplete }) => {
  const [selected, setSelected] = useState<Lifestyle[]>([]);

  // Enterprise copy tone
  const lifestyles: Lifestyle[] = [
    { id: 1, name: "Daily Commuter", description: "Consistent everyday driving with comfort, confidence and reliability.", icon: <Car className="h-5 w-5 text-[#374151]" /> },
    { id: 2, name: "Adventure Seeker", description: "Outdoor travel, rugged capability and room for gear and exploration.", icon: <Mountain className="h-5 w-5 text-[#374151]" /> },
    { id: 3, name: "Family Focused", description: "Safety, space and peace-of-mind for family travel and everyday routine.", icon: <Users className="h-5 w-5 text-[#374151]" /> },
    { id: 4, name: "Urban Professional", description: "City-friendly agility, advanced efficiency and modern mobility.", icon: <Building2 className="h-5 w-5 text-[#374151]" /> },
    { id: 5, name: "Commercial Vehicle Use", description: "Capability for trades, contracting, delivery and business operations.", icon: <Wrench className="h-5 w-5 text-[#374151]" /> },
    { id: 6, name: "Environment-Forward Driver", description: "Hybrid leadership, reduced emissions and efficiency as priority.", icon: <Leaf className="h-5 w-5 text-[#374151]" /> },
    { id: 7, name: "First-Time Buyer", description: "Value, dependability and smart entry into vehicle ownership.", icon: <Key className="h-5 w-5 text-[#374151]" /> },
  ];

  // Category-psychology border colors (bold 4px accent)
  const borderColor = (id: number) => {
    switch (id) {
      case 1: return "border-[#2F2F2F]"; // Slate Black (reliability)
      case 2: return "border-[#1F522C]"; // Forest Green (outdoors)
      case 3: return "border-[#1B2F59]"; // Royal Navy (family/safety)
      case 4: return "border-[#3A4B5C]"; // Steel Blue (urban/tech)
      case 5: return "border-[#4A4A4A]"; // Titanium Grey (industry)
      case 6: return "border-[#2E6A57]"; // Emerald (eco)
      case 7: return "border-[#9B8E5C]"; // Champagne (welcoming)
      default: return "border-[#2F2F2F]";
    }
  };

  const toggle = (l: Lifestyle) =>
    setSelected((prev) =>
      prev.find((x) => x.id === l.id) ? prev.filter((x) => x.id !== l.id) : [...prev, l]
    );

  const clear = () => setSelected([]);

  const next = () => {
    console.log("Selected lifestyles:", selected);
    onComplete(selected);
  };

  const isSelected = (id: number) => selected.some((x) => x.id === id);

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
      {/* Beige wrapper */}
      <div className="bg-[#EBE6DD] rounded-3xl px-8 py-12 shadow-sm border border-gray-200">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold tracking-tight text-[#111827]">
            Find Your Perfect Toyota
          </h1>
          <p className="text-lg text-[#4B5563]">
            Select the lifestyles that match you to get personalized recommendations
          </p>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Choose */}
          <Card className="h-fit bg-white border border-gray-200 rounded-2xl shadow-sm">
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="text-center text-2xl font-bold text-[#111827] uppercase tracking-wide">
                Choose Your Lifestyle
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3 py-4">
              {lifestyles.map((l) => (
                <Card
                  key={l.id}
                  onClick={() => toggle(l)}
                  aria-pressed={isSelected(l.id)}
                  className={cn(
                    "cursor-pointer rounded-xl transition-all duration-200 px-4 py-3 hover:shadow-md",
                    isSelected(l.id)
                      ? "bg-black text-white border-4 border-[#EB0A1E] shadow-[0_0_0_2px_#EB0A1E]"
                      : cn(
                          "bg-white text-[#111827] border-4",
                          borderColor(l.id),
                          "hover:bg-gray-50"
                        )
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        "flex items-center justify-center w-12 h-12 rounded-full border",
                        isSelected(l.id)
                          ? "bg-black/60 border-white/20"
                          : "bg-white border-gray-300"
                      )}
                    >
                      {l.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-base mb-1">{l.name}</h3>
                      <p className="text-sm text-[#4B5563] leading-snug">{l.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </CardContent>
          </Card>

          {/* Middle: Profile */}
          <Card className="rounded-2xl bg-white text-[#111827] border border-gray-200 shadow-sm">
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="text-center text-2xl font-bold uppercase tracking-wide">
                Build Your Lifestyle Profile
              </CardTitle>
            </CardHeader>

            <CardContent className="min-h-[520px] flex flex-col justify-between px-6 py-5">
              <div className="flex-1">
                {selected.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-[#6B7280]">
                    <Car className="h-12 w-12 text-gray-300" />
                    <p className="mt-4 text-sm">Click lifestyle cards to add them here.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selected.map((card) => (
                      <Badge
                        key={card.id}
                        className="w-full justify-between p-3 bg-[#EB0A1E] text-white hover:bg-[#d10a1a] rounded-md text-sm font-medium"
                      >
                        <span className="flex items-center gap-2">
                          {card.icon}
                          {card.name}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-white hover:bg-[#d10a1a]"
                          onClick={(e: React.MouseEvent) => {
                            e.stopPropagation();
                            setSelected((prev) => prev.filter((x) => x.id !== card.id));
                          }}
                          aria-label={`Remove ${card.name}`}
                        >
                          ×
                        </Button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-4 mt-8">
                <Button
                  variant="default"
                  className="flex-1 bg-white text-[#111827] border border-gray-300 hover:bg-gray-100"
                  onClick={clear}
                >
                  Clear All
                </Button>
                <Button
                  className="flex-1 bg-[#EB0A1E] hover:bg-[#d10a1a] text-white font-semibold"
                  onClick={next}
                  disabled={selected.length === 0}
                >
                  View Recommended Vehicles
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Right: Matches */}
          <Card className="h-fit bg-white text-[#111827] border border-gray-200 rounded-2xl shadow-sm">
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="text-center text-2xl font-bold uppercase tracking-wide">
                Your Matches
              </CardTitle>
            </CardHeader>

            <CardContent className="p-6">
              {selected.length === 0 ? (
                <div className="text-center py-10 text-[#6B7280]">
                  <Car className="h-12 w-12 mx-auto text-gray-300" />
                  <p className="mt-3 text-sm">Add lifestyles to see personalized Toyota recommendations.</p>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                    <p className="font-semibold mb-1">
                      {selected.length} lifestyle{selected.length > 1 ? "s" : ""} selected
                    </p>
                    <p className="text-sm text-[#4B5563]">Ready to find your perfect Toyota!</p>
                  </div>

                  <div>
                    <h4 className="font-bold text-sm mb-2 uppercase tracking-wide">Selected Lifestyles</h4>
                    <ul className="space-y-1 text-sm text-[#374151]">
                      {selected.map((card) => (
                        <li key={card.id} className="flex items-center gap-2">
                          {card.icon} {card.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LifestyleSelector;
