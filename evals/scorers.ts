import type { Scorer } from 'autoevals'                         // a type from autoevals library use for evaluatiing the correctness of the tool call made by the agent 

export const ToolCallMatch: Scorer<any, {}> = async ({          // a scorer function that checks if the tool call made by the agent is correct
  input,
  output,
  expected,
}: {
  input?: any;
  output: { role: string; tool_calls: { function?: { name: string } }[] };
  expected?: { tool_calls: { function?: { name: string } }[] };
}) => {
  const score =                                                 // if the role of the agent is assistant and the tool call made by the agent is the same as the expected tool call then return 1 else return 0
    output.role === 'assistant' &&
    Array.isArray(output.tool_calls) &&
    output.tool_calls.length === 1 &&
    output.tool_calls[0].function?.name ===
      expected?.tool_calls?.[0]?.function?.name
      ? 1
      : 0

  return {                                                   // return the score                        
    name: 'ToolCallMatch',
    score,
  }
}
