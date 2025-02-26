#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError
} from '@modelcontextprotocol/sdk/types.js';
import * as math from 'mathjs';

console.error("Integrals Server starting up...");

interface IntegralParams {
  expression: string;
  variable: string;
  lowerBound: number;
  upperBound: number;
}

class IntegralsServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: 'integrals-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    
    this.server.onerror = (error: Error) => console.error('[MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'calculateIntegral',
          description: 'Calculate definite integrals',
          inputSchema: {
            type: 'object',
            properties: {
              expression: {
                type: 'string',
                description: 'The mathematical expression to integrate'
              },
              variable: {
                type: 'string',
                description: 'The variable of integration (e.g. "x")'
              },
              lowerBound: {
                type: 'number',
                description: 'Lower bound of integration'
              },
              upperBound: {
                type: 'number',
                description: 'Upper bound of integration'
              }
            },
            required: ['expression', 'variable', 'lowerBound', 'upperBound']
          }
        }
      ]
    }));

    this.server.setRequestHandler(
      CallToolRequestSchema,
      async (request) => {
        if (request.params.name !== 'calculateIntegral') {
          throw new McpError(
            ErrorCode.MethodNotFound,
            `Unknown tool: ${request.params.name}`
          );
        }

        const args = request.params.arguments;
        
        // Validate arguments
        if (!args) {
          throw new McpError(
            ErrorCode.InvalidParams,
            'Arguments are required'
          );
        }

        const { expression, variable, lowerBound, upperBound } = args as {
          expression?: unknown;
          variable?: unknown;
          lowerBound?: unknown;
          upperBound?: unknown;
        };

        if (!expression || typeof expression !== 'string') {
          throw new McpError(
            ErrorCode.InvalidParams,
            'Expression must be a string'
          );
        }

        if (!variable || typeof variable !== 'string') {
          throw new McpError(
            ErrorCode.InvalidParams,
            'Variable must be a string'
          );
        }

        if (typeof lowerBound !== 'number') {
          throw new McpError(
            ErrorCode.InvalidParams,
            'Lower bound must be a number'
          );
        }

        if (typeof upperBound !== 'number') {
          throw new McpError(
            ErrorCode.InvalidParams,
            'Upper bound must be a number'
          );
        }

        try {
          // Calculate the definite integral
          const result = await this.calculateIntegral({
            expression,
            variable,
            lowerBound,
            upperBound
          });

          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({
                  result: result,
                  details: `Integral of ${expression} with respect to ${variable} from ${lowerBound} to ${upperBound}`
                })
              }
            ]
          };
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
          return {
            content: [
              {
                type: 'text',
                text: `Failed to calculate integral: ${errorMessage}`
              }
            ],
            isError: true
          };
        }
      }
    );
  }

  private async calculateIntegral(params: IntegralParams): Promise<number> {
    try {
      // Parse and validate the expression
      math.parse(params.expression);
      
      // Calculate the definite integral using mathjs
      const result = math.evaluate(`integrate(${params.expression}, ${params.variable}, ${params.lowerBound}, ${params.upperBound})`);
      
      if (typeof result !== 'number' || !isFinite(result)) {
        throw new Error('Invalid result: integral must evaluate to a finite number');
      }

      return result;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Integration failed: ${errorMessage}`);
    }
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Integrals MCP server running on stdio');
  }
}

// Start the server
const server = new IntegralsServer();
server.run().catch(console.error);
