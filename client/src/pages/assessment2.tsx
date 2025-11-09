import { useState } from "react";
import { Progress } from "@/components/ui/progress"
import { TextBox, SmallTextBox } from "@/components/ui/textbox"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"

"use client";

function AssessmentPageTwo() {
    // allow null initially (none selected)
    const [selectedBox, setSelectedBox] = useState<number | null>(null);
    const [sliderValue, setSliderValue] = useState([1]);

    return(
        <>
        <div className=" w-full h-full px-4 py-2 bg-gray-100 overflow-y:scroll">
                <br />
            
            {/* Progress Bar */}
            <div>
                <Progress 
                className="bg-gray-300"
                value={66} />
            </div>

            {/* Text */}
            <div>
                <br></br>
                <h4 className="text-center font-sans font-bold">Step 2 of 3: Lifestyle Assessment </h4>
                <br />
            </div>

            {/* Previous and Next Page Buttons */}
            <div className="flex flex-row justify-center gap-350">
                <Button 
                className="bg-gray-300 hover:bg-red-500 hover:text-white"
                size="lg"
                variant="outline"
                asChild>
                    <a href="@/pages/CarExplorer.tsx">Previous Page</a>
                </Button>

                <Button 
                className="bg-gray-300 hover:bg-red-500 hover:text-white"
                size="lg"
                variant="outline"
                onClick={() => console.log("clicked")}>
                    Next Page
                </Button>
            </div>
            <br />

            {/* "Tell Us About Your Typical Day" block */}
            <div className="h-50 bg-white border-2 rounded-2xl">
            <div className="h-50 rounded-2xl flex flex-col justify-center items-center">
                <TextBox 
                    title="Pick the option which best describes you"
                    subtitle="This helps us understand which Toyota fits your lifestyle best"
                    height=""
                    className="bg-white border-hidden"
                    className2="text-black text-4xl"
                    className3="text-red-500"
                />

            </div>
            </div>

            {/* Lifestyle Selection block */}
            <br></br>
            <div className="flex flex-row justify-center gap-18"> {/* Check the spacing */}
                <SmallTextBox 
                    title="First-Time Buyer" 
                    subtitle="Entry-level budget, focus on essentials and reliability" 
                    subtext="Compact models, low maintenance costs, fuel efficiency"
                    height="h-40"
                    width="w-200"
                    selected={selectedBox === 1}
                    onClick={() => setSelectedBox(1)}
                />

                <SmallTextBox 
                    title="Budget Conscious" 
                    subtitle="Practical spending, emphasis on value and efficiency" 
                    subtext="Affordable ownership, solid mileage, dependable build"
                    height="h-40"
                    width="w-200"
                    selected={selectedBox === 2}
                    onClick={() => setSelectedBox(2)}
                />
            </div>
            <br />

            <div className="flex flex-row justify-center gap-18">
                <SmallTextBox 
                    title="Mid-Range Buyer" 
                    subtitle="Moderate income, balanced comfort and technology" 
                    subtext="Reliable brands, stylish interiors, good resale value"
                    height="h-40"
                    width="w-200"
                    selected={selectedBox === 3}
                    onClick={() => setSelectedBox(3)}
                />

                <SmallTextBox 
                    title="Family Earner" 
                    subtitle="Shared income, balance between cost and comfort" 
                    subtext="Spacious cabins, safety priority, long-term value"
                    height="h-40"
                    width="w-200"
                    selected={selectedBox === 4}
                    onClick={() => setSelectedBox(4)}
                />
            </div>
            <br />

            <div className="flex flex-row justify-center gap-18">
                <SmallTextBox 
                    title="High Net Worth" 
                    subtitle="Upper-tier income, exclusivity and personalization focus" 
                    subtext="Top-tier models, advanced tech, bespoke interiors"
                    height="h-40"
                    width="w-200"
                    selected={selectedBox === 5}
                    onClick={() => setSelectedBox(5)}
                />

                <SmallTextBox 
                    title="Premium Segment" 
                    subtitle="Higher income, preference for refinement and quality" 
                    subtext="Luxury features, smooth performance, strong brand appeal"
                    height="h-40"
                    width="w-200"
                    selected={selectedBox === 6}
                    onClick={() => setSelectedBox(6)}
                />
            </div>

            
            <br />
            <br />

            {/* Number of People Transported - Block */}

            <div className="text-center bg-white rounded-2xl border border-gray-300">
                <div className="flex flex-col py-5"> {/* Title Section */}
                    <TextBox 
                    title="How many people do you typically transport?"
                    subtitle={`You selected: ${sliderValue[0]}`}
                    className="border-hidden h-20"
                    className2="align-text-top"
                    className3="text-2xl text-red-500"
                    />
                    
                    <div className="px-20 py-10 border-hidden border-gray-300">
                        <Slider 
                        className=""
                        min={1}
                        max={8}
                        defaultValue={[1]}
                        value={sliderValue}
                        onValueChange={setSliderValue}
                        />
                    </div>
                </div>
                    
            </div>
            <br />
            <br />

            {/* Previous and Next Page Buttons */}
            <div className="flex flex-row justify-center gap-18">
                <Button 
                className="bg-gray-300 hover:bg-red-500 hover:text-white"
                size="lg"
                variant="outline">
                    Previous Page
                </Button>

                <Button 
                className="bg-gray-300 hover:bg-red-500 hover:text-white"
                size="lg"
                variant="outline"
                onClick={() => console.log("clicked")}>
                    Next Page
                </Button>
            </div>
            <br />
            <br />
                
        </div>
        </>
    )
}

export default AssessmentPageTwo