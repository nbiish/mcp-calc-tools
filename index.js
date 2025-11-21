#!/usr/bin/env node
import { genkit, z } from "genkit";
import { mcpServer } from "genkitx-mcp";
import * as math from "mathjs";

const ai = genkit({});

const MAX_STEPS = 100000;
const clampSteps = (n) => {
	if (!Number.isFinite(n)) return 1;
	const int = Math.floor(Math.abs(n));
	if (int < 1) return 1;
	if (int > MAX_STEPS) return MAX_STEPS;
	return int;
};

// Helper functions for mathematical operations
const derivative = (expr, variable = "x") => {
	try {
		const node = math.parse(expr);
		const derivativeExpr = math.derivative(node, variable);
		return derivativeExpr.toString();
	} catch (e) {
		return `Error: ${e.message}`;
	}
};

const integral = (expr, variable = "x") => {
	try {
		// For basic polynomials
		const powerMatch = expr.match(new RegExp(`${variable}\\^(\\d+)`));
		if (powerMatch) {
			const n = Number.parseInt(powerMatch[1]);
			return `${variable}^${n + 1}/${n + 1}`;
		}

		// For basic functions
		const rules = {
			"e^x": "e^x",
			"1/x": `ln|${variable}|`,
			[`sin(${variable})`]: `-cos(${variable})`,
			[`cos(${variable})`]: `sin(${variable})`,
			x: "x^2/2",
		};

		return rules[expr] || "Cannot compute integral";
	} catch (e) {
		return `Error: ${e.message}`;
	}
};

const riemannSum = (expr, variable, a, b, n, method = "midpoint") => {
	try {
		const steps = clampSteps(n);
		const deltaX = (b - a) / steps;
		let sum = 0;
		const node = math.parse(expr);
		const scope = {};

		if (method === "left" || method === "right") {
			const offset = method === "right" ? 1 : 0;
			for (let i = 0; i < steps; i++) {
				const x = a + (i + offset) * deltaX;
				scope[variable] = x;
				sum += math.evaluate(node, scope) * deltaX;
			}
		} else if (method === "midpoint") {
			for (let i = 0; i < steps; i++) {
				const x = a + (i + 0.5) * deltaX;
				scope[variable] = x;
				sum += math.evaluate(node, scope) * deltaX;
			}
		} else if (method === "trapezoid") {
			for (let i = 0; i <= steps; i++) {
				const x = a + i * deltaX;
				scope[variable] = x;
				const coef = i === 0 || i === steps ? 0.5 : 1;
				sum += coef * math.evaluate(node, scope) * deltaX;
			}
		}

		return sum;
	} catch (e) {
		return `Error: ${e.message}`;
	}
};

// Define mathematical tools
ai.defineTool(
	{
		name: "derivative",
		description: "Calculate the derivative of a mathematical expression",
		inputSchema: z.object({
			expression: z
				.string()
				.describe('Mathematical expression (e.g., "x^2", "e^x", "sin(x)")'),
			variable: z
				.string()
				.optional()
				.describe("Variable to differentiate with respect to (default: x)"),
		}),
		outputSchema: z.string(),
	},
	async ({ expression, variable = "x" }) => {
		return derivative(expression, variable);
	},
);

ai.defineTool(
	{
		name: "integral",
		description:
			"Calculate the indefinite integral of a mathematical expression",
		inputSchema: z.object({
			expression: z
				.string()
				.describe('Mathematical expression (e.g., "x^2", "e^x", "sin(x)")'),
			variable: z
				.string()
				.optional()
				.describe("Variable to integrate with respect to (default: x)"),
		}),
		outputSchema: z.string(),
	},
	async ({ expression, variable = "x" }) => {
		return integral(expression, variable);
	},
);

ai.defineTool(
	{
		name: "riemann_sum",
		description:
			"Calculate the Riemann sum of a function using different methods",
		inputSchema: z.object({
			expression: z.string().describe("Function to integrate"),
			variable: z.string().describe("Variable of integration"),
			a: z.number().describe("Lower limit of integration"),
			b: z.number().describe("Upper limit of integration"),
			n: z.number().describe("Number of subintervals"),
			method: z
				.enum(["left", "right", "midpoint", "trapezoid"])
				.default("midpoint")
				.describe("Method: left, right, midpoint, or trapezoid"),
		}),
		outputSchema: z.number(),
	},
	async ({ expression, variable, a, b, n, method }) => {
		return riemannSum(expression, variable, a, b, n, method);
	},
);

ai.defineTool(
	{
		name: "area",
		description: "Calculate the area under a curve between two points",
		inputSchema: z.object({
			expression: z.string(),
			start: z.number(),
			end: z.number(),
			n: z
				.number()
				.optional()
				.describe("Number of subintervals (default: 1000)"),
		}),
		outputSchema: z.number(),
	},
	async ({ expression, start, end, n = 1000 }) => {
		return riemannSum(expression, "x", start, end, n, "trapezoid");
	},
);

