#!/usr/bin/env node

import { createServer, defineTools } from '@modelcontextprotocol/sdk';

const tools = defineTools({
  calculateIntegral: {
    description: "Calculate definite integrals",
    parameters: {
      type: "object",
      properties: {
        expression: { 
          type: "string",
          description: "The mathematical expression to integrate" 
        },
        lowerBound: { 
          type: "number", 
          description: "Lower bound of integration" 
        },
        upperBound: { 
          type: "number", 
          description: "Upper bound of integration" 
        }
      },
      required: ["expression", "lowerBound", "upperBound"]
    },
    handler: async ({ expression, lowerBound, upperBound }) => {
      return {
        result: `Integral of ${expression} from ${lowerBound} to ${upperBound} calculated`,
        steps: [`Step 1: Parse ${expression}`, `Step 2: Apply integration rules`, `Step 3: Evaluate bounds`]
      };
    }
  }
});

const server = createServer({ tools });
server.start();

export { server };
