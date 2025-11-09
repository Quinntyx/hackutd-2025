import { ProgressBar } from "@/components/ui/progressbar"
import { TextBox, SmallTextBox } from "@/components/ui/textbox"


const currentProgress = 33;

function AssessmentPageTwo() {
    return(
        <>
        <div className="h-200 w-full">
            <br></br>
        {/* Progress Bar */}
        <div>
            <ProgressBar className="mx-auto h-2 w-full" defaultValue={[currentProgress]} disabled/>
        </div>

        {/* Text */}
        <div>
            <br></br>
            <h4 className="text-center font-sans font-bold">Step 1 of 3: Lifestyle Assessment </h4>
            <br></br>
        </div>

        {/* "Tell Us About Your Typical Day" block */}
        <div className="h-50 bg-white border-2 rounded-2xl">
        <div className="h-50 rounded-2xl flex flex-col justify-center items-center">
            <TextBox 
                title="Tell us about your typical day"
                subtitle="This helps us understand which Toyota fits your lifestyle best"
                height=""
                className="bg-white border-hidden"
                className2="text-black text-4xl"
                className3="text-gray-600"
            />

        </div>
        </div>

        {/* Lifestyle Selection block */}
        <br></br>
        <div className="">
            <p>test</p>
            <SmallTextBox title="City Commuter" subtitle="I mostly drive in the city with occasional highway trips." subtext=""/>
        </div>
        </div>
        </>
    )
}

export default AssessmentPageTwo