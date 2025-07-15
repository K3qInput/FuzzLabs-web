import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyAc3TXrZktk2LC94iJZepkHowa7JpKk1m0");

export interface PriceComparison {
  service: string;
  seragronPrice: number;
  competitors: Array<{
    platform: string;
    price: number;
    serviceType: string;
    quality: string;
  }>;
  analysis: string;
  recommendation: string;
}

export async function comparePricing(serviceName: string, servicePrice: number, serviceDescription: string): Promise<PriceComparison> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `
You are a pricing analysis expert for Minecraft server services. Analyze the following service and compare it with competitors on platforms like BuiltByBit, Polymart, MC-Market, and Spigot.

Service: ${serviceName}
Price: $${servicePrice}
Description: ${serviceDescription}

Please provide a detailed comparison including:
1. Similar services on competitor platforms with their typical pricing
2. Analysis of value proposition
3. Market positioning recommendation
4. Price competitiveness assessment

Respond in JSON format with the following structure:
{
  "service": "${serviceName}",
  "seragronPrice": ${servicePrice},
  "competitors": [
    {
      "platform": "BuiltByBit",
      "price": 0,
      "serviceType": "similar service name",
      "quality": "description"
    }
  ],
  "analysis": "detailed market analysis",
  "recommendation": "pricing recommendation"
}

Focus on accuracy and provide realistic market data based on current Minecraft service pricing trends.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean up the response to ensure it's valid JSON
    const cleanedText = text.replace(/```json\n?/, '').replace(/```\n?$/, '').trim();
    const parsedResult = JSON.parse(cleanedText);
    
    return parsedResult as PriceComparison;

  } catch (error) {
    console.error('AI pricing analysis error:', error);
    
    // Fallback response if AI fails
    return {
      service: serviceName,
      seragronPrice: servicePrice,
      competitors: [
        {
          platform: "BuiltByBit",
          price: servicePrice * 1.2,
          serviceType: "Similar service",
          quality: "Standard quality"
        }
      ],
      analysis: "Unable to perform detailed analysis at this time. Please try again later.",
      recommendation: "Our pricing is competitive based on current market standards."
    };
  }
}

export async function getChatResponse(userMessage: string, context?: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const systemPrompt = `
You are Seragon's AI assistant, specializing in Minecraft server services and pricing. You help users understand our services and compare them with competitors.

Key information about Seragon:
- We offer affordable Minecraft server services ($2-30 range)
- Services include: Server Hosting, Custom Development, Design Services, Support Services, World Building, Server Management
- We compete with platforms like BuiltByBit, Polymart, MC-Market, and Spigot
- Our focus is on quality and affordability
- Contact is through Discord for purchases

Be helpful, knowledgeable, and professional. If users ask about pricing comparisons, provide detailed analysis.

${context ? `Context: ${context}` : ''}

User message: ${userMessage}
`;

    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    return response.text() || "I apologize, but I'm having trouble responding right now. Please try again later.";

  } catch (error) {
    console.error('AI chat error:', error);
    return "I'm currently experiencing technical difficulties. Please try again later or contact us directly through Discord.";
  }
}