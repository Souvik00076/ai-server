import { Router } from "express";
import type { Request, Response } from "express";
import { artifactsDecisionPrompt } from "../lib/prompts/prompts.artifacts_decision";
import {
  RunnableBranch,
  RunnableLambda,
  RunnableSequence,
} from "@langchain/core/runnables";
import { artifactsPrompt } from "../lib/prompts/prompts.artifacts_generation";
import { generalPrompt } from "../lib/prompts/prompts.general";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ClientConfig } from "../@types";
import { Client } from "../lib/core/core.client";
import { getModelProviderUri } from "../utils/getModelProviderUri";
const router = Router();
type TBody = {
  sentence: string;
  streaming: boolean;
  modelProvider: "google" | "groq" | "ollama";
  model: string;
};
router.post(
  "/",
  async (req: Request<unknown, unknown, TBody, unknown>, res: Response) => {
    const { sentence, streaming, modelProvider, model } = req.body;
    try {
      let baseModel;
      const config: ClientConfig = {
        model,
        configuration: getModelProviderUri(modelProvider) as any,
        streaming: false,
      };
      baseModel = new Client(config);
      if (streaming) {
        res.writeHead(200, {
          "Content-Type": "text/event-stream",
          Connection: "keep-alive",
          "Cache-Control": "no-cache",
        });
      }
      const templateInputMapper = (input: {
        isArtifact: boolean;
        instruction: string;
        pseudocode: string;
      }) => ({
        instruction: input.instruction,
      });
      const branch = RunnableBranch.from([
        [
          (input: {
            isArtifact: boolean;
            instruction: string;
            pseudocode: string;
          }) => input.isArtifact,
          RunnableSequence.from([
            templateInputMapper,
            artifactsPrompt.pipe(baseModel.getInstance()),
          ]),
        ],
        [
          (input: {
            isArtifact: boolean;
            instruction: string;
            pseudocode: string;
          }) => !input.isArtifact,
          RunnableSequence.from([
            templateInputMapper,
            generalPrompt.pipe(baseModel.getInstance()),
          ]),
        ],
        RunnableSequence.from([
          templateInputMapper,
          artifactsPrompt.pipe(baseModel.getInstance()),
        ]),
      ]);

      const chain = baseModel
        .setRunnable(
          new RunnableLambda({
            func: async (input: { input_data: string }) => {
              const chain = artifactsDecisionPrompt.pipe(
                baseModel.getInstance(),
              );
              const response = await chain.invoke(input);
              const content = response.content as string;
              let cleaned = content.replace(/^\s*```json\s*/i, "");
              cleaned = cleaned.replace(/\s*```\s*$/, "");
              return { json: cleaned, instruction: input.input_data };
            },
          }),
        )
        .setRunnable((input: { json: string; instruction: string }) => {
          const data: { isArtifact: boolean } = JSON.parse(input.json);
          return {
            isArtifact: data.isArtifact,
            instruction: input.instruction,
          };
        });
      if (streaming) {
        const data = (await chain.generateResponse({
          input_data: sentence,
        })) as {
          isArtifact: boolean;
          instruction: string;
        };
        const model = new Client({ ...config, streaming: true });
        const prompt = data.isArtifact ? artifactsPrompt : generalPrompt;
        const streamChain = prompt
          .pipe(model.getInstance())
          .pipe(new StringOutputParser());
        const stream = await streamChain.stream({
          instruction: sentence,
        });
        let content = {
          type: "delta_start",
          content: "",
        };
        res.write(JSON.stringify(content));
        for await (const chunk of stream) {
          content = {
            type: "delta",
            content: chunk,
          };
          res.write(JSON.stringify(content));
        }
        content = {
          type: "delta_stop",
          content: "",
        };
        res.write(content);
        return;
      }
      const data = await chain
        .setRunnable(branch)
        .setRunnable((input: any) => {
          if (!input?.content) {
            throw new Error("Could not get input");
          }
          return input.content;
        })
        .generateResponse({ input_data: sentence });
      res.send(data);
    } catch (error) {
      res.send(error);
    }
  },
);

export default router;
