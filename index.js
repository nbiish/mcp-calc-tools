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
const identifierSchema = z.string().regex(/^[A-Za-z_][A-Za-z0-9_]*$/, 'Must be a safe identifier');

// --- Calculus Tools ---

ai.defineTool(
  {
    name: 'derivative',
    description: 'Calculate the symbolic derivative of a mathematical expression. Returns the derivative as a string. Use for finding slopes, rates of change, and optimization points. Examples: derivative("x^3 + 2x", "x") -> "3 * x ^ 2 + 2", derivative("sin(x)") -> "cos(x)", derivative("e^x") -> "e^x", derivative("log(x, 2)") -> "1 / (x * log(2))"',
    inputSchema: z.object({
      expression: z.string().describe('Mathematical expression (e.g., "x^2", "sin(x)", "log(x)")'),
      variable: identifierSchema.optional().default('x').describe('Variable to differentiate with respect to')
    }),
    outputSchema: z.string(),
  },
  async ({ expression, variable }) => calculus.derivative(expression, variable)
);

ai.defineTool(
  {
    name: 'integral',
    description: 'Calculate the symbolic indefinite integral (antiderivative). Supports polynomials, exponentials (e^(a*x)), trig (sin, cos, tan), logarithms, u-substitution patterns (e^(x^n)*x, sin(x^n)*x), integration by parts (x*sin(x), x*e^x, ln(x), x*ln(x)), and inverse trig forms. Returns "Cannot compute integral symbolically" for unsupported forms — use riemann_sum for numerical integration instead. Examples: integral("3*x^2") -> "1 * x^3", integral("sin(x)") -> "-1 * cos(1 * x)", integral("e^(2*x)") -> "0.5 * e^(2 * x)", integral("x * sin(x)") -> "sin(x) - x * cos(x)", integral("ln(x)") -> "x * ln(x) - x"',
    inputSchema: z.object({
      expression: z.string().describe('Expression to integrate'),
      variable: identifierSchema.optional().default('x').describe('Variable of integration')
    }),
    outputSchema: z.string(),
  },
  async ({ expression, variable }) => calculus.integral(expression, variable)
);

