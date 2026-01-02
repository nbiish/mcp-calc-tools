#!/usr/bin/env node
import { genkit, z } from 'genkit';
import { mcpServer } from 'genkitx-mcp';
import * as calculus from './src/calculus.js';
import * as finance from './src/finance.js';
import * as transform from './src/transforms.js';
import * as linalg from './src/linear-algebra.js';
import * as prob from './src/probability.js';
import * as optim from './src/optimization.js';
import * as utils from './src/utils.js';
import * as pipelines from './src/pipelines.js';

const ai = genkit({});

// --- Calculus Tools ---

ai.defineTool(
  {
    name: 'derivative',
    description: 'Calculate the symbolic derivative of a mathematical expression. Use for finding slopes, rates of change, and optimization points. Example: derivative("x^3 + 2x", "x") -> "3 * x ^ 2 + 2"',
    inputSchema: z.object({
      expression: z.string().describe('Mathematical expression (e.g., "x^2", "sin(x)", "log(x)")'),
      variable: z.string().optional().default('x').describe('Variable to differentiate with respect to')
    }),
    outputSchema: z.string(),
  },
  async ({ expression, variable }) => calculus.derivative(expression, variable)
);

ai.defineTool(
  {
    name: 'integral',
    description: 'Calculate the symbolic indefinite integral (antiderivative). Example: integral("2x") -> "x^2". Note: Only supports basic elementary functions.',
    inputSchema: z.object({
      expression: z.string().describe('Expression to integrate'),
      variable: z.string().optional().default('x').describe('Variable of integration')
    }),
    outputSchema: z.string(),
  },
  async ({ expression, variable }) => calculus.integral(expression, variable)
);

ai.defineTool(
  {
    name: 'riemann_sum',
    description: 'Numerical definite integration using Riemann sums. Example: riemann_sum("x^2", "x", 0, 1, 1000, "trapezoid")',
    inputSchema: z.object({
      expression: z.string().describe('Function to integrate'),
      variable: z.string().describe('Variable'),
      a: z.number().describe('Start point'),
      b: z.number().describe('End point'),
      n: z.number().min(1).max(100000).describe('Number of intervals (max 100,000)'),
      method: z.enum(['left', 'right', 'midpoint', 'trapezoid']).default('midpoint')
    }),
    outputSchema: z.number(),
  },
  async (args) => calculus.riemannSum(args.expression, args.variable, args.a, args.b, args.n, args.method)
);

ai.defineTool(
  {
    name: 'limit',
    description: 'Determine the limit of a function as a variable approaches a value.',
    inputSchema: z.object({
      expression: z.string().describe('Expression'),
      variable: z.string().describe('Variable'),
      approach: z.number().describe('Value to approach')
    }),
    outputSchema: z.union([z.number(), z.string()]),
  },
  async (args) => calculus.findLimit(args.expression, args.variable, args.approach)
);

ai.defineTool(
  {
    name: 'volume_of_revolution',
    description: 'Calculate the volume of a solid of revolution around the x-axis using the disk method.',
    inputSchema: z.object({
      expression: z.string().describe('Function f(x) to rotate'),
      start: z.number().describe('Starting x-value'),
      end: z.number().describe('Ending x-value'),
      steps: z.number().optional().default(1000).describe('Precision steps (default 1000, max 100,000)')
    }),
    outputSchema: z.number(),
  },
  async (args) => utils.volumeOfRevolution(args.expression, args.start, args.end, args.steps)
);

// --- Linear Algebra Tools ---

ai.defineTool(
  {
    name: 'matrix_multiply',
    description: 'Multiply two matrices. Input as arrays of arrays.',
    inputSchema: z.object({
      a: z.array(z.array(z.number())),
      b: z.array(z.array(z.number()))
    }),
    outputSchema: z.array(z.array(z.number())),
  },
  async ({ a, b }) => linalg.matrixMultiply(a, b)
);

ai.defineTool(
  {
    name: 'matrix_inverse',
    description: 'Find the inverse of a square matrix.',
    inputSchema: z.object({
      m: z.array(z.array(z.number()))
    }),
    outputSchema: z.array(z.array(z.number())),
  },
  async ({ m }) => linalg.matrixInverse(m)
);

ai.defineTool(
  {
    name: 'matrix_determinant',
    description: 'Calculate the determinant of a square matrix.',
    inputSchema: z.object({
      m: z.array(z.array(z.number()))
    }),
    outputSchema: z.number(),
  },
  async ({ m }) => linalg.matrixDeterminant(m)
);

