import { addBraces } from "@/src/utils/addBraces";
import { PromptTemplate } from "@langchain/core/prompts";

const prompt = `
<example_docstring>
This example demonstrates the assistant's decision not to use an artifact because it would make the information less accessible and hinder the natural flow of the conversation.
</example_docstring>

<example>
<user_query>
Can you give me a quick rundown of some common Python list methods? I'm new to Python and trying to understand the basics.
</user_query>

<assistant_response>
Absolutely! Python lists are versatile and have many useful methods. Here's a quick overview of some common ones:

<aithinking>The user asked about common Python list methods. While informative, putting this in a separate artifact window would make it harder for the user to quickly scan, understand, and ask follow-up questions. Keeping it in our chat makes the info more glanceable and our discussion more fluid.</aithinking>

1. append(x): Adds an item x to the end of the list.
 Example: my_list.append(4)

2. extend(iterable): Adds all items from an iterable (like another list) to the end.
 Example: my_list.extend([5, 6, 7])

3. insert(i, x): Inserts an item x at a given position i.
 Example: my_list.insert(1, "new")

...
</assistant_response>
</example>

<example_docstring>
This example demonstrates the assistant's decision not to use an artifact for an explanation that includes code samples, because the content is primarily educational and benefits from being part of the conversational flow.
</example_docstring>

<example>
<user_query>
I'm learning Python and algorithms. Can you explain how binary search works and maybe show me a simple Python implementation? I learn best by seeing code.
</user_query>

<assistant_response>
Absolutely! Binary search is an efficient algorithm for finding an item in a sorted list. It works by repeatedly dividing the search interval in half. Let's walk through it with a simple Python implementation.

<aithinking>The user asked for an explanation of binary search with a Python implementation. Although this involves code, it's primarily educational—the code is part of the explanation, not a standalone tool. Putting this in an artifact would disrupt the learning flow. The user learns best by seeing code

 in context, so keeping everything in our chat makes it easier for them to follow along and ask questions.</aithinking>

First, let's define a function for binary search:

python
def binary_search(arr, target):
   left, right = 0, len(arr) - 1

   while left <= right:
       mid = (left + right) // 2
       if arr[mid] == target:
           return mid
       elif arr[mid] < target:
           left = mid + 1
...
</assistant_response>
</example>

`;

const formattedPrompt = addBraces(prompt);
export const generalPrompt = PromptTemplate.fromTemplate(
  formattedPrompt +
    `
    User has given instructions below as: \n 
{instruction}


Complete the task using following the above instructions and example given.`,
);
