import { runEval } from '../evalTools'       // a utility function for running evaluations.            
import { runLLM } from '../../src/llm'      // the function we want to evaluate.
import { ToolCallMatch } from '../scorers'        // a scorer for evaluating the results of the evaluation.
import { dadJokeToolDefinition } from '../../src/tools/dadJoke'       // the tool we want to evaluate.

const createToolCallMessage = (toolName: string) => ({                      // a utility function for creating a tool call message.   
  role: 'assistant',
  tool_calls: [
    {
      type: 'function',
      function: { name: toolName },
    },
  ],
})

runEval('dadJoke', {                                                    // run the evaluation                   
  task: (input) =>
    runLLM({
      messages: [{ role: 'user', content: input }],
      tools: [dadJokeToolDefinition],
    }).then(response => ({                                            // return the response from the LLM                   
      role: response.role,
      tool_calls: response.tool_calls || [],
    })),
  data: [                                                            // the data for the evaluation.          
    {
      input: 'tell me a dad joke',
      expected: createToolCallMessage(dadJokeToolDefinition.name),
    },
  ],
  scorers: [ToolCallMatch],                                                 // the scorer for the evaluation.         
})