ai.defineTool(
	{
		name: "volume",
		description: "Calculate the volume of revolution around x-axis",
		inputSchema: z.object({
			expression: z.string(),
			start: z.number(),
			end: z.number(),
		}),
		outputSchema: z.number(),
	},
	async ({ expression, start, end }) => {
		// Volume of revolution using disk method
		const steps = 1000;
		const dx = (end - start) / steps;
		let volume = 0;
		const node = math.parse(expression);
		const scope = {};

		for (let i = 0; i < steps; i++) {
			const x = start + i * dx;
			scope.x = x;
			const y = math.evaluate(node, scope);
			volume += Math.PI * y * y * dx;
		}

		return volume;
	},
);

ai.defineTool(
	{
		name: "logarithm",
		description: "Calculate logarithm with any base",
		inputSchema: z.object({
			value: z.number(),
			base: z.number().optional(),
		}),
		outputSchema: z.number(),
	},
	async ({ value, base = Math.E }) => {
		return Math.log(value) / Math.log(base);
	},
);

ai.defineTool(
	{
		name: "exponential",
		description: "Calculate exponential function (e^x)",
		inputSchema: z.object({
			power: z.number(),
		}),
		outputSchema: z.number(),
	},
	async ({ power }) => {
		return Math.exp(power);
	},
);

// Financial analysis tools
ai.defineTool(
	{
		name: "compound_interest",
		description: "Calculate compound interest",
		inputSchema: z.object({
			principal: z.number(),
			rate: z.number(), // annual interest rate as decimal
			time: z.number(), // years
			compounds: z.number().optional(), // times per year
		}),
		outputSchema: z.number(),
	},
	async ({ principal, rate, time, compounds = 12 }) => {
		return principal * (1 + rate / compounds) ** (compounds * time);
	},
);

ai.defineTool(
	{
		name: "present_value",
		description: "Calculate present value of future cash flows",
		inputSchema: z.object({
			futureValue: z.number(),
			rate: z.number(), // discount rate as decimal
			time: z.number(), // years
		}),
		outputSchema: z.number(),
	},
	async ({ futureValue, rate, time }) => {
		return futureValue / (1 + rate) ** time;
	},
);

ai.defineTool(
	{
		name: "npv",
		description: "Calculate Net Present Value of cash flows",
		inputSchema: z.object({
			cashFlows: z.array(z.number()),
			rate: z.number(), // discount rate as decimal
		}),
		outputSchema: z.number(),
	},
	async ({ cashFlows, rate }) => {
		return cashFlows.reduce((npv, cf, t) => npv + cf / (1 + rate) ** t, 0);
	},
);

const darbouxSum = (expr, variable, a, b, n, type = "upper") => {
	try {
		const steps = clampSteps(n);
		const deltaX = (b - a) / steps;
		let sum = 0;
		const node = math.parse(expr);
		const scope = {};

		for (let i = 0; i < steps; i++) {
			const x1 = a + i * deltaX;
			const x2 = x1 + deltaX;
			scope[variable] = x1;
			const y1 = math.evaluate(node, scope);
			scope[variable] = x2;
			const y2 = math.evaluate(node, scope);

			const value = type === "upper" ? Math.max(y1, y2) : Math.min(y1, y2);
			sum += value * deltaX;
		}

		return sum;
	} catch (e) {
		return `Error: ${e.message}`;
	}
};

const findLimit = (expr, variable, approach) => {
	try {
		const node = math.parse(expr);
		const scope = {};
		const epsilon = 1e-10;

		// Evaluate near the approach point
		scope[variable] = approach + epsilon;
		const rightLimit = math.evaluate(node, scope);

		scope[variable] = approach - epsilon;
		const leftLimit = math.evaluate(node, scope);

		// Check if limits from both sides are approximately equal
		if (Math.abs(rightLimit - leftLimit) < epsilon) {
			return (rightLimit + leftLimit) / 2;
		}

		return "Limit does not exist";
	} catch (e) {
		return `Error: ${e.message}`;
	}
};

// Define additional calculus tools
ai.defineTool(
	{
		name: "darboux_sum",
		description: "Calculate the Darboux sum of a function",
		inputSchema: z.object({
			expression: z.string().describe("Function to integrate"),
			variable: z.string().describe("Variable of integration"),
			a: z.number().describe("Lower limit of integration"),
			b: z.number().describe("Upper limit of integration"),
			n: z.number().describe("Number of subintervals"),
			type: z
				.enum(["upper", "lower"])
				.default("upper")
				.describe("Type: upper or lower Darboux sum"),
		}),
		outputSchema: z.union([z.number(), z.string()]),
	},
	async ({ expression, variable, a, b, n, type }) => {
		return darbouxSum(expression, variable, a, b, n, type);
	},
);

