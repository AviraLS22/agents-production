import { runEval } from '../evalTools'                                               // a utility function for running evaluations.
import { runLLM } from '../../src/llm'                                              // the function we want to evaluate.
import { ToolCallMatch } from '../scorers'                                         // a scorer for evaluating the results of the evaluation.
import { generateImageToolDefinition } from '../../src/tools/generateImage'    // the tool we want to evaluate.

const createToolCallMessage = (toolName: string) => ({                        // a utility function for creating a tool call message.
  role: 'assistant',
  tool_calls: [
    {
      type: 'function',
      function: { name: toolName },
    },
  ],
})

runEval('generateImage', {                                                // run the evaluation                           
  task: (input) =>
    runLLM({
      messages: [{ role: 'user', content: input }],
      tools: [generateImageToolDefinition],
    }).then((response) => ({
      role: response.role,
      tool_calls: response.tool_calls || [],
    })),
  data: [
    {
      input: 'can you generate an image of a sunset',                                                     // the data for the evaluation.
      expected: createToolCallMessage(generateImageToolDefinition.name),
    },
  ],
  scorers: [ToolCallMatch],                                                                              // the scorer for the evaluation.
})
