import { GoogleGenAI } from "@google/genai";
import { StockData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are a top-tier financial analyst AI. Your goal is to provide accurate, real-time stock market data and concise, actionable insights using Google Search.

When asked about a stock ticker:
1.  Use the 'googleSearch' tool to find the LATEST real-time price and percentage change for the current trading day.
2.  Find the most relevant recent news articles explaining the price movement.
3.  Synthesize this into a clear analysis.

You MUST format your text response strictly as follows so it can be parsed:
PRICE: [Exact Price, e.g. 150.25]
CHANGE: [Percentage Change with sign, e.g. +1.50% or -0.45%]
ANALYSIS: [A concise 2-3 sentence summary of why the stock is moving today, based on news.]
DETAILS: [A more detailed breakdown of the bullish and bearish factors, use Markdown bullet points.]

If you cannot find the specific data, return "PRICE: N/A" and explain why in the analysis.
`;

export const analyzeStock = async (ticker: string): Promise<StockData> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Get the current stock price, daily percentage change, and market analysis for ${ticker}.`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }],
        temperature: 0.2, // Low temperature for factual accuracy
      },
    });

    const text = response.text || "";
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.map((chunk) => ({
        title: chunk.web?.title || "Source",
        url: chunk.web?.uri || "#",
      }))
      .filter((s) => s.url !== "#") || [];

    // Simple parsing logic based on the enforced format
    const priceMatch = text.match(/PRICE:\s*([0-9.,]+)/i);
    const changeMatch = text.match(/CHANGE:\s*([+\-]?\d+\.?\d*%?)/i);
    
    // Extract Analysis (Everything between ANALYSIS: and DETAILS:)
    const analysisMatch = text.match(/ANALYSIS:\s*([\s\S]*?)(?=DETAILS:|$)/i);
    // Extract Details (Everything after DETAILS:)
    const detailsMatch = text.match(/DETAILS:\s*([\s\S]*)/i);

    const priceStr = priceMatch ? priceMatch[1] : "N/A";
    const changeStr = changeMatch ? changeMatch[1] : "0.00%";
    
    let cleanAnalysis = analysisMatch ? analysisMatch[1].trim() : "Analysis not available.";
    const details = detailsMatch ? detailsMatch[1].trim() : "";

    // Combine summary and details for the full view
    const fullAnalysis = `### Market Summary\n${cleanAnalysis}\n\n### Detailed Insights\n${details}`;

    const priceVal = parseFloat(priceStr.replace(/,/g, ''));
    const changeVal = parseFloat(changeStr.replace('%', ''));

    // Generate synthetic intraday data for visualization purposes
    // since we can't get granular minute-data from text search easily.
    const chartData = generateSyntheticIntraday(priceVal, changeVal);

    return {
      ticker: ticker.toUpperCase(),
      price: priceStr,
      change: changeStr,
      changeValue: isNaN(changeVal) ? 0 : changeVal,
      analysis: fullAnalysis,
      sources: sources,
      lastUpdated: new Date(),
      chartData,
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to fetch stock data. Please try again.");
  }
};

// Helper to generate a realistic-looking random walk chart that ends at the current price
// and respects the overall day trend.
const generateSyntheticIntraday = (currentPrice: number, changePercent: number) => {
  const dataPoints = 30;
  const data = [];
  
  if (isNaN(currentPrice)) {
    // Default flat line if no price
    for (let i = 0; i < dataPoints; i++) {
        data.push({ time: `${9 + Math.floor(i/4)}:${(i%4)*15}`, value: 100 });
    }
    return data;
  }

  // Calculate open price based on change
  const openPrice = currentPrice / (1 + (changePercent / 100));
  let volatility = openPrice * 0.005; // 0.5% volatility per step

  let currentValue = openPrice;
  
  // Create a trend bias to ensure we end up roughly near currentPrice
  const stepSize = (currentPrice - openPrice) / dataPoints;

  for (let i = 0; i < dataPoints; i++) {
    // Random noise
    const noise = (Math.random() - 0.5) * volatility;
    
    // Add trend component + noise
    currentValue += stepSize + noise;

    // Formatting time (fake 9:30 AM to 4:00 PM spread)
    const totalMinutes = 390; // 6.5 hours
    const minuteStep = totalMinutes / dataPoints;
    const currentMinuteOfDay = 9 * 60 + 30 + (i * minuteStep);
    const hour = Math.floor(currentMinuteOfDay / 60);
    const minute = Math.floor(currentMinuteOfDay % 60);
    const timeStr = `${hour}:${minute.toString().padStart(2, '0')}`;

    data.push({
      time: timeStr,
      value: parseFloat(currentValue.toFixed(2))
    });
  }
  
  // Force the last point to match exact current price for consistency
  data[data.length - 1].value = currentPrice;

  return data;
};