ai.defineTool(
  {
    name: 'eigenvalues',
    description: 'Find the eigenvalues of a square matrix.',
    inputSchema: z.object({
      m: z.array(z.array(z.number()))
    }),
    outputSchema: z.array(z.number()),
  },
  async ({ m }) => linalg.eigenvalues(m)
);

// --- Finance Tools ---

ai.defineTool(
  {
    name: 'black_scholes',
    description: 'Price a European option using Black-Scholes formula. Inputs: S (price), K (strike), T (years), r (rate), sigma (vol).',
    inputSchema: z.object({
      S: z.number().positive(),
      K: z.number().positive(),
      T: z.number().positive(),
      r: z.number(),
      sigma: z.number().positive(),
      optionType: z.enum(['call', 'put']).default('call')
    }),
    outputSchema: z.number(),
  },
  async (args) => finance.blackScholes(args.S, args.K, args.T, args.r, args.sigma, args.optionType)
);

ai.defineTool(
  {
    name: 'option_greeks',
    description: 'Calculate Delta, Gamma, Vega, Theta, and Rho for an option.',
    inputSchema: z.object({
      S: z.number().positive(),
      K: z.number().positive(),
      T: z.number().positive(),
      r: z.number(),
      sigma: z.number().positive(),
      optionType: z.enum(['call', 'put']).default('call')
    }),
    outputSchema: z.object({
      delta: z.number(),
      gamma: z.number(),
      vega: z.number(),
      theta: z.number(),
      rho: z.number()
    }),
  },
  async (args) => finance.optionGreeks(args.S, args.K, args.T, args.r, args.sigma, args.optionType)
);

ai.defineTool(
  {
    name: 'sharpe_ratio',
    description: 'Calculate Sharpe ratio of a return series relative to a risk-free rate.',
    inputSchema: z.object({
      returns: z.array(z.number()).min(2).describe('Array of percentage returns'),
      riskFreeRate: z.number().optional().default(0).describe('Periodic risk-free rate')
    }),
    outputSchema: z.number(),
  },
  async ({ returns, riskFreeRate }) => finance.sharpeRatio(returns, riskFreeRate)
);

ai.defineTool(
  {
    name: 'value_at_risk',
    description: 'Estimate Value at Risk (VaR) using historical method at a given confidence level.',
    inputSchema: z.object({
      returns: z.array(z.number()).min(10).describe('Historical returns data'),
      confidence: z.number().min(0.5).max(0.999).default(0.95).describe('Confidence level (e.g. 0.95)')
    }),
    outputSchema: z.number(),
  },
  async ({ returns, confidence }) => finance.valueAtRisk(returns, confidence)
);

ai.defineTool(
  {
    name: 'cashflow_schedule',
    description: 'Generate a periodic interest/balance schedule for a principal amount.',
    inputSchema: z.object({
      principal: z.number().positive(),
      rate: z.number().nonnegative().describe('Rate per period (as decimal)'),
      periods: z.number().int().positive().describe('Number of periods'),
      compounds: z.number().optional().default(1).describe('Compounds per period')
    }),
    outputSchema: z.array(z.object({
      period: z.number(),
      interest: z.number(),
      balance: z.number()
    })),
  },
  async (args) => finance.cashflowSchedule(args.principal, args.rate, args.periods, args.compounds)
);

// --- Probability Tools ---

ai.defineTool(
  {
    name: 'normal_distribution',
    description: 'Evaluate Normal PDF at x given mean mu and std sigma.',
    inputSchema: z.object({
      x: z.number(),
      mu: z.number().optional().default(0),
      sigma: z.number().optional().default(1)
    }),
    outputSchema: z.number(),
  },
  async ({ x, mu, sigma }) => prob.normalDistribution(x, mu, sigma)
);

ai.defineTool(
  {
    name: 'binomial_distribution',
    description: 'Calculate binomial probability P(X=k) for n trials and success prob p.',
    inputSchema: z.object({
      k: z.number().int().nonnegative(),
      n: z.number().int().positive(),
      p: z.number().min(0).max(1)
    }),
    outputSchema: z.number(),
  },
  async ({ k, n, p }) => prob.binomialDistribution(k, n, p)
);

ai.defineTool(
  {
    name: 'poisson_distribution',
    description: 'Calculate Poisson probability P(X=k) for rate lambda.',
    inputSchema: z.object({
      k: z.number().int().nonnegative(),
      lambda: z.number().positive()
    }),
    outputSchema: z.number(),
  },
  async ({ k, lambda }) => prob.poissonDistribution(k, lambda)
);

// --- Engineering Transforms ---

ai.defineTool(
  {
    name: 'laplace_transform',
    description: 'Numerical approximation of the Laplace transform of a function f(t).',
    inputSchema: z.object({
      expression: z.string().describe('f(t)'),
      timeVar: z.string().default('t'),
      laplaceVar: z.number().describe('s (complex or real frequency)')
    }),
    outputSchema: z.string(),
  },
  async (args) => transform.laplaceTransform(args.expression, args.timeVar, args.laplaceVar)
);

ai.defineTool(
  {
    name: 'fourier_transform',
    description: 'Numerical approximation of the Fourier transform of a function f(t).',
    inputSchema: z.object({
      expression: z.string().describe('f(t)'),
      timeVar: z.string().default('t'),
      freqVar: z.number().describe('omega (frequency)')
    }),
    outputSchema: z.string(),
  },
  async (args) => transform.fourierTransform(args.expression, args.timeVar, args.freqVar)
);

// --- Optimization Tools ---

ai.defineTool(
  {
    name: 'find_root',
    description: 'Find root of f(x)=0 using Newton method. Provide expression, variable, and initial guess.',
    inputSchema: z.object({
      expression: z.string().describe('f(x)'),
      variable: z.string().default('x'),
      guess: z.number()
    }),
    outputSchema: z.number(),
  },
  async (args) => optim.findRoot(args.expression, args.variable, args.guess)
);

// --- Discovery Tool ---

ai.defineTool(
  {
    name: 'describe_available_tools',
    description: 'Find the right tool for your math or finance problem. Describe your goal in natural language.',
    inputSchema: z.object({
      task: z.string().describe('What you want to calculate (e.g. "solve x^2=4", "price a call option")')
    }),
    outputSchema: z.object({
      suggestedTools: z.array(z.string()),
      reasoning: z.string()
    }),
  },
  async ({ task }) => {
    const suggestions = [];
    const t = task.toLowerCase();
    if (t.includes('derivative') || t.includes('slope')) suggestions.push('derivative');
    if (t.includes('integral') || t.includes('area')) suggestions.push('integral', 'riemann_sum');
    if (t.includes('volume') || t.includes('revolution')) suggestions.push('volume_of_revolution');
    if (t.includes('matrix') || t.includes('inverse') || t.includes('multiply')) suggestions.push('matrix_multiply', 'matrix_inverse', 'matrix_determinant');
    if (t.includes('eigen')) suggestions.push('eigenvalues');
    if (t.includes('option') || t.includes('black') || t.includes('greek')) suggestions.push('black_scholes', 'option_greeks');
    if (t.includes('sharpe') || t.includes('risk')) suggestions.push('sharpe_ratio', 'value_at_risk');
    if (t.includes('cash') || t.includes('schedule') || t.includes('interest')) suggestions.push('cashflow_schedule', 'compound_interest');
    if (t.includes('prob') || t.includes('distrib') || t.includes('normal') || t.includes('poisson') || t.includes('binom')) suggestions.push('normal_distribution', 'binomial_distribution', 'poisson_distribution');
    if (t.includes('laplace') || t.includes('fourier')) suggestions.push('laplace_transform', 'fourier_transform');
    if (t.includes('root') || t.includes('solve')) suggestions.push('find_root');
    
    return {
      suggestedTools: suggestions.length > 0 ? suggestions : ['all'],
      reasoning: suggestions.length > 0 ? `Detected keywords for: ${suggestions.join(', ')}.` : "No specific keywords found. You can use any of the available specialized math tools."
    };
  }
);

// --- Pipeline Tools ---

ai.defineTool(
  {
    name: 'evaluate_pipeline',
    description: 'Execute a sequence of mathematical operations where the result of one can be used in the next using "$LAST".',
    inputSchema: z.object({
      operations: z.array(z.object({
        op: z.string().describe('Operation type (currently only "math" supported)'),
        args: z.any().describe('Arguments for the operation (e.g., {expression: "x + 1", scope: {x: 5}})')
      }))
    }),
    outputSchema: z.object({
      lastResult: z.any(),
      results: z.array(z.any())
    }),
  },
  async ({ operations }) => pipelines.evaluateChain(operations)
);

// Final Server Config
const server = mcpServer(ai, { 
  name: 'mcp-calc-tools-advanced', 
  version: '1.1.0',
  description: 'High-performance calculus, finance, linear algebra, and probability MCP server.'
});
server.start();

console.log('MCP Calc Tools Advanced server is live.');
