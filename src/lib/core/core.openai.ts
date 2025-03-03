import { ChatOpenAI } from "@langchain/openai";
import { BaseLlm, INormal, IStream } from "./core.base";
import { RunnableSequence } from "@langchain/core/runnables";
import { Ollama, OllamaCamelCaseOptions } from "@langchain/ollama";
import {
  BaseChatModelParams,
  BaseChatModelCallOptions,
  BaseChatModel,
} from "@langchain/core/language_models/chat_models";
export class OpenAI extends BaseLlm implements IStream, INormal {
  private instance: Ollama;
  constructor(
    modelName: string,
    apiKey: string,
    maxTokens: number,
    streaming: boolean,
    audio: boolean,
  ) {
    super(modelName, apiKey, maxTokens, streaming, audio);
    this.instance = new Ollama({
      model: "deepseek-r1:1.5b",
    });
    /*
     *
     *   this.instance = new ChatGroq({
      model: "mixtral-8x7b-32768",
      apiKey: "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",
    });
    */
  }
  public getInstance() {
    return this.instance;
  }
  generateStream(params: any): any {}
  async generateResponse(params: any) {
    if (this.runnables.length === 0) {
      throw new Error("No runnables found");
    }
    const chain = RunnableSequence.from(this.runnables as any);
    const data = await chain.invoke(params);
    return data;
  }
}
