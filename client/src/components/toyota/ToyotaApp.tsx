import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, User, Car, Target, CreditCard, Repeat, Calculator, Menu } from 'lucide-react';

import LifestyleSelector from './LifestyleSelector';
import VehicleInventory from './VehicleInventory';

// Use RELATIVE imports to avoid Vite alias issues.
// Make sure this file exists exactly at: client/src/assets/toyota/toyotalogo.png
import ToyotaLogo from '../../assets/toyota/toyotalogo.png';

type PageType = 'welcome' | 'lifestyle' | 'inventory';

interface Lifestyle {
  id: number;
  name: string;
  description: string;
  icon: React.ReactNode | string;
}

const ToyotaApp: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageType>('welcome');
  const [userLifestyle, setUserLifestyle] = useState<Lifestyle[]>([]);
  const [mobileOpen, setMobileOpen] = useState(false);

  const onLifestyleComplete = (selected: Lifestyle[]): void => {
    setUserLifestyle(selected);
    setCurrentPage('inventory');
  };

  // ---------- NAV (single, universal) ----------
  const Nav: React.FC = () => (
    <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <img src={ToyotaLogo} alt="Toyota" className="h-8 w-auto select-none" />
          <span className="text-sm tracking-[0.22em] uppercase font-semibold text-[#212121]">Toyota</span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {['Vehicles', 'Shop', 'Owners', 'Discover', 'Build & Price', 'Dealers'].map((item) => (
            <button
              key={item}
              className="group relative text-sm text-[#4B5563] hover:text-[#111827] transition-colors"
              // Intentionally no routing yet (per your last instruction)
            >
              {item}
              <span className="pointer-events-none absolute left-0 -bottom-2 h-[2px] w-0 bg-[#EB0A1E] transition-all duration-200 group-hover:w-full" />
            </button>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-2">
          <Button variant="ghost" className="text-[#4B5563] hover:text-[#111827] hover:bg-gray-100">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" className="text-[#4B5563] hover:text-[#111827] hover:bg-gray-100">
            <User className="h-5 w-5" />
          </Button>
          <Button
            variant={currentPage === 'inventory' ? 'default' : 'outline'}
            onClick={() => setCurrentPage('inventory')}
            className="ml-2 border-[#EB0A1E] text-white bg-[#EB0A1E] hover:bg-[#d10a1a] shadow-sm"
          >
            Inventory
            {userLifestyle.length > 0 && <Badge className="ml-2 bg-white/20">{userLifestyle.length}</Badge>}
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          className="md:hidden text-[#4B5563] hover:text-[#111827] hover:bg-gray-100"
          onClick={() => setMobileOpen((v) => !v)}
        >
          <Menu className="h-6 w-6" />
        </Button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="max-w-7xl mx-auto px-6 py-3 grid grid-cols-2 gap-3">
            {['Vehicles', 'Shop', 'Owners', 'Discover', 'Build & Price', 'Dealers'].map((item) => (
              <Button key={item} variant="outline" className="justify-start">
                {item}
              </Button>
            ))}
            <div className="col-span-2 flex gap-2">
              <Button
                className="flex-1 bg-[#EB0A1E] hover:bg-[#d10a1a] text-white"
                onClick={() => {
                  setMobileOpen(false);
                  setCurrentPage('inventory');
                }}
              >
                Inventory
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setMobileOpen(false)}
              >
                <Search className="h-4 w-4 mr-2" /> Search
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );

  // ---------- HOMEPAGE (clean enterprise Toyota, left-aligned hero) ----------
  const Welcome: React.FC = () => (
    <div className="bg-[#F7F7F7] text-[#111827]">
      {/* HERO (left-aligned, logo only) */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* Left column: Logo + Headline + Tagline + CTAs */}
          <div>
            <img src={ToyotaLogo} alt="Toyota" className="h-12 w-auto mb-6" />
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4">
              Find your Toyota
            </h1>
            <p className="text-lg text-[#4B5563] mb-8">
              Drive your story.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                className="bg-[#EB0A1E] hover:bg-[#d10a1a] text-white"
                onClick={() => setCurrentPage('lifestyle')}
              >
                <Target className="h-4 w-4 mr-2" />
                Personalized Recommendations
              </Button>
              <Button
                variant="outline"
                className="border-gray-300 hover:bg-gray-100"
                onClick={() => setCurrentPage('inventory')}
              >
                <Car className="h-4 w-4 mr-2" />
                Browse Inventory
              </Button>
            </div>
          </div>

          {/* Right column: category cards (toyota.com-style placeholder) */}
          <div className="grid grid-cols-2 gap-3">
            {['All Vehicles', 'Electrified', 'SUVs', 'Sedans', 'Trucks', 'GR & Performance'].map((label) => (
              <Card
                key={label}
                className="bg-white border border-gray-200 hover:border-[#EB0A1E] hover:shadow-sm transition-all"
              >
                <CardContent className="py-6 text-center">
                  <span className="text-sm font-medium text-[#111827]">{label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Financing Education — Beige C1 (#EBE6DD) with icons (3 guidance tiles) */}
      <section className="border-t border-gray-200 bg-[#EBE6DD]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <h2 className="text-3xl font-bold mb-2">New to buying a car?</h2>
          <p className="text-[#4B5563] mb-8">
            Get confident with financing and leasing—start with the essentials.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-white border border-gray-200 hover:shadow-sm transition-all">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-[#EB0A1E]" />
                  </div>
                  <h3 className="text-lg font-semibold">Financing Basics</h3>
                </div>
                <p className="text-sm text-[#4B5563]">
                  Learn how auto loans work, APR, and what affects your monthly payment.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200 hover:shadow-sm transition-all">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                    <Repeat className="h-5 w-5 text-[#EB0A1E]" />
                  </div>
                  <h3 className="text-lg font-semibold">Leasing vs Buying</h3>
                </div>
                <p className="text-sm text-[#4B5563]">
                  Compare total costs, mileage limits, and flexibility to decide what fits.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200 hover:shadow-sm transition-all">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                    <Calculator className="h-5 w-5 text-[#EB0A1E]" />
                  </div>
                  <h3 className="text-lg font-semibold">Estimate Payments</h3>
                </div>
                <p className="text-sm text-[#4B5563]">
                  See how down payment and term length change your estimated monthly.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Marketing Feature Tiles (kept, as requested) */}
      <section className="border-t border-gray-200 bg-[#F9FAFB]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 grid md:grid-cols-2 gap-6">
          <Card className="bg-white border border-gray-200 hover:shadow-sm transition-all">
            <CardContent className="p-8">
              <h3 className="text-2xl font-semibold mb-2">Toyota Safety Sense</h3>
              <p className="text-[#4B5563]">Advanced safety features—standard on many models.</p>
            </CardContent>
          </Card>
          <Card className="bg-white border border-gray-200 hover:shadow-sm transition-all">
            <CardContent className="p-8">
              <h3 className="text-2xl font-semibold mb-2">Hybrid Leadership</h3>
              <p className="text-[#4B5563]">Efficiency without compromise, engineered by Toyota.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA band */}
      <section className="border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h4 className="text-xl font-semibold">Ready to find your match?</h4>
            <p className="text-[#4B5563]">Take the lifestyle quiz or browse all inventory.</p>
          </div>
          <div className="flex gap-3">
            <Button className="bg-[#EB0A1E] hover:bg-[#d10a1a] text-white" onClick={() => setCurrentPage('lifestyle')}>
              <Target className="h-4 w-4 mr-2" /> Start Now
            </Button>
            <Button variant="outline" className="border-gray-300 hover:bg-gray-100" onClick={() => setCurrentPage('inventory')}>
              <Car className="h-4 w-4 mr-2" /> Inventory
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10 text-center text-[#6B7280] text-sm">
          © 2025 Toyota Motor Corporation. All rights reserved.
        </div>
      </footer>
    </div>
  );

  // ---------- ROUTER (state-based; keep others unchanged) ----------
  const renderPage = (): JSX.Element => {
    switch (currentPage) {
      case 'welcome':
        return <Welcome />;
      case 'lifestyle':
        return (
          <div className="bg-[#F7F7F7] text-[#111827] min-h-screen">
            <LifestyleSelector onComplete={onLifestyleComplete} />
          </div>
        );
      case 'inventory':
        return (
          <div className="bg-[#F7F7F7] text-[#111827] min-h-screen">
            <VehicleInventory userLifestyle={userLifestyle} />
          </div>
        );
      default:
        return <Welcome />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7] text-[#111827] font-['Roboto_Condensed',sans-serif]">
      <Nav />
      {renderPage()}
    </div>
  );
};

export default ToyotaApp;