ai.defineTool(
	{
		name: "limit",
		description: "Calculate the limit of a function as it approaches a value",
		inputSchema: z.object({
			expression: z.string().describe("Function to evaluate limit"),
			variable: z.string().describe("Variable approaching the limit"),
			approach: z.number().describe("Value the variable approaches"),
		}),
		outputSchema: z.union([z.number(), z.string()]),
	},
	async ({ expression, variable, approach }) => {
		return findLimit(expression, variable, approach);
	},
);

ai.defineTool(
	{
		name: "solve",
		description: "Solve an equation for a variable",
		inputSchema: z.object({
			expression: z.string().describe('Equation to solve (e.g., "x^2 = 4")'),
			variable: z.string().describe("Variable to solve for"),
		}),
		outputSchema: z.array(z.string()),
	},
	async ({ expression, variable }) => {
		try {
			// Convert equation to standard form (expression = 0)
			const sides = expression.split("=").map((s) => s.trim());
			if (sides.length !== 2) {
				throw new Error('Invalid equation format. Use "expression = value"');
			}

			const equationNode = math.parse(`${sides[0]}-(${sides[1]})`);
			const solutions = math.solve(equationNode, variable);
			return solutions.map((sol) => sol.toString());
		} catch (e) {
			return [`Error: ${e.message}`];
		}
	},
);

// Engineering functions
const laplaceTransform = (expr, t, s) => {
	try {
		const node = math.parse(expr);
		// Using numerical integration for a basic approximation
		const upperLimit = 100; // Approximation of infinity
		const steps = 1000;
		const dt = upperLimit / steps;
		let result = math.complex(0, 0);

		for (let i = 0; i < steps; i++) {
			const time = i * dt;
			const scope = { [t]: time };
			const ft = math.evaluate(node, scope);
			const expTerm = math.exp(math.multiply(math.complex(-s, 0), time));
			result = math.add(result, math.multiply(ft, expTerm, dt));
		}

		return result.toString();
	} catch (e) {
		return `Error: ${e.message}`;
	}
};

const fourierTransform = (expr, t, omega) => {
	try {
		const node = math.parse(expr);
		// Using numerical integration for a basic approximation
		const limit = 50; // Approximation of infinity
		const steps = 1000;
		const dt = (2 * limit) / steps;
		let result = math.complex(0, 0);

		for (let i = 0; i < steps; i++) {
			const time = -limit + i * dt;
			const scope = { [t]: time };
			const ft = math.evaluate(node, scope);
			const expTerm = math.exp(math.multiply(math.complex(0, -1), omega, time));
			result = math.add(result, math.multiply(ft, expTerm, dt));
		}

		return result.toString();
	} catch (e) {
		return `Error: ${e.message}`;
	}
};

const zTransform = (expr, n, z, limit = 100) => {
	try {
		const node = math.parse(expr);
		const steps = clampSteps(limit);
		let result = math.complex(0, 0);

		for (let k = 0; k <= steps; k++) {
			const scope = { [n]: k };
			const fn = math.evaluate(node, scope);
			const zTerm = math.pow(z, -k);
			result = math.add(result, math.multiply(fn, zTerm));
		}

		return result.toString();
	} catch (e) {
		return `Error: ${e.message}`;
	}
};

// Engineering transform tools
ai.defineTool(
	{
		name: "laplace_transform",
		description: "Calculate the Laplace transform of a function",
		inputSchema: z.object({
			expression: z.string().describe("Function of time"),
			timeVar: z.string().describe("Time variable"),
			laplaceVar: z.string().describe("Laplace variable"),
		}),
		outputSchema: z.string(),
	},
	async ({ expression, timeVar, laplaceVar }) => {
		return laplaceTransform(expression, timeVar, laplaceVar);
	},
);

ai.defineTool(
	{
		name: "fourier_transform",
		description: "Calculate the Fourier transform of a function",
		inputSchema: z.object({
			expression: z.string().describe("Function of time"),
			timeVar: z.string().describe("Time variable"),
			freqVar: z.string().describe("Frequency variable"),
		}),
		outputSchema: z.string(),
	},
	async ({ expression, timeVar, freqVar }) => {
		return fourierTransform(expression, timeVar, freqVar);
	},
);

ai.defineTool(
	{
		name: "z_transform",
		description: "Calculate the Z-transform of a function",
		inputSchema: z.object({
			expression: z.string().describe("Function of discrete time"),
			timeVar: z.string().describe("Discrete time variable"),
			zVar: z.string().describe("Z-transform variable"),
			limit: z
				.number()
				.optional()
				.describe("Upper limit for summation (default: 100)"),
		}),
		outputSchema: z.string(),
	},
	async ({ expression, timeVar, zVar, limit = 100 }) => {
		return zTransform(expression, timeVar, zVar, limit);
	},
);

