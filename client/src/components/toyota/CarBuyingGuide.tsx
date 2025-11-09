import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { 
  DollarSign, 
  FileText, 
  Shield, 
  Fuel, 
  Users, 
  MapPin, 
  Calendar, 
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Award
} from "lucide-react";

type Section = "overview" | "financing" | "features" | "ownership" | "models";

const BuyersGuide: React.FC = () => {
  const [activeSection, setActiveSection] = useState<Section>("overview");

  const sections = [
    { id: "overview", label: "Getting Started", icon: <CheckCircle className="h-4 w-4" /> },
    { id: "financing", label: "Financing & Budget", icon: <DollarSign className="h-4 w-4" /> },
    { id: "features", label: "Key Features", icon: <Shield className="h-4 w-4" /> },
    { id: "ownership", label: "Ownership Costs", icon: <TrendingUp className="h-4 w-4" /> },
    { id: "models", label: "Model Comparison", icon: <Award className="h-4 w-4" /> },
  ];

  const OverviewContent = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-[#111827] mb-4">Your Toyota Buying Journey</h2>
        <p className="text-[#4B5563] text-lg">
          Whether you're a first-time buyer or looking to upgrade, this guide will help you make an informed decision.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-center gap-3 mb-3">
            <Users className="h-5 w-5 text-[#EB0A1E]" />
            <h3 className="font-semibold text-lg text-[#111827]">Know Your Needs</h3>
          </div>
          <p className="text-[#4B5563] text-sm mb-4">
            Consider how you'll use your vehicle: daily commuting, family trips, weekend adventures, or work requirements. Check out our Lifestyle Selector Tool for customized assistance!
          </p>
          <ul className="space-y-2 text-sm text-[#374151]">
            <li>• Passenger and cargo space needs</li>
            <li>• Typical driving distance and conditions</li>
            <li>• Must-have vs. nice-to-have features</li>
            <li>• Fuel efficiency priorities</li>
          </ul>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-center gap-3 mb-3">
            <DollarSign className="h-5 w-5 text-[#EB0A1E]" />
            <h3 className="font-semibold text-lg text-[#111827]">Set Your Budget</h3>
          </div>
          <p className="text-[#4B5563] text-sm mb-4">
            Beyond the purchase price, factor in insurance, maintenance, fuel, and registration costs.
          </p>
          <ul className="space-y-2 text-sm text-[#374151]">
            <li>• Monthly payment comfort zone</li>
            <li>• Down payment amount</li>
            <li>• Trade-in vehicle value</li>
            <li>• Total cost of ownership</li>
          </ul>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-center gap-3 mb-3">
            <MapPin className="h-5 w-5 text-[#EB0A1E]" />
            <h3 className="font-semibold text-lg text-[#111827]">Research & Test Drive</h3>
          </div>
          <p className="text-[#4B5563] text-sm mb-4">
            Read reviews, compare models, and most importantly, drive the vehicles you're considering.
          </p>
          <ul className="space-y-2 text-sm text-[#374151]">
            <li>• Professional reviews and ratings</li>
            <li>• Owner feedback and reliability data</li>
            <li>• Test drives in various conditions</li>
            <li>• Dealer reputation and service</li>
          </ul>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-center gap-3 mb-3">
            <FileText className="h-5 w-5 text-[#EB0A1E]" />
            <h3 className="font-semibold text-lg text-[#111827]">Complete Your Purchase</h3>
          </div>
          <p className="text-[#4B5563] text-sm mb-4">
            Understand all paperwork, warranties, and additional products before signing.
          </p>
          <ul className="space-y-2 text-sm text-[#374151]">
            <li>• Financing terms and interest rates</li>
            <li>• Warranty coverage and length</li>
            <li>• Extended protection plans</li>
            <li>• Delivery and first service</li>
          </ul>
        </div>
      </div>
    </div>
  );

  const FinancingContent = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-[#111827] mb-4">Financing Options & Budget Planning</h2>
        <p className="text-[#4B5563] text-lg">
          Understanding your financing options helps you get the best deal and payment structure for your situation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="rounded-xl border-2 border-[#EB0A1E] bg-white p-6">
          <h3 className="font-bold text-xl text-[#111827] mb-3">Financing</h3>
          <p className="text-[#4B5563] text-sm mb-4">
            Own your vehicle with monthly payments. Build equity and customize as you wish.
          </p>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-[#6B7280]">Ownership</span>
              <span className="font-medium text-[#111827]">You own it</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#6B7280]">Mileage</span>
              <span className="font-medium text-[#111827]">No limits</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#6B7280]">Modifications</span>
              <span className="font-medium text-[#111827]">Allowed</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#6B7280]">End of term</span>
              <span className="font-medium text-[#111827]">Vehicle is yours</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="font-bold text-xl text-[#111827] mb-3">Leasing</h3>
          <p className="text-[#4B5563] text-sm mb-4">
            Lower monthly payments with the option to upgrade to newer models regularly.
          </p>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-[#6B7280]">Ownership</span>
              <span className="font-medium text-[#111827]">Toyota owns it</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#6B7280]">Mileage</span>
              <span className="font-medium text-[#111827]">Annual limits</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#6B7280]">Modifications</span>
              <span className="font-medium text-[#111827]">Not allowed</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#6B7280]">End of term</span>
              <span className="font-medium text-[#111827]">Return or buy</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="font-bold text-xl text-[#111827] mb-3">Cash Purchase</h3>
          <p className="text-[#4B5563] text-sm mb-4">
            Pay in full upfront. No monthly payments, no interest, complete ownership from day one.
          </p>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-[#6B7280]">Monthly payment</span>
              <span className="font-medium text-[#111827]">$0</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#6B7280]">Interest</span>
              <span className="font-medium text-[#111827]">None</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#6B7280]">Credit check</span>
              <span className="font-medium text-[#111827]">Not required</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#6B7280]">Flexibility</span>
              <span className="font-medium text-[#111827]">Complete</span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-[#F9FAFB] p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-[#EB0A1E] mt-0.5" />
          <div>
            <h3 className="font-semibold text-[#111827] mb-2">Budget Planning Tips</h3>
            <p className="text-[#4B5563] text-sm mb-3">
              Keep your total monthly vehicle expenses (payment, insurance, fuel) under 15-20% of your income.
            </p>
            <ul className="space-y-1 text-sm text-[#374151]">
              <li>• Get pre-approved for financing to know your rate</li>
              <li>• Consider certified pre-owned for lower payments</li>
              <li>• Factor in your trade-in value</li>
              <li>• Don't forget taxes, registration, and dealer fees</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const FeaturesContent = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-[#111827] mb-4">Toyota Key Features & Technologies</h2>
        <p className="text-[#4B5563] text-lg">
          Understanding Toyota's core technologies and features helps you choose the right model and trim level.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-6 w-6 text-[#EB0A1E]" />
            <h3 className="font-bold text-xl text-[#111827]">Toyota Safety Sense 2.0</h3>
          </div>
          <p className="text-[#4B5563] text-sm mb-4">
            Standard on most models, this suite includes advanced safety features to help prevent accidents.
          </p>
          <ul className="space-y-2 text-sm text-[#374151]">
            <li>• Pre-Collision System with Pedestrian Detection</li>
            <li>• Lane Departure Alert with Steering Assist</li>
            <li>• Automatic High Beams</li>
            <li>• Dynamic Radar Cruise Control</li>
            <li>• Road Sign Assist</li>
          </ul>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-center gap-3 mb-4">
            <Fuel className="h-6 w-6 text-[#EB0A1E]" />
            <h3 className="font-bold text-xl text-[#111827]">Hybrid Technology</h3>
          </div>
          <p className="text-[#4B5563] text-sm mb-4">
            Toyota's proven hybrid system combines gas and electric power for exceptional efficiency.
          </p>
          <ul className="space-y-2 text-sm text-[#374151]">
            <li>• No need to plug in - charges while you drive</li>
            <li>• Seamless switching between power sources</li>
            <li>• Reduced emissions and fuel costs</li>
            <li>• Available in cars, SUVs, and trucks</li>
            <li>• Over 20 years of proven reliability</li>
          </ul>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="h-6 w-6 text-[#EB0A1E]" />
            <h3 className="font-bold text-xl text-[#111827]">All-Wheel Drive</h3>
          </div>
          <p className="text-[#4B5563] text-sm mb-4">
            Enhanced traction and control for various weather and road conditions.
          </p>
          <ul className="space-y-2 text-sm text-[#374151]">
            <li>• Improved traction in snow and rain</li>
            <li>• Better handling on unpaved roads</li>
            <li>• Available on most SUVs and some cars</li>
            <li>• Automatic engagement when needed</li>
            <li>• Minimal impact on fuel economy</li>
          </ul>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-center gap-3 mb-4">
            <Award className="h-6 w-6 text-[#EB0A1E]" />
            <h3 className="font-bold text-xl text-[#111827]">Toyota Warranty</h3>
          </div>
          <p className="text-[#4B5563] text-sm mb-4">
            Comprehensive coverage for peace of mind during your ownership experience.
          </p>
          <ul className="space-y-2 text-sm text-[#374151]">
            <li>• 3-year/36,000-mile basic coverage</li>
            <li>• 5-year/60,000-mile powertrain warranty</li>
            <li>• 8-year/100,000-mile hybrid battery</li>
            <li>• 2-year/25,000-mile maintenance plan</li>
            <li>• Roadside assistance included</li>
          </ul>
        </div>
      </div>
    </div>
  );

  const OwnershipContent = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-[#111827] mb-4">Cost of Ownership</h2>
        <p className="text-[#4B5563] text-lg">
          Beyond the purchase price, these ongoing costs affect your total investment in vehicle ownership.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="font-bold text-lg text-[#111827] mb-3">Maintenance</h3>
          <p className="text-[#4B5563] text-sm mb-4">
            Regular service keeps your Toyota running efficiently and maintains its value.
          </p>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-[#6B7280]">Oil changes</span>
              <span className="font-medium">$50-80</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6B7280]">Tire rotation</span>
              <span className="font-medium">$35-50</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6B7280]">Annual service</span>
              <span className="font-medium">$300-600</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="font-bold text-lg text-[#111827] mb-3">Insurance</h3>
          <p className="text-[#4B5563] text-sm mb-4">
            Toyota's safety ratings often result in lower insurance premiums.
          </p>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-[#6B7280]">Compact cars</span>
              <span className="font-medium">$100-180/mo</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6B7280]">Midsize SUVs</span>
              <span className="font-medium">$120-220/mo</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6B7280]">Trucks</span>
              <span className="font-medium">$140-250/mo</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="font-bold text-lg text-[#111827] mb-3">Fuel & Registration</h3>
          <p className="text-[#4B5563] text-sm mb-4">
            Hybrid models significantly reduce fuel costs over time.
          </p>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-[#6B7280]">Gas vehicles</span>
              <span className="font-medium">$120-200/mo</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6B7280]">Hybrid vehicles</span>
              <span className="font-medium">$80-130/mo</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6B7280]">Registration</span>
              <span className="font-medium">$50-200/year</span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-[#F9FAFB] p-6">
        <h3 className="font-semibold text-[#111827] mb-4">Resale Value Considerations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-[#111827] mb-2">Factors that help resale value:</h4>
            <ul className="space-y-1 text-sm text-[#374151]">
              <li>• Regular maintenance records</li>
              <li>• Popular color choices (white, black, silver)</li>
              <li>• Desirable features and options</li>
              <li>• Low mileage for vehicle age</li>
              <li>• No accident history</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-[#111827] mb-2">Toyota models with strong resale:</h4>
            <ul className="space-y-1 text-sm text-[#374151]">
              <li>• Prius and Camry Hybrid</li>
              <li>• RAV4 and Highlander</li>
              <li>• Tacoma and Tundra trucks</li>
              <li>• 4Runner and Land Cruiser</li>
              <li>• Corolla (especially hybrid)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const ModelsContent = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-[#111827] mb-4">Model Comparison Guide</h2>
        <p className="text-[#4B5563] text-lg">
          Compare popular Toyota models to find the best fit for your needs and budget.
        </p>
      </div>

      <div className="space-y-6">
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
          <div className="bg-[#111827] text-white p-4">
            <h3 className="font-bold text-lg">Compact Cars</h3>
            <p className="text-gray-300 text-sm">Efficient, affordable, perfect for city driving</p>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-[#111827] mb-2">Corolla (Starting ~$24k)</h4>
              <ul className="space-y-1 text-sm text-[#374151]">
                <li>• Best-in-class fuel economy (up to 54 mpg hybrid)</li>
                <li>• Toyota Safety Sense 2.0 standard</li>
                <li>• Spacious interior for its size</li>
                <li>• Strong resale value</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-[#111827] mb-2">GR86 (Starting ~$31k)</h4>
              <ul className="space-y-1 text-sm text-[#374151]">
                <li>• Sports car performance and handling</li>
                <li>• Manual or automatic transmission</li>
                <li>• Rear-wheel drive excitement</li>
                <li>• Track-ready capabilities</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
          <div className="bg-[#111827] text-white p-4">
            <h3 className="font-bold text-lg">Midsize Options</h3>
            <p className="text-gray-300 text-sm">Balance of space, efficiency, and comfort</p>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-[#111827] mb-2">Camry (Starting ~$26k)</h4>
              <ul className="space-y-1 text-sm text-[#374151]">
                <li>• Available hybrid with 50+ mpg</li>
                <li>• Roomy backseat and trunk</li>
                <li>• Strong acceleration and handling</li>
                <li>• Advanced infotainment system</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-[#111827] mb-2">Prius (Starting ~$28k)</h4>
              <ul className="space-y-1 text-sm text-[#374151]">
                <li>• Industry-leading hybrid efficiency</li>
                <li>• Unique, aerodynamic styling</li>
                <li>• Surprising interior space</li>
                <li>• Prime plug-in version available</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
          <div className="bg-[#111827] text-white p-4">
            <h3 className="font-bold text-lg">SUVs</h3>
            <p className="text-gray-300 text-sm">Versatility, space, and capability for families</p>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-[#111827] mb-2">RAV4 (Starting ~$30k)</h4>
              <ul className="space-y-1 text-sm text-[#374151]">
                <li>• Best-selling SUV in America</li>
                <li>• Available AWD and hybrid powertrains</li>
                <li>• Excellent cargo space</li>
                <li>• Strong off-road capability (TRD trim)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-[#111827] mb-2">Highlander (Starting ~$37k)</h4>
              <ul className="space-y-1 text-sm text-[#374151]">
                <li>• Three rows of seating (8 passengers)</li>
                <li>• Hybrid available with great fuel economy</li>
                <li>• Smooth, comfortable ride</li>
                <li>• Premium interior materials</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
          <div className="bg-[#111827] text-white p-4">
            <h3 className="font-bold text-lg">Trucks</h3>
            <p className="text-gray-300 text-sm">Work capability with everyday comfort</p>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-[#111827] mb-2">Tacoma (Starting ~$32k)</h4>
              <ul className="space-y-1 text-sm text-[#374151]">
                <li>• Midsize truck with excellent resale</li>
                <li>• Available 4WD for off-road adventures</li>
                <li>• Multiple bed lengths and cab sizes</li>
                <li>• TRD Pro for serious off-roading</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-[#111827] mb-2">Tundra (Starting ~$40k)</h4>
              <ul className="space-y-1 text-sm text-[#374151]">
                <li>• Full-size capability with hybrid power</li>
                <li>• Best-in-class towing capacity</li>
                <li>• Spacious crew cab interior</li>
                <li>• Advanced technology features</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "financing": return <FinancingContent />;
      case "features": return <FeaturesContent />;
      case "ownership": return <OwnershipContent />;
      case "models": return <ModelsContent />;
      default: return <OverviewContent />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <h1 className="text-2xl font-bold text-[#111827] mb-6">Need Help?</h1>
            <nav className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id as Section)}
                  className={cn(
                    "w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3",
                    activeSection === section.id
                      ? "bg-[#EB0A1E] text-white"
                      : "hover:bg-gray-100 text-[#374151]"
                  )}
                >
                  {section.icon}
                  <span className="font-medium">{section.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default BuyersGuide;
