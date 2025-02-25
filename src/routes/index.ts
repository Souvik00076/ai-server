import { Router } from "express";
import type { Request, Response } from "express";
import { artifactsDecisionPrompt } from "../lib/prompts/prompts.artifacts_decision";
import {
  RunnableBranch,
  RunnableLambda,
  RunnableSequence,
} from "@langchain/core/runnables";
import { artifactsPrompt } from "../lib/prompts/prompts.artifacts_generation";
import { Groq } from "../lib/core/core.groq";
import { generalPrompt } from "../lib/prompts/prompts.general";
import { StringOutputParser } from "@langchain/core/output_parsers";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  const { instructions: sentence } = req.body as any;
  try {
    const groqModel = new Groq(
      "mixtral-8x7b-32768",
      process.env.GROQ_API_KEY as string,
      1200,
      false,
      false,
    );

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
          artifactsPrompt.pipe(groqModel.getInstance()),
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
          generalPrompt.pipe(groqModel.getInstance()),
        ]),
      ],
      RunnableSequence.from([
        templateInputMapper,
        artifactsPrompt.pipe(groqModel.getInstance()),
      ]),
    ]);

    const data = await groqModel
      .setRunnable(
        new RunnableLambda({
          func: async (input: { input_data: string }) => {
            const chain = artifactsDecisionPrompt.pipe(groqModel.getInstance());
            const response = await chain.invoke(input);
            return { json: response.content, instruction: input.input_data };
          },
        }),
      )
      .setRunnable((input: { json: string; instruction: string }) => {
        const data: { isArtifact: boolean } = JSON.parse(input.json);
        console.log(data);
        return {
          isArtifact: data.isArtifact,
          instruction: input.instruction,
        };
      })
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
});
router.post("/stream", async (req: Request, res: Response) => {
  const { instructions: sentence } = req.body as any;
  try {
    const groqModel = new Groq(
      "mixtral-8x7b-32768",
      process.env.GROQ_API_KEY as string,
      1200,
      false,
      false,
    );
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      Connection: "keep-alive",
      "Cache-Control": "no-cache",
    });
    const data = await groqModel
      .setRunnable(
        new RunnableLambda({
          func: async (input: { input_data: string }) => {
            const chain = artifactsDecisionPrompt.pipe(groqModel.getInstance());
            const response = await chain.invoke(input);
            return { json: response.content, instruction: input.input_data };
          },
        }),
      )
      .setRunnable((input: { json: string; instruction: string }) => {
        const data: { isArtifact: boolean } = JSON.parse(input.json);
        return {
          isArtifact: data.isArtifact,
          instruction: input.instruction,
        };
      })
      .generateResponse({ input_data: sentence });

    const model = new Groq(
      "mixtral-8x7b-32768",
      process.env.GROQ_API_KEY as string,
      1200,
      true,
      false,
    );
    const prompt = data.isArtifact ? artifactsPrompt : generalPrompt;
    const chain = prompt
      .pipe(model.getInstance())
      .pipe(new StringOutputParser());
    const stream = await chain.stream({
      instruction: sentence,
    });
    let i = 0;
    for await (const chunk of stream) {
      res.write(chunk);
    }
    res.write(data);
  } catch (error) {
    res.send(error);
  }
});
export default router;
