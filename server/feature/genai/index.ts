// To run this code you need to install the following dependencies:
// npm install @google/genai mime
// npm install -D @types/node

import {
  GoogleGenAI,
} from '@google/genai';

export async function generateContent(prompt: string): Promise<string> {
  console.log("Called into genAI")
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });
  const config = {
    thinkingConfig: {
      thinkingBudget: -1,
    },
    imageConfig: {
      imageSize: '1K',
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

