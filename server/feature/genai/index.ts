import {
  GoogleGenAI,
  GenerationConfig,
} from '@google/genai';

export async function generateContent(prompt: string): Promise<string> {
  console.log("Called into genAI")
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });
  const config: GenerationConfig = {
    thinkingConfig: {
      thinkingBudget: -1,
    },
  };
  const model = 'gemini-2.5-pro';
  const contents = [
    {
      role: 'user',
      parts: [
        {
          text: prompt,
        },
      ],
    },
  ];

  const response = await ai.models.generateContentStream({
    model,
    config,
    contents,
  });

  console.log("Received initial stream");

  let r: string = ""

  for await (const chunk of response) {
    console.log(chunk.text);
    r = r+chunk.text;
  }

  console.log("Resolving promise");

  return r;
}

export async function generatePriorityAdjustments(
  refinementQuery: string,
  currentPriorities: {
    pricePriority: number;
    mpgPriority: number;
    transmissionPriority: number;
    electricPriority: number;
    mileagePriority: number;
    fuelTypePriority: number;
  }
): Promise<typeof currentPriorities> {
  console.log("Called into genAI for priority adjustments");
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  // Define the JSON schema for structured output
  const responseJsonSchema = {
    type: "object",
    properties: {
      pricePriority: {
        type: "number",
        description: "Priority for price (1-10, where 1=low, 5=medium, 10=high)"
      },
      mpgPriority: {
        type: "number",
        description: "Priority for MPG/fuel efficiency (1-10, where 1=low, 5=medium, 10=high)"
      },
      transmissionPriority: {
        type: "number",
        description: "Priority for transmission type (1-10, where 1=low, 5=medium, 10=high)"
      },
      electricPriority: {
        type: "number",
        description: "Priority for electric/hybrid vehicles (1-10, where 1=low, 5=medium, 10=high)"
      },
      mileagePriority: {
        type: "number",
        description: "Priority for vehicle mileage (1-10, where 1=low, 5=medium, 10=high)"
      },
      fuelTypePriority: {
        type: "number",
        description: "Priority for fuel type (1-10, where 1=low, 5=medium, 10=high)"
      }
    },
    required: ["pricePriority", "mpgPriority", "transmissionPriority", "electricPriority", "mileagePriority", "fuelTypePriority"]
  };

  const config: GenerationConfig = {
    thinkingConfig: {
      thinkingBudget: -1,
    },
    responseMimeType: "application/json",
    responseJsonSchema: responseJsonSchema,
  };

  const prompt = `You are a car shopping assistant that adjusts search priorities based on user feedback.

Current priorities (scale 1-10, where 1=low importance, 5=medium importance, 10=high importance):
${JSON.stringify(currentPriorities, null, 2)}

User refinement request: "${refinementQuery}"

Analyze the user's request and adjust the priorities accordingly. Use these guidelines:
- Small adjustments (e.g., "a bit more", "slightly"): ±1-2 priority
- Medium adjustments (e.g., "more", "less"): ±3-4 priority  
- Large adjustments (e.g., "much more", "way more", "prioritize"): ±5-7 priority
- Keep all priorities within the 1-10 range
- If the user mentions a specific factor (price, fuel efficiency, mileage, transmission, fuel type, etc.), adjust that priority
- If the user wants something "cheaper" or "more affordable", increase pricePriority
- If the user wants "better gas mileage" or "fuel efficient", increase mpgPriority
- If the user wants "lower mileage" or "newer", increase mileagePriority
- If the user mentions transmission type (automatic, manual), adjust transmissionPriority
- If the user mentions fuel type (gas, diesel, hybrid, electric), adjust fuelTypePriority
- If the user wants "electric" or "hybrid", increase electricPriority and fuelTypePriority

Return the adjusted priorities as a JSON object.`;

  const model = 'gemini-2.5-flash';
  const contents = [
    {
      role: 'user',
      parts: [
        {
          text: prompt,
        },
      ],
    },
  ];

  const response = await ai.models.generateContentStream({
    model,
    config,
    contents,
  });

  console.log("Received initial stream for priority adjustments");

  let r: string = "";

  for await (const chunk of response) {
    console.log(chunk.text);
    r = r + chunk.text;
  }

  console.log("Resolving priority adjustments promise");

  return JSON.parse(r);
}

