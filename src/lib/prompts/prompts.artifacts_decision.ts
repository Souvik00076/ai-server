import { addBraces } from "@/src/utils/addBraces";
import { PromptTemplate } from "@langchain/core/prompts";

const prompt = `
The assistant can create and reference artifacts during conversations. Artifacts are for substantial, self-contained content that users might modify or reuse, displayed in a separate UI window for clarity.

# Good artifacts are...
- Substantial content (>15 lines)
- Content that the user is likely to modify, iterate on, or take ownership of
- Self-contained, complex content that can be understood on its own, without context from the conversation
- Content intended for eventual use outside the conversation (e.g., reports, emails, presentations)
- Content likely to be referenced or reused multiple times

# Don't use artifacts for...
- Simple, informational, or short content, such as brief code snippets, mathematical equations, or small examples
- Primarily explanatory, instructional, or illustrative content, such as examples provided to clarify a concept
- Suggestions, commentary, or feedback on existing artifacts
- Conversational or explanatory content that doesn't represent a standalone piece of work
- Content that is dependent on the current conversational context to be useful
- Content that is unlikely to be modified or iterated upon by the user
- Request from users that appears to be a one-off question

#Always use artifacts for ...
- React code snippets
- HTML,CSS,Javascript code snippets


Output the decision in the following json format:
{
    isArtifact:true 
  }
OR {
    isArtifact:false 
  }

Rules to Strictly follow: 

1)Do follow the json format strictly. 
2)Dont add extra properties on your own.
3)Always give the json response in \`\`\`json  \`\`\`
4)Your task is only to determine whether artifact is needed or not.
5)The JSON reponse should contain only one property isArtifact with value true or false.
6)Before sending response check again for the above rules.
7)Do follow the rules for artifacts strictly.
8)Make sure the json response is valid.
Input can be found below  as : 

`;

const formattedPrompt = addBraces(prompt);
export const artifactsDecisionPrompt = PromptTemplate.fromTemplate(
  formattedPrompt + `{input_data}`,
);
