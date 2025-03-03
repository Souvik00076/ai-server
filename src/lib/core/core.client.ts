import { ClientConfig } from "@/src/@types";
import { RunnableSequence } from "@langchain/core/runnables";
import { ChatOpenAI } from "@langchain/openai";

export class Client {
  protected instance: ChatOpenAI;
  protected runnables: any[] = [];
  constructor(config: ClientConfig) {
    this.instance = new ChatOpenAI(config);
  }
  public getInstance() {
    return this.instance;
  }
  public setRunnable(runnable: any) {
    this.runnables.push(runnable);
    return this;
  }
  public async generateResponse(params: any) {
    if (this.runnables.length === 0) {
      throw new Error("No runnables found");
    }
    console.log("hello");
    const chain = RunnableSequence.from(this.runnables as any);
    const data = await chain.invoke(params);
    return data;
  }
}