ai.defineTool(
  {
    name: 'riemann_sum',
    description: 'Numerical definite integration using Riemann sums. Methods: left, right, midpoint (default), trapezoid. Returns a number. Use when symbolic integral cannot solve the expression. Examples: riemann_sum("x^2", "x", 0, 1, 1000, "trapezoid") ≈ 0.333, riemann_sum("sin(x)", "x", 0, 3.14159, 10000, "midpoint") ≈ 2.0',
    inputSchema: z.object({
      expression: z.string().describe('Function to integrate'),
      variable: identifierSchema.describe('Variable'),
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
    description: 'Determine the limit of a function as a variable approaches a value. Uses numerical evaluation from both sides. Returns a number if the limit exists, or a string "Limit does not exist or function is discontinuous". Examples: limit("x^2", "x", 3) -> 9, limit("sin(x)/x", "x", 0) -> 1, limit("1/x", "x", 0) -> "Limit does not exist..."',
    inputSchema: z.object({
      expression: z.string().describe('Expression'),
      variable: identifierSchema.describe('Variable'),
      approach: z.number().describe('Value to approach')
    }),
    outputSchema: z.union([z.number(), z.string()]),
  },
  async (args) => calculus.findLimit(args.expression, args.variable, args.approach)
);

ai.defineTool(
  {
    name: 'volume_of_revolution',
    description: 'Calculate the volume of a solid of revolution around the x-axis using the disk method. V = π∫f(x)²dx. Examples: volume_of_revolution("1", 0, 1) -> π ≈ 3.14159, volume_of_revolution("x", 0, 1) -> π/3 ≈ 1.047',
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
    description: 'Multiply two matrices. Input as nested arrays [[row1],[row2],...]. Column count of A must match row count of B. Max 100x100. Example: matrix_multiply([[1,2],[3,4]], [[5,6],[7,8]]) -> [[19,22],[43,50]]',
    inputSchema: z.object({
      a: z.array(z.array(z.number().finite()).max(100)).max(100),
      b: z.array(z.array(z.number().finite()).max(100)).max(100)
    }),
    outputSchema: z.array(z.array(z.number().finite())),
  },
  async ({ a, b }) => linalg.matrixMultiply(a, b)
);

ai.defineTool(
  {
    name: 'matrix_inverse',
    description: 'Find the inverse of a square matrix. Matrix must be non-singular. Example: matrix_inverse([[1,2],[3,4]]) -> [[-2,1],[1.5,-0.5]]',
    inputSchema: z.object({
      m: z.array(z.array(z.number().finite()).max(100)).max(100)
    }),
    outputSchema: z.array(z.array(z.number().finite())),
  },
  async ({ m }) => linalg.matrixInverse(m)
);

ai.defineTool(
  {
    name: 'matrix_determinant',
    description: 'Calculate the determinant of a square matrix. Returns a scalar. Example: matrix_determinant([[1,2],[3,4]]) -> -2',
    inputSchema: z.object({
      m: z.array(z.array(z.number().finite()).max(100)).max(100)
    }),
    outputSchema: z.number(),
  },
  async ({ m }) => linalg.matrixDeterminant(m)
);

ai.defineTool(
  {
    name: 'eigenvalues',
    description: 'Find the eigenvalues of a square matrix. Returns an array of numbers. Example: eigenvalues([[4,1],[2,3]]) -> [5, 2]',
    inputSchema: z.object({
      m: z.array(z.array(z.number().finite()).max(100)).max(100)
    }),
    outputSchema: z.array(z.number().finite()),
  },
  async ({ m }) => linalg.eigenvalues(m)
);

// --- Finance Tools ---

ai.defineTool(
  {
    name: 'black_scholes',
    description: 'Price a European option using Black-Scholes formula. Returns the option premium as a number. Inputs: S (underlying price), K (strike price), T (time to expiry in years), r (risk-free rate as decimal), sigma (volatility as decimal), optionType ("call" or "put"). Example: black_scholes(100, 105, 0.5, 0.03, 0.2, "call") ≈ 3.99',
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
    description: 'Calculate all five Option Greeks (Delta, Gamma, Vega, Theta, Rho) for a European option. Example: option_greeks(100, 100, 1, 0.05, 0.2, "call") -> {delta: ~0.63, gamma: ~0.020, vega: ~37.5, theta: ~-5.5, rho: ~51.2}',
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
    description: 'Calculate Sharpe ratio of a return series relative to a risk-free rate. Sharpe = (mean - Rf) / std. Higher is better. Example: sharpe_ratio([0.1, 0.2, -0.05, 0.05], 0.01) ≈ 0.53',
    inputSchema: z.object({
      returns: z.array(z.number().finite()).min(2).max(10000).describe('Array of percentage returns'),
      riskFreeRate: z.number().optional().default(0).describe('Periodic risk-free rate')
    }),
    outputSchema: z.number(),
  },
  async ({ returns, riskFreeRate }) => finance.sharpeRatio(returns, riskFreeRate)
);

ai.defineTool(
  {
    name: 'value_at_risk',
    description: 'Estimate Value at Risk (VaR) using historical method (percentile-based). Returns the loss threshold at the given confidence level. Example: value_at_risk(returns, 0.95) -> the 5th-percentile loss',
    inputSchema: z.object({
      returns: z.array(z.number().finite()).min(10).max(10000).describe('Historical returns data'),
      confidence: z.number().min(0.5).max(0.999).default(0.95).describe('Confidence level (e.g. 0.95)')
    }),
    outputSchema: z.number(),
  },
  async ({ returns, confidence }) => finance.valueAtRisk(returns, confidence)
);

ai.defineTool(
  {
    name: 'cashflow_schedule',
    description: 'Generate a periodic compound interest schedule showing interest accrued and running balance per period. Example: cashflow_schedule(1000, 0.1, 3) -> [{period:1, interest:100, balance:1100}, {period:2, interest:110, balance:1210}, {period:3, interest:121, balance:1331}]',
    inputSchema: z.object({
      principal: z.number().positive(),
      rate: z.number().nonnegative().describe('Rate per period (as decimal)'),
      periods: z.number().int().positive().max(10000).describe('Number of periods'),
      compounds: z.number().int().positive().optional().default(1).describe('Compounds per period')
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
    description: 'Evaluate the Normal probability density function (PDF) at a point. Returns the density value. Examples: normal_distribution(0) -> 0.3989 (peak of standard normal), normal_distribution(1, 0, 1) -> 0.2420',
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
    description: 'Calculate binomial probability P(X=k) for exactly k successes in n trials with success probability p. Example: binomial_distribution(5, 10, 0.5) -> 0.2461 (probability of exactly 5 heads in 10 flips)',
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
    description: 'Calculate Poisson probability P(X=k) for a given rate lambda. Example: poisson_distribution(3, 2) -> 0.1804 (probability of exactly 3 events when average rate is 2)',
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
    description: 'Numerical approximation of the Laplace transform F(s) = ∫₀^∞ f(t)·e^(-st) dt. Provide expression in t, and a real s value. Returns a complex number string. Example: laplace_transform("e^(-t)", "t", 1) ≈ "0.5" (exact: 1/(s+1))',
    inputSchema: z.object({
      expression: z.string().describe('f(t)'),
      timeVar: identifierSchema.default('t'),
      laplaceVar: z.number().describe('s (complex or real frequency)')
    }),
    outputSchema: z.string(),
  },
  async (args) => transform.laplaceTransform(args.expression, args.timeVar, args.laplaceVar)
);

ai.defineTool(
  {
    name: 'fourier_transform',
    description: 'Numerical approximation of the Fourier transform F(ω) = ∫ f(t)·e^(-iωt) dt. Provide expression in t and frequency ω. Returns a complex number string. Example: fourier_transform("e^(-t^2)", "t", 0) ≈ "1.772" (exact: √π)',
    inputSchema: z.object({
      expression: z.string().describe('f(t)'),
      timeVar: identifierSchema.default('t'),
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
    description: 'Find root of f(x)=0 using Newton-Raphson method. Provide the expression, variable, and initial guess. Converges quickly for well-behaved functions. Examples: find_root("x^2 - 4", "x", 3) -> 2, find_root("cos(x) - 0.5", "x", 1) -> 1.0472 (=π/3)',
    inputSchema: z.object({
      expression: z.string().describe('f(x)'),
      variable: identifierSchema.default('x'),
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
    description: 'Find the right tool for your math or finance problem. Describe your goal in natural language and get tool suggestions. Examples: describe_available_tools("price a call option") -> [black_scholes, option_greeks], describe_available_tools("find the area under a curve") -> [integral, riemann_sum]',
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
    description: 'Execute a sequence of mathematical operations where $LAST in an expression is replaced by the previous result. Currently supports op "math" which uses mathjs evaluate. Example: [{op:"math", args:{expression:"2 + 3"}}, {op:"math", args:{expression:"$LAST * 4"}}] -> {lastResult: 20, results: [5, 20]}',
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
