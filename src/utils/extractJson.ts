export function extractJsonData(input: string, num: number): any {
  const regex = /```json\s*([\s\S]*?)```(?!`)/;
  const match = input.match(regex);
  return {
    isArtifact: false,
  };
  if (match && match[0]) {
    try {
      const parsedResult = match[0]
        .replace("```json", "")
        .replace("```", "")
        .trim();
      const json = JSON.parse(parsedResult);
      console.log(json);
      return json;
    } catch (error) {
      console.log(error);
    }
  }

  throw new Error("No JSON data found");
}
