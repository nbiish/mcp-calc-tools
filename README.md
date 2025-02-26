# MCP Calc Tools

A Model Context Protocol (MCP) server that provides advanced mathematical and financial calculation tools for integration with AI code assistants like Cline and Roo Code.

## Overview

MCP Calc Tools exposes mathematical computation capabilities through a standardized interface that AI assistants can interact with. This enables AI tools to perform complex calculations without having to implement mathematical algorithms directly.

## Features

### Mathematical Tools
- **Symbolic Calculus**
  - `derivative`: Calculate symbolic derivatives of expressions
  - `integral`: Compute symbolic integrals
  - `limit`: Evaluate limits as variables approach specified values
  - `solve`: Solve equations for specific variables

### Numerical Methods
- `riemann_sum`: Calculate definite integrals using Riemann sums with multiple methods (left, right, midpoint, trapezoid)
- `darboux_sum`: Calculate upper and lower Darboux sums for integral approximation
- `area`: Calculate the area under a curve between two points
- `volume`: Calculate volume of revolution around x-axis

### Mathematical Transforms
- `laplace_transform`: Calculate Laplace transforms of functions
- `fourier_transform`: Calculate Fourier transforms of functions
- `z_transform`: Calculate Z-transforms of discrete-time functions

### Financial Tools
- `compound_interest`: Calculate compound interest with customizable compounding periods
- `present_value`: Calculate present value of future cash flows
- `npv`: Calculate Net Present Value of cash flow series
- `black_scholes`: Calculate option prices using the Black-Scholes model
- `option_greeks`: Calculate option Greeks (delta, gamma, vega, theta, rho)

### Utility Functions
- `logarithm`: Calculate logarithm with any base
- `exponential`: Calculate exponential function (e^x)

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/mcp-calc-tools.git

# Navigate to project directory
cd mcp-calc-tools

# Install dependencies
npm install
# or
pnpm install
```

## Usage

### Starting the MCP server

```bash
# Make the script executable (if needed)
chmod +x index.js

# Run the server
npm start
# or
node index.js
```

### Integrating with AI Assistants

To use MCP Calc Tools with AI coding assistants:

1. Configure your AI assistant (Cline/Roo Code) to use the MCP server
2. Set the server URL to your running instance
3. The AI assistant will now have access to all the mathematical tools

Example request to calculate a derivative:
```
Calculate the derivative of x^2*sin(x)
```

## Requirements

- Node.js v14 or higher
- Required packages:
  - genkit (^1.0.5)
  - genkitx-mcp (^1.0.5)
  - mathjs (^12.0.0)

## Development

The project is structured as follows:

- index.js: Main server implementation with all tool definitions
- package.json: Project dependencies and script definitions

## License

[Add your license information here]

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
