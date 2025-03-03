import { BaseLlm, INormal, IStream } from "./core.base";
import { RunnableSequence } from "@langchain/core/runnables";
import { IterableReadableStream } from "@langchain/core/utils/stream";
import { ChatOpenAI } from "@langchain/openai";

export class Groq extends BaseLlm implements IStream, INormal {
  private instance: ChatOpenAI;
  constructor(
    modelName: string,
    apiKey: string,
    maxTokens: number,
    streaming: boolean,
    audio: boolean,
  ) {
    super(modelName, apiKey, maxTokens, streaming, audio);
    console.log(streaming);
    this.instance = new ChatOpenAI({
      modelName,
      streaming,
      configuration: {
        apiKey,
        baseURL: "https://api.groq.com/openai/v1",
      },
    });
  }
  public getInstance() {
    return this.instance;
  }
  async generateStream(params: any): Promise<IterableReadableStream<any>> {
    if (this.runnables.length == 0) {
      throw new Error("No runnables found");
    }
    const chain = RunnableSequence.from(this.runnables as any);
    const stream = await chain.stream(params);
    return stream;
  }
  async generateResponse(params: any) {
    if (this.runnables.length === 0) {
      throw new Error("No runnables found");
    }
    const chain = RunnableSequence.from(this.runnables as any);
    const data = await chain.invoke(params);
    return data;
  }
}
