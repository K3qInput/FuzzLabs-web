import OpenAI from "openai";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

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

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are an expert pricing analyst for Minecraft server services with deep knowledge of platforms like BuiltByBit, Polymart, MC-Market, and Spigot. Provide accurate, data-driven pricing comparisons."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 1000,
      temperature: 0.7
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    return result as PriceComparison;

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
    const systemPrompt = `
You are Seragon's AI assistant, specializing in Minecraft server services and pricing. You help users understand our services and compare them with competitors.

Key information about Seragon:
- We offer affordable Minecraft server services ($2-30 range)
- Services include: Server Hosting, Custom Development, Design Services, Support Services, World Building, Server Management
- We compete with platforms like BuiltByBit, Polymart, MC-Market, and Spigot
- Our focus is on quality and affordability
- Contact is through Discord for purchases

Be helpful, knowledgeable, and professional. If users ask about pricing comparisons, provide detailed analysis.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: `${context ? `Context: ${context}\n\n` : ''}${userMessage}`
        }
      ],
      max_tokens: 500,
      temperature: 0.8
    });

    return response.choices[0].message.content || "I apologize, but I'm having trouble responding right now. Please try again later.";

  } catch (error) {
    console.error('AI chat error:', error);
    return "I'm currently experiencing technical difficulties. Please try again later or contact us directly through Discord.";
  }
}