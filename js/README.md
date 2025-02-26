# MCP Calc Tools - JavaScript Implementation

This is the JavaScript implementation of MCP Calc Tools, providing mathematical calculation tools for the Model Context Protocol (MCP).

## Features

### Calculus Tools
- Derivatives
- Indefinite integrals
- Riemann sums (left, right, midpoint, trapezoid methods)
- Darboux sums (upper and lower)
- Limits
- Laplace transforms
- Fourier transforms
- Z-transforms

### Financial Tools
- Black-Scholes option pricing
- Option Greeks (delta, gamma, vega, theta, rho)
- Compound interest calculations
- Present value calculations
- Net Present Value (NPV)

## Installation

```bash
npm install
```

## Usage

Start the MCP server:

```bash
npm start
```

The server will expose mathematical calculation tools that can be used through MCP clients.

## Tool Examples

### Calculate a Derivative
```javascript
// Tool: derivative
// Input:
{
  "expression": "x^2",
  "variable": "x"
}
// Output: "2x"
```

### Calculate Black-Scholes Option Price
```javascript
// Tool: black_scholes
// Input:
{
  "S": 100,    // Current stock price
  "K": 95,     // Strike price
  "T": 0.5,    // Time to expiration (years)
  "r": 0.05,   // Risk-free rate
  "sigma": 0.2, // Volatility
  "optionType": "call"
}
// Output: Price of the option
```

## Dependencies
- genkit
- genkitx-mcp
- mathjs

## License
MIT
