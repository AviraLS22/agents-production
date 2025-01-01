import { runEval } from '../evalTools'                                          // a utility function for running evaluations.
import { runLLM } from '../../src/llm'                                           // the function we want to evaluate.                         
import { ToolCallMatch } from '../scorers'                                              // the function we want to evaluate.
import { redditToolDefinition } from '../../src/tools/reddit'                           // the tool we want to evaluate.

const createToolCallMessage = (toolName: string) => ({
  role: 'assistant',                                              // a utility function for creating a tool call message.
  tool_calls: [
    {
      type: 'function',
      function: { name: toolName },
    },
  ],
})

runEval('reddit', {
  task: (input) =>                                             // run the evaluation                          
    runLLM({
      messages: [{ role: 'user', content: input }],
      tools: [redditToolDefinition],
    }).then((result) => ({
      role: result.role,
      tool_calls: result.tool_calls || [],
    })),
  data: [
    {
      input: 'tell me something cool from reddit',                   // the data for the evaluation.                      
      expected: createToolCallMessage(redditToolDefinition.name),
    },
  ],
  scorers: [ToolCallMatch],                                                       // the scorer for the evaluation.
})
