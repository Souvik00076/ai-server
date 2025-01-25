import { Type, Static } from "@sinclair/typebox";

export type TOutput = Static<typeof TOutput>;
export const TOutput = Type.Object({
  workExplanation: Type.String({
    description:
      "A string that provides an explanation of the work being performed.",
    default: "N/A",
  }),
  code: Type.String({
    description:
      "A string representation of the code related to the work explanation.",
    default: "",
  }),
  complexityAnalysis: Type.String({
    description:
      "A string that describes the complexity of the code or the work.",
    default: "Medium",
  }),
});
