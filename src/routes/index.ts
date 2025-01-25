import { Router } from "express";
import { JsonOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import {
  generateCodeTemplate,
  generateLanguageTemplate,
} from "../lib/core/templates/keywords";
import { GroqLLMSingleton } from "../lib/core/llm";
import { TOutput } from "../@types";

const router = Router();
router.get("/", async (req, res) => {
  const keywordsParser = new JsonOutputParser<{ data: string[] }>();
  const sentence = "Write a python program to demonstrate dynamic programming.";
  const prompt = PromptTemplate.fromTemplate(` 
      {instruction}
      `);
  let chain = prompt
    .pipe(GroqLLMSingleton.getInstance() as any)
    .pipe(keywordsParser as any);
  let response = await chain.invoke({
    instruction: generateLanguageTemplate(sentence),
  });
  chain = prompt
    .pipe(GroqLLMSingleton.getInstance() as any)
    .pipe(new JsonOutputParser<TOutput>() as any);
  response = await chain.invoke({
    instruction: generateCodeTemplate(
      sentence,
      (response as { data: string[] }).data,
    ),
  });
  console.log(response);
  res.send(response);
});

export default router;
