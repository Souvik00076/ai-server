import { BaseLlm, INormal, IStream } from "./core.base";
import { RunnableSequence } from "@langchain/core/runnables";
import { IterableReadableStream } from "@langchain/core/utils/stream";
import { ChatGroq } from "@langchain/groq";

export class Groq extends BaseLlm implements IStream, INormal {
  private instance: ChatGroq;
  constructor(
    modelName: string,
    apiKey: string,
    maxTokens: number,
    streaming: boolean,
    audio: boolean,
  ) {
    super(modelName, apiKey, maxTokens, streaming, audio);
    console.log(streaming);
    this.instance = new ChatGroq({
      model: modelName,
      apiKey,
      streaming,
    });
  }
  public getInstance() {
    return this.instance as ChatGroq;
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
