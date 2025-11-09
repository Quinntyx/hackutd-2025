// src/components/toyota/LifestyleSelector.tsx
import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Mountain, Users, Building2, Wrench, Leaf, Key, Car, HelpCircle } from "lucide-react";

export interface Lifestyle {
  id: number;
  name: string;
  description: string;
  icon: React.ReactNode;
}

interface LifestyleSelectorProps {
  onComplete: (selected: Lifestyle[]) => void;
  onNeedHelp: () => void;
}

type DragSource =
  | { type: "left"; id: number }
  | { type: "selected"; id: number; fromIndex: number }
  | null;

const LifestyleSelector: React.FC<LifestyleSelectorProps> = ({ onComplete, onNeedHelp }) => {
  const [selected, setSelected] = useState<Lifestyle[]>([]);
  const [dragSource, setDragSource] = useState<DragSource>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // Enterprise copy tone
  const lifestyles: Lifestyle[] = useMemo(
    () => [
      {
        id: 1,
        name: "Daily Commuter",
        description: "Consistent everyday driving with comfort, confidence and reliability.",
        icon: <Car className="h-5 w-5 text-[#374151]" />,
      },
      {
        id: 2,
        name: "Adventure Seeker",
        description: "Outdoor travel, rugged capability and room for gear and exploration.",
        icon: <Mountain className="h-5 w-5 text-[#374151]" />,
      },
      {
        id: 3,
        name: "Family Focused",
        description: "Safety, space and peace-of-mind for family travel and everyday routine.",
        icon: <Users className="h-5 w-5 text-[#374151]" />,
      },
      {
        id: 4,
        name: "Urban Professional",
        description: "City-friendly agility, advanced efficiency and modern mobility.",
        icon: <Building2 className="h-5 w-5 text-[#374151]" />,
      },
      {
        id: 5,
        name: "Commercial Vehicle Use",
        description: "Capability for trades, contracting, delivery and business operations.",
        icon: <Wrench className="h-5 w-5 text-[#374151]" />,
      },
      {
        id: 6,
        name: "Environment-Forward Driver",
        description: "Hybrid leadership, reduced emissions and efficiency as priority.",
        icon: <Leaf className="h-5 w-5 text-[#374151]" />,
      },
      {
        id: 7,
        name: "First-Time Buyer",
        description: "Value, dependability and smart entry into vehicle ownership.",
        icon: <Key className="h-5 w-5 text-[#374151]" />,
      },
    ],
    []
  );

  // Category accent borders (4px) to keep the sophisticated tone
  const borderColor = (id: number) => {
    switch (id) {
      case 1:
        return "border-[#2F2F2F]"; // Slate Black
      case 2:
        return "border-[#1F522C]"; // Forest Green
      case 3:
        return "border-[#1B2F59]"; // Royal Navy
      case 4:
        return "border-[#3A4B5C]"; // Steel Blue
      case 5:
        return "border-[#4A4A4A]"; // Titanium Grey
      case 6:
        return "border-[#2E6A57]"; // Emerald
      case 7:
        return "border-[#9B8E5C]"; // Champagne
      default:
        return "border-[#2F2F2F]";
    }
  };

  const isSelected = (id: number) => selected.some((x) => x.id === id);

  // Click toggle (still supported)
  const toggle = (l: Lifestyle) =>
    setSelected((prev) =>
      prev.find((x) => x.id === l.id) ? prev.filter((x) => x.id !== l.id) : [...prev, l]
    );

  const clear = () => setSelected([]);
  const next = () => onComplete(selected);

  // ---------- Drag helpers ----------
  const onDragStartLeft = (l: Lifestyle) => (e: React.DragEvent) => {
    setDragSource({ type: "left", id: l.id });
    e.dataTransfer.setData("text/plain", String(l.id));
    e.dataTransfer.effectAllowed = "copy";
  };

  const onDragStartSelected = (idx: number, l: Lifestyle) => (e: React.DragEvent) => {
    setDragSource({ type: "selected", id: l.id, fromIndex: idx });
    e.dataTransfer.setData("text/plain", String(l.id));
    e.dataTransfer.effectAllowed = "move";
  };

  const onDragOverContainer = (e: React.DragEvent) => {
    // allow drop anywhere in the profile area
    e.preventDefault();
  };

  const insertAt = (arr: Lifestyle[], item: Lifestyle, index: number) => {
    const copy = arr.slice();
    copy.splice(index, 0, item);
    return copy;
  };

  const onDropContainer = (e: React.DragEvent) => {
    e.preventDefault();
    if (!dragSource) return;

    if (dragSource.type === "left") {
      const item = lifestyles.find((x) => x.id === dragSource.id);
      if (!item) return;
      if (isSelected(item.id)) return; // already selected
      setSelected((prev) => [...prev, item]);
    }
    // if dragSource is selected and dropped on container (not a slot),
    // we do nothing (it stays where it was) – reordering is handled by slot drops.
    setDragSource(null);
    setHoverIndex(null);
  };

  // Slot drop to support precise reordering / insertion
  const onDragOverSlot = (slotIndex: number) => (e: React.DragEvent) => {
    e.preventDefault();
    setHoverIndex(slotIndex);
  };

  const onDropSlot = (slotIndex: number) => (e: React.DragEvent) => {
    e.preventDefault();
    if (!dragSource) return;

    if (dragSource.type === "left") {
      const item = lifestyles.find((x) => x.id === dragSource.id);
      if (!item) return;
      if (isSelected(item.id)) {
        // If already selected, do not duplicate. Just clear hover.
        setHoverIndex(null);
        setDragSource(null);
        return;
      }
      setSelected((prev) => insertAt(prev, item, Math.min(slotIndex, prev.length)));
    }

    if (dragSource.type === "selected") {
      const { fromIndex } = dragSource;
      if (fromIndex === slotIndex || fromIndex + 1 === slotIndex) {
        // no movement if dropped at same or adjacent end slot
        setHoverIndex(null);
        setDragSource(null);
        return;
      }
      setSelected((prev) => {
        const copy = prev.slice();
        const [moved] = copy.splice(fromIndex, 1);
        // after removing, target index may shift if fromIndex < slotIndex
        const target = fromIndex < slotIndex ? slotIndex - 1 : slotIndex;
        copy.splice(Math.max(0, Math.min(target, copy.length)), 0, moved);
        return copy;
      });
    }

    setHoverIndex(null);
    setDragSource(null);
  };

  const onDragEnd = () => {
    setDragSource(null);
    setHoverIndex(null);
  };

  // Render a thin insertion indicator between badges
  const DropSlot: React.FC<{ index: number }> = ({ index }) => (
    <div
      onDragOver={onDragOverSlot(index)}
      onDrop={onDropSlot(index)}
      className={cn(
        "h-3 my-1 transition-colors",
        hoverIndex === index ? "bg-[#EB0A1E]/30 rounded" : "bg-transparent"
      )}
    />
  );

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
      {/* Beige wrapper */}
      <div className="bg-gray-200 rounded-3xl px-8 py-12 shadow-sm border border-gray-200">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold tracking-tight text-[#111827] py-5">
            Find Your Perfect Toyota
          </h1>
          <p className="text-lg text-[#4B5563] mb-4">
            Select the lifestyles that align with your driving needs. (You can choose more than one.)
          </p>
          
          {/* Need Help Button */}
          <div className="flex justify-center">
            <Button 
              variant="outline" 
              className="border-[#374151] text-[#374151] hover:bg-gray-50 px-6 py-2"
              onClick={onNeedHelp}
            >
              <HelpCircle className="h-4 w-4 mr-2" />
              Need Additional Help?
            </Button>
          </div>
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
              {lifestyles.map((l) => {
                const chosen = isSelected(l.id);
                return (
                  <div
                    key={l.id}
                    draggable
                    onDragStart={onDragStartLeft(l)}
                    onDragEnd={onDragEnd}
                    onClick={() => toggle(l)}
                    className={cn(
                      "rounded-xl transition-all duration-200 px-4 py-3 border-2 cursor-grab active:cursor-grabbing select-none",
                      chosen
                        ? cn(
                            "bg-red-500 text-[#111827]",
                            borderColor(l.id),
                            "shadow-sm"
                          )
                        : cn(
                            "bg-white text-[#111827] hover:bg-gray-50",
                            borderColor(l.id)
                          )
                    )}
                    aria-pressed={chosen}
                    title="Drag to add, or click to toggle"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={cn(
                          "flex items-center justify-center w-12 h-12 rounded-full border",
                          chosen ? "bg-[#EBE6DD] border-gray-300" : "bg-white border-gray-300"
                        )}
                      >
                        {l.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-base mb-1">{l.name}</h3>
                        <p className="text-sm text-black leading-snug">{l.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Middle: Profile (drop target + sortable) */}
          <Card className="rounded-2xl bg-white text-[#111827] border border-gray-200 shadow-sm">
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="text-center text-2xl font-bold uppercase tracking-wide">
                Build Your Lifestyle Profile
              </CardTitle>
            </CardHeader>

            <CardContent
              className="min-h-[520px] flex flex-col justify-between px-6 py-5"
              onDragOver={onDragOverContainer}
              onDrop={onDropContainer}
            >
              <div className="flex-1">
                {selected.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-[#6B7280]">
                    <Car className="h-12 w-12 text-gray-300" />
                    <p className="mt-4 text-sm">Drag lifestyle cards here, or click to add.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {/* First slot (top) */}
                    <DropSlot index={0} />
                    {selected.map((card, idx) => (
                      <div key={card.id}>
                        {/* Draggable badge */}
                        <div
                          draggable
                          onDragStart={onDragStartSelected(idx, card)}
                          onDragEnd={onDragEnd}
                          className="w-full"
                          title="Drag to reorder"
                        >
                          <Badge className="w-full justify-between p-3 bg-[#EB0A1E] text-white hover:bg-[#d10a1a] rounded-md text-sm font-medium cursor-grab active:cursor-grabbing">
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
                        </div>
                        {/* Slot after each item */}
                        <DropSlot index={idx + 1} />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-4 mt-8">
                <Button variant="outline" className="flex-1 border-gray-300 hover:bg-gray-100" onClick={clear}>
                  Clear All
                </Button>
                <Button
                  className="flex-1 bg-[#EB0A1E] hover:bg-[#d10a1a] text-white"
                  onClick={next}
                  disabled={selected.length === 0}
                >
                  Next Step ({selected.length})
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Right: Matches Summary */}
          <Card className="h-fit bg-white border border-gray-200 rounded-2xl shadow-sm">
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="text-center text-2xl font-bold text-[#111827] uppercase tracking-wide">
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
                    <p className="text-[#111827] font-semibold mb-1">
                      {selected.length} lifestyle{selected.length > 1 ? "s" : ""} selected
                    </p>
                    <p className="text-sm text-[#4B5563]">Ready to find your perfect Toyota.</p>

                  </div>


                  <div>
                    <h4 className="font-bold text-sm text-[#111827] mb-2 uppercase tracking-wide">Selected Lifestyles</h4>
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

