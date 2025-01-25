const languageKeyWords = [
  "JavaScript",
  "Python",
  "Java",
  "C#",
  "C++",
  "Ruby",
  "Go",
  "Swift",
  "Kotlin",
  "PHP",
  "TypeScript",
  "R",
  "Dart",
  "Rust",
  "Perl",
  "Scala",
  "Objective-C",
  "Shell",
  "Lua",
  "MATLAB",
];

export const generateLanguageTemplate = (sentence: string) => {
  // Join the languages into a comma-separated list for the prompt
  const keywordsList = languageKeyWords.join(", ");

  const template = `You are a highly intelligent assistant. Your task is to identify which programming languages are mentioned in the given sentence.
                    Here is the list of programming languages you should search for: ${keywordsList}.
                    Sentence: "${sentence}".
                    Output the names of programming languages mentioned in the sentence in the following JSON format:
                    {
                      "data": [<language_names>]
                    }
                    If none are mentioned, return in the following JSON format:
                    {
                      "data": ["Java"]
                    }
                    Check again i only need data in json format.

`;

  return template;
};

export const generateCodeTemplate = (sentence: string, list: string[]) => {
  const template = `You are a highly intelligent coding assistant. Your task is to generate code snippet.
                    You will be generating code strictly using the following languges: ${list}.
                    Problem description: "${sentence}".
                    Output the response in the following format mentioned in the following JSON format : 
                    {
                      "workExplanation":<your explanation goes here>,
                      "code": <code snippet goes here>,
                      "complexityAnalysis":<complexity analysis goes here>
                    }
                    Example : 
                    {
                    "workExplanation": "This code snippet demonstrates how to define a simple Java method that adds two numbers.",
                    "code": "public class Calculator { \n    public int add(int a, int b) {\n        return a + b;\n    }\n}",
                    "complexityAnalysis": "The time complexity of this method is O(1), as the addition operation is performed in constant time regardless of the input values."
                    }
                    Make sure to give the code in a string so that it can pass JSON parser effectively.
                    Check again i only need data in json format.
                    Make sure the code generated is syntactically correct & generates no compilation or runtime error.
                    `;
  return template;
};
