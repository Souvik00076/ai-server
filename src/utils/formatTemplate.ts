export function formatPromptTemplate(str: string) {
  return (
    str
      // Escape curly braces
      .replace(/{/g, "\\{")
      .replace(/}/g, "\\}")
      // Escape backticks in code blocks if needed
      .replace(/```/g, "\\`\\`\\`")
      // Add quotes to JSON keys if missing
      .replace(/(\w+):/g, '"$1":')
  );
}
