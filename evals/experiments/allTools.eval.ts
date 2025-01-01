import { runEval } from '../evalTools'                                              // a utility function for running evaluations.
import { runLLM } from '../../src/llm'                                                // the function we want to evaluate.
import { ToolCallMatch } from '../scorers'                                            // the scorer for evaluating the results of the evaluation.                      
import { redditToolDefinition } from '../../src/tools/reddit'                         // the tool we want to evaluate.
import { generateImageToolDefinition } from '../../src/tools/generateImage'             // the tool we want to evaluate. 
import { dadJokeToolDefinition } from '../../src/tools/dadJoke'                           // the tool we want to evaluate.
import { movieSearchToolDefinition } from '../../src/tools/movieSearch'                   // the tool we want to evaluate.

const createToolCallMessage = (toolName: string) => ({                                  // a utility function for creating a tool call message.
  role: 'assistant',
  tool_calls: [
    {
      type: 'function',
      function: { name: toolName },
    },
  ],
})

const allTools = [                                                                 // an array of all the tools we want to evaluate.                        
  redditToolDefinition,
  generateImageToolDefinition,
  dadJokeToolDefinition,
  movieSearchToolDefinition,
]

runEval('allTools', {
  task: async (input) => {                                                    // run the evaluation                       
    const response = await runLLM({
      messages: [{ role: 'user', content: input }],
      tools: allTools,
    });
    return {
      role: response.role,
      tool_calls: response.tool_calls || [],
    };
  },
  data: [
    {
      input: 'tell me something interesting from reddit',                                     // the data for the evaluation.
      expected: createToolCallMessage(redditToolDefinition.name),
    },
    {
      input: 'generate an image of a mountain landscape',                                                 
      expected: createToolCallMessage(generateImageToolDefinition.name),
    },
    {
      input: 'tell me a dad joke',
      expected: createToolCallMessage(dadJokeToolDefinition.name),
    },
    {
      input: 'what movies did Christopher Nolan direct?',
      expected: createToolCallMessage(movieSearchToolDefinition.name),
    },
  ],
  scorers: [ToolCallMatch],                                                               // the scorer for the evaluation.
})
