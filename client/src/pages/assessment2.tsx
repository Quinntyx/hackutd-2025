import { useState } from "react";
import { Progress } from "@/components/ui/progress"
import { TextBox, SmallTextBox } from "@/components/ui/textbox"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"

interface AssessmentPageTwoProps {
  onComplete: (incomeBracket: number) => void;
  onBack: () => void;
}

function AssessmentPageTwo({ onComplete, onBack }: AssessmentPageTwoProps) {
    const [selectedBox, setSelectedBox] = useState<number | null>(null);
    const [sliderValue, setSliderValue] = useState([3]); // Default to middle value
    
    return(
        <div className="min-h-screen w-full bg-linear-to-b from-gray-50 to-white">
            <div className="max-w-7xl mx-auto px-6 py-8">
                
                {/* Progress Bar Section */}
                <div className="mb-10">
                    <Progress 
                        className="bg-gray-200 h-2"
                        value={66} 
                    />
                    <p className="text-sm text-gray-500 mt-2 text-right">Step 2 of 3</p>
                </div>
                
                {/* Header Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-3">
                        Lifestyle Assessment
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Help us find the perfect Toyota for your unique lifestyle
                    </p>
                </div>
                
                {/* Main Content Card */}
                <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12 mb-10">
                    
                    {/* Introduction */}
                    <div className="text-center mb-12">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                            Pick the option which best describes you
                        </h2>
                        <p className="text-red-600 text-base">
                            This helps us understand which Toyota fits your lifestyle best
                        </p>
                    </div>
                    
                    {/* Lifestyle Options Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
                        <SmallTextBox 
                            title="First-Time Buyer" 
                            subtitle="Entry-level budget, focus on essentials and reliability" 
                            subtext="Compact models, low maintenance costs, fuel efficiency"
                            height="h-48"
                            width="w-full"
                            selected={selectedBox === 1}
                            onClick={() => setSelectedBox(1)}
                        />
                        <SmallTextBox 
                            title="Budget Conscious" 
                            subtitle="Practical spending, emphasis on value and efficiency" 
                            subtext="Affordable ownership, solid mileage, dependable build"
                            height="h-48"
                            width="w-full"
                            selected={selectedBox === 2}
                            onClick={() => setSelectedBox(2)}
                        />
                        <SmallTextBox 
                            title="Mid-Range Buyer" 
                            subtitle="Moderate income, balanced comfort and technology" 
                            subtext="Reliable brands, stylish interiors, good resale value"
                            height="h-48"
                            width="w-full"
                            selected={selectedBox === 3}
                            onClick={() => setSelectedBox(3)}
                        />
                        <SmallTextBox 
                            title="Family Earner" 
                            subtitle="Shared income, balance between cost and comfort" 
                            subtext="Spacious cabins, safety priority, long-term value"
                            height="h-48"
                            width="w-full"
                            selected={selectedBox === 4}
                            onClick={() => setSelectedBox(4)}
                        />
                        <SmallTextBox 
                            title="Premium Segment" 
                            subtitle="Higher income, preference for refinement and quality" 
                            subtext="Luxury features, smooth performance, strong brand appeal"
                            height="h-48"
                            width="w-full"
                            selected={selectedBox === 5}
                            onClick={() => setSelectedBox(5)}
                        />
                        <SmallTextBox 
                            title="High Net Worth" 
                            subtitle="Upper-tier income, exclusivity and personalization focus" 
                            subtext="Top-tier models, advanced tech, bespoke interiors"
                            height="h-48"
                            width="w-full"
                            selected={selectedBox === 6}
                            onClick={() => setSelectedBox(6)}
                        />
                    </div>
                    
                    {/* Passenger Capacity Section */}
                    <div className="bg-gray-50 rounded-2xl p-8 md:p-10">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                                How many people do you typically transport?
                            </h2>
                            <p className="text-3xl font-bold text-red-600 mt-4">
                                {sliderValue[0]} {sliderValue[0] === 1 ? 'Person' : 'People'}
                            </p>
                        </div>
                        
                        <div className="max-w-2xl mx-auto px-4">
                            <Slider 
                                className="mb-4"
                                min={1}
                                max={8}
                                defaultValue={[1]}
                                value={sliderValue}
                                onValueChange={setSliderValue}
                            />
                            <div className="flex justify-between text-sm text-gray-500 px-1">
                                <span>1</span>
                                <span>8+</span>
                            </div>
                        </div>
                    </div>
                    
                </div>
                
                {/* Navigation Buttons */}
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pb-12">
                    <div className="flex gap-4">
                        <Button 
                            type="button"
                            variant="outline"
                            className="flex-1 py-6 text-lg font-medium rounded-xl border-gray-300"
                            onClick={onBack}
                        >
                            Back
                        </Button>
                        <Button 
                            type="button"
                            className="flex-1 py-6 text-lg font-medium bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors duration-200"
                            onClick={() => selectedBox !== null && onComplete(selectedBox)}
                            disabled={selectedBox === null}
                        >
                            Continue to Recommendations
                        </Button>
                    </div>
                </div>
                
            </div>
        </div>
    )
}

export default AssessmentPageTwo