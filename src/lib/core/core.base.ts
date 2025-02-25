import { Runnable } from "@langchain/core/runnables";
import { ChatOpenAI } from "@langchain/openai";

export abstract class BaseLlm {
  private modelName: string;
  private apiKey: string;
  private maxTokens: number;
  private streaming: boolean;
  private audio: boolean;
  protected runnables: any = [];
  constructor(
    modelName: string,
    apiKey: string,
    maxTokens: number,
    streaming: boolean,
    audio: boolean,
  ) {
    this.modelName = modelName;
    this.apiKey = apiKey;
    this.maxTokens = maxTokens;
    this.streaming = streaming;
    this.audio = audio;
  }
  public setRunnable(runnable: any) {
    this.runnables.push(runnable);
    return this;
  }
}

export interface IStream {
  generateStream(params: any): any;
}

export interface INormal {
  generateResponse(params: any): any;
}
