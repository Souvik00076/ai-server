export const getModelProviderUri = (
  provider: string,
):
  | {
      apiKey: string;
      baseURL: string;
    }
  | undefined => {
  if (provider === "groq")
    return {
      apiKey: process.env.GROQ_API_KEY!,
      baseURL: process.env.GROQ_BASE_URI!,
    };
  if (provider === "google")
    return {
      apiKey: process.env.GOOGLE_API_KEY!,
      baseURL: process.env.GOOGLE_BASE_URI!,
    };
  if (provider === "ollama")
    return {
      apiKey: process.env.OLLAMA_API_KEY!,
      baseURL: process.env.OLLAMA_BASE_URI!,
    };
  return undefined;
};
