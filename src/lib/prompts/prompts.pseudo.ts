import { addBraces } from "@/src/utils/addBraces";
import { PromptTemplate } from "@langchain/core/prompts";

const prompt = `
generate clear and structured pseudocode that outlines an efficient approach to solving the problem.
Ensure the pseudocode is well-commented, easy to understand, and follows best practices in algorithm design. 
Focus on clarity, modularity, and efficiency.

A perfect pseudocode is step by step instructions to solve a problem in a structured way.

Below is an example : \n

<example_usage>
HumanMessage : Write a program to find the largest number in an array.
AIMessage : 
   \`\`\`pseudocode
BEGIN
    DEFINE foundTION findLargestNumber(array)
        SET maxNumber TO array[0]  // Assume first element is the largest initially
        FOR each number IN array
            IF number > maxNumber THEN
                SET maxNumber TO number  // Update max if a larger number is found
            ENDIF
        ENDFOR
        RETURN maxNumber  // Return the largest number
    END FUNCTION

    // Example usage
    SET numbers TO [10, 25, 47, 3, 19]
    PRINT findLargestNumber(numbers)
END
\`\`\`
</example_usage>

<example_usage>
HumanMessage : Create a React component that displays a list of items and allows users to add a new item to the list.
AIMessage : 
\`\`\`pseudocode
    BEGIN
    DEFINE FunctionN ItemListComponent
        IMPORT React and useState from 'react'

        // Initialize state for items list
        SET items TO an empty array
        SET newItem TO an empty string

        // Function to handle input change
        DEFINE FUNCTION handleInputChange(event)
            UPDATE newItem WITH event.target.value
        END FUNCTION

        // Function to add new item to the list
        DEFINE FUNCTION addItem()
            IF newItem is NOT empty THEN
                UPDATE items TO include newItem
                RESET newItem TO an empty string
            ENDIF
        END FUNCTION

        // Render UI
        RETURN JSX:
            DISPLAY input field with value bound to newItem
            DISPLAY button labeled "Add Item" with onClick calling addItem
            DISPLAY unordered list (ul)
                FOR each item IN items
                    DISPLAY list item (li) WITH item text
                ENDFOR
    END FUNCTION

    EXPORT ItemListComponent
END
\`\`\`
</example_usage>

Rules to strictly follow:
1)Dont write actual code. Give only pseudocode i.e steps of how to solve the problem.
2)Strictly follow the json format.
3)Dont write actual code only give pseudocode.
4)Psuedocode should be clear and structured and language agnostic.
5)Put the pseudocode in \`\`\`pseudocode response \`\`\`



User Input Can be found below as: \n
{input_data}
`;
const formattedPrompt = addBraces(prompt);
export const pseudocodePrompt = PromptTemplate.fromTemplate(
  formattedPrompt + `{input_data}`,
);
