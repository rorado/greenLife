import { NextResponse } from "next/server";
import Groq from "groq-sdk";

// Make sure you set GROQ_API_KEY in your environment variables
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  try {
    const { weather, soil } = await req.json();

    const prompt = `
You are an agricultural AI assistant.

Analyze this farm data and return a JSON object with:

- A list of plants suitable to grow:
  - title: plant name
  - value: why it is suitable based on weather and soil and we can plant at that moment
  - score : a score from 0 to 10 is can be planted at that moment based on weather and soil conditions

Return JSON only. Do not add any extra text.

Weather:
- Temperature: ${weather.temperature}
- Humidity: ${weather.humidity}
- Rain: ${weather.precipitation}
- UV: ${weather.uvIndex}

Soil:
- Nitrogen: ${soil.nitrogen}
- Phosphorus: ${soil.phosphorus}
- Potassium: ${soil.potassium}
- pH: ${soil.ph}
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: "You are a helpful agricultural assistant.",
        },
        { role: "user", content: prompt },
      ],
      max_completion_tokens: 1024,
      temperature: 0.7,
    });

    const text = completion.choices[0]?.message?.content || "";

    let analysis;
    try {
      analysis = JSON.parse(text);
    } catch {
      // Fallback if AI returns invalid JSON
      analysis = {
        plants: [
          { title: "Tomato", value: "Moderate soil and warm weather" },
          { title: "Lettuce", value: "Grows well with moisture" },
          { title: "Carrot", value: "Cool temperature and balanced nutrients" },
        ],
      };
    }

    console.log("[AI ANALYSIS]", analysis);

    return NextResponse.json({ analysis });
  } catch (err) {
    console.error("[AI ERROR]", err);
    return NextResponse.json({
      analysis: {
        plants: [{ title: "Generic Crop", value: "Fallback plant" }],
      },
    });
  }
}