// Financial helper functions
const normalCDF = (x) => {
	const t = 1 / (1 + 0.2316419 * Math.abs(x));
	const d = 0.3989423 * Math.exp((-x * x) / 2);
	const p =
		d *
		t *
		(0.31938153 +
			t *
				(-0.356563782 +
					t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
	return x >= 0 ? 1 - p : p;
};

const normalPDF = (x) => {
	return (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * x * x);
};

const blackScholes = (S, K, T, r, sigma, optionType = "call") => {
	try {
		const d1 =
			(Math.log(S / K) + (r + 0.5 * sigma * sigma) * T) /
			(sigma * Math.sqrt(T));
		const d2 = d1 - sigma * Math.sqrt(T);

		if (optionType === "call") {
			return S * normalCDF(d1) - K * Math.exp(-r * T) * normalCDF(d2);
		}
		if (optionType === "put") {
			return K * Math.exp(-r * T) * normalCDF(-d2) - S * normalCDF(-d1);
		}
		throw new Error('Invalid option type. Must be "call" or "put".');
	} catch (e) {
		return `Error: ${e.message}`;
	}
};

const optionGreeks = (S, K, T, r, sigma, optionType = "call") => {
	try {
		const d1 =
			(Math.log(S / K) + (r + 0.5 * sigma * sigma) * T) /
			(sigma * Math.sqrt(T));
		const d2 = d1 - sigma * Math.sqrt(T);

		let delta;
		let gamma;
		let vega;
		let theta;
		let rho;

		if (optionType === "call") {
			delta = normalCDF(d1);
			gamma = normalPDF(d1) / (S * sigma * Math.sqrt(T));
			vega = S * normalPDF(d1) * Math.sqrt(T);
			theta =
				-(S * normalPDF(d1) * sigma) / (2 * Math.sqrt(T)) -
				r * K * Math.exp(-r * T) * normalCDF(d2);
			rho = K * T * Math.exp(-r * T) * normalCDF(d2);
		} else if (optionType === "put") {
			delta = normalCDF(d1) - 1;
			gamma = normalPDF(d1) / (S * sigma * Math.sqrt(T));
			vega = S * normalPDF(d1) * Math.sqrt(T);
			theta =
				-(S * normalPDF(d1) * sigma) / (2 * Math.sqrt(T)) +
				r * K * Math.exp(-r * T) * normalCDF(-d2);
			rho = -K * T * Math.exp(-r * T) * normalCDF(-d2);
		} else {
			throw new Error('Invalid option type. Must be "call" or "put".');
		}

		return { delta, gamma, vega, theta, rho };
	} catch (e) {
		return `Error: ${e.message}`;
	}
};

// Define additional financial tools
ai.defineTool(
	{
		name: "black_scholes",
		description: "Calculate Black-Scholes option price",
		inputSchema: z.object({
			S: z.number().describe("Current price of the asset"),
			K: z.number().describe("Strike price of the option"),
			T: z.number().describe("Time to expiration in years"),
			r: z.number().describe("Risk-free interest rate"),
			sigma: z.number().describe("Volatility of the asset"),
			optionType: z
				.enum(["call", "put"])
				.default("call")
				.describe('Option type: "call" or "put"'),
		}),
		outputSchema: z.union([z.number(), z.string()]),
	},
	async ({ S, K, T, r, sigma, optionType }) => {
		return blackScholes(S, K, T, r, sigma, optionType);
	},
);

ai.defineTool(
	{
		name: "option_greeks",
		description: "Calculate the Greeks for a Black-Scholes option",
		inputSchema: z.object({
			S: z.number().describe("Current price of the asset"),
			K: z.number().describe("Strike price of the option"),
			T: z.number().describe("Time to expiration in years"),
			r: z.number().describe("Risk-free interest rate"),
			sigma: z.number().describe("Volatility of the asset"),
			optionType: z
				.enum(["call", "put"])
				.default("call")
				.describe('Option type: "call" or "put"'),
		}),
		outputSchema: z.union([
			z.object({
				delta: z.number(),
				gamma: z.number(),
				vega: z.number(),
				theta: z.number(),
				rho: z.number(),
			}),
			z.string(),
		]),
	},
	async ({ S, K, T, r, sigma, optionType }) => {
		return optionGreeks(S, K, T, r, sigma, optionType);
	},
);

const server = mcpServer(ai, { name: "genkit_mcp", version: "0.1.0" });
server.start();

// Log when server starts
console.log("Genkit MCP server started. Waiting for connections...");
