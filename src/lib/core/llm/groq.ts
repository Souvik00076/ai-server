import { ChatGroq } from "@langchain/groq";

class GroqLLMSingleton {
  private static instance: ChatGroq;
  private constructor() {}
  public static getInstance(): ChatGroq {
    if (!GroqLLMSingleton.instance) {
      GroqLLMSingleton.instance = new ChatGroq({
        model: "llama-3.3-70b-versatile",
        temperature: 0,
        maxTokens: undefined,
        maxRetries: 2,
        apiKey: process.env.GROQ_API_KEY,
      });
      GroqLLMSingleton.instance.bind({
        response_format: { type: "json_object" },
      });
    }
    return GroqLLMSingleton.instance;
  }
}

export default GroqLLMSingleton;
