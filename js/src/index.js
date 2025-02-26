#!/usr/bin/env node
import { genkit, z } from 'genkit';
import { mcpServer } from 'genkitx-mcp';
import * as math from 'mathjs';
import {
  derivative,
  integral,
  riemannSum,
  darbouxSum,
  findLimit,
  laplaceTransform,
  fourierTransform,
  zTransform
} from './math/calculus.js';
import {
  blackScholes,
  optionGreeks,
  normalCDF,
  normalPDF
} from './math/financial.js';

const ai = genkit({});

// Define calculus tools
ai.defineTool(
  {
    name: 'derivative',
    description: 'Calculate the derivative of a mathematical expression',
    inputSchema: z.object({
      expression: z.string().describe('Mathematical expression (e.g., "x^2", "e^x", "sin(x)")'),
      variable: z.string().optional().describe('Variable to differentiate with respect to (default: x)')
    }),
    outputSchema: z.string(),
  },
  async ({ expression, variable = 'x' }) => {
    return derivative(expression, variable);
  }
);

ai.defineTool(
  {
    name: 'integral',
    description: 'Calculate the indefinite integral of a mathematical expression',
    inputSchema: z.object({
      expression: z.string().describe('Mathematical expression (e.g., "x^2", "e^x", "sin(x)")'),
      variable: z.string().optional().describe('Variable to integrate with respect to (default: x)')
    }),
    outputSchema: z.string(),
  },
  async ({ expression, variable = 'x' }) => {
    return integral(expression, variable);
  }
);

ai.defineTool(
  {
    name: 'riemann_sum',
    description: 'Calculate the Riemann sum of a function using different methods',
    inputSchema: z.object({
      expression: z.string().describe('Function to integrate'),
      variable: z.string().describe('Variable of integration'),
      a: z.number().describe('Lower limit of integration'),
      b: z.number().describe('Upper limit of integration'),
      n: z.number().describe('Number of subintervals'),
      method: z.enum(['left', 'right', 'midpoint', 'trapezoid']).default('midpoint')
        .describe('Method: left, right, midpoint, or trapezoid')
    }),
    outputSchema: z.number(),
  },
  async ({ expression, variable, a, b, n, method }) => {
    return riemannSum(expression, variable, a, b, n, method);
  }
);

ai.defineTool(
  {
    name: 'area',
    description: 'Calculate the area under a curve between two points',
    inputSchema: z.object({
      expression: z.string(),
      start: z.number(),
      end: z.number(),
      n: z.number().optional().describe('Number of subintervals (default: 1000)')
    }),
    outputSchema: z.number(),
  },
  async ({ expression, start, end, n = 1000 }) => {
    return riemannSum(expression, 'x', start, end, n, 'trapezoid');
  }
);

ai.defineTool(
  {
    name: 'darboux_sum',
    description: 'Calculate the Darboux sum of a function',
    inputSchema: z.object({
      expression: z.string().describe('Function to integrate'),
      variable: z.string().describe('Variable of integration'),
      a: z.number().describe('Lower limit of integration'),
      b: z.number().describe('Upper limit of integration'),
      n: z.number().describe('Number of subintervals'),
      type: z.enum(['upper', 'lower']).default('upper')
        .describe('Type: upper or lower Darboux sum')
    }),
    outputSchema: z.union([z.number(), z.string()]),
  },
  async ({ expression, variable, a, b, n, type }) => {
    return darbouxSum(expression, variable, a, b, n, type);
  }
);

ai.defineTool(
  {
    name: 'limit',
    description: 'Calculate the limit of a function as it approaches a value',
    inputSchema: z.object({
      expression: z.string().describe('Function to evaluate limit'),
      variable: z.string().describe('Variable approaching the limit'),
      approach: z.number().describe('Value the variable approaches')
    }),
    outputSchema: z.union([z.number(), z.string()]),
  },
  async ({ expression, variable, approach }) => {
    return findLimit(expression, variable, approach);
  }
);

// Engineering transform tools
ai.defineTool(
  {
    name: 'laplace_transform',
    description: 'Calculate the Laplace transform of a function',
    inputSchema: z.object({
      expression: z.string().describe('Function of time'),
      timeVar: z.string().describe('Time variable'),
      laplaceVar: z.string().describe('Laplace variable')
    }),
    outputSchema: z.string(),
  },
  async ({ expression, timeVar, laplaceVar }) => {
    return laplaceTransform(expression, timeVar, laplaceVar);
  }
);

ai.defineTool(
  {
    name: 'fourier_transform',
    description: 'Calculate the Fourier transform of a function',
    inputSchema: z.object({
      expression: z.string().describe('Function of time'),
      timeVar: z.string().describe('Time variable'),
      freqVar: z.string().describe('Frequency variable')
    }),
    outputSchema: z.string(),
  },
  async ({ expression, timeVar, freqVar }) => {
    return fourierTransform(expression, timeVar, freqVar);
  }
);

ai.defineTool(
  {
    name: 'z_transform',
    description: 'Calculate the Z-transform of a function',
    inputSchema: z.object({
      expression: z.string().describe('Function of discrete time'),
      timeVar: z.string().describe('Discrete time variable'),
      zVar: z.string().describe('Z-transform variable'),
      limit: z.number().optional().describe('Upper limit for summation (default: 100)')
    }),
    outputSchema: z.string(),
  },
  async ({ expression, timeVar, zVar, limit = 100 }) => {
    return zTransform(expression, timeVar, zVar, limit);
  }
);

// Financial tools
ai.defineTool(
  {
    name: 'black_scholes',
    description: 'Calculate Black-Scholes option price',
    inputSchema: z.object({
      S: z.number().describe('Current price of the asset'),
      K: z.number().describe('Strike price of the option'),
      T: z.number().describe('Time to expiration in years'),
      r: z.number().describe('Risk-free interest rate'),
      sigma: z.number().describe('Volatility of the asset'),
      optionType: z.enum(['call', 'put']).default('call')
        .describe('Option type: "call" or "put"')
    }),
    outputSchema: z.union([z.number(), z.string()]),
  },
  async ({ S, K, T, r, sigma, optionType }) => {
    return blackScholes(S, K, T, r, sigma, optionType);
  }
);

ai.defineTool(
  {
    name: 'option_greeks',
    description: 'Calculate the Greeks for a Black-Scholes option',
    inputSchema: z.object({
      S: z.number().describe('Current price of the asset'),
      K: z.number().describe('Strike price of the option'),
      T: z.number().describe('Time to expiration in years'),
      r: z.number().describe('Risk-free interest rate'),
      sigma: z.number().describe('Volatility of the asset'),
      optionType: z.enum(['call', 'put']).default('call')
        .describe('Option type: "call" or "put"')
    }),
    outputSchema: z.union([
      z.object({
        delta: z.number(),
        gamma: z.number(),
        vega: z.number(),
        theta: z.number(),
        rho: z.number()
      }),
      z.string()
    ]),
  },
  async ({ S, K, T, r, sigma, optionType }) => {
    return optionGreeks(S, K, T, r, sigma, optionType);
  }
);

const server = mcpServer(ai, { name: 'mcp_calc_tools', version: '0.1.0' });
server.start();

// Log when server starts
console.log('MCP Calc Tools server started. Waiting for connections...');
