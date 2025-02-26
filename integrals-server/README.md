# Integrals MCP Server

This is an MCP (Model Context Protocol) server that calculates integrals for mathematical expressions.

## Features

- Calculate definite integrals with specific bounds
- Handle various mathematical expressions using the mathjs library

## Installation

```bash
# Install dependencies
npm install

# Build the server
npm run build
```

## Usage

Start the server:

```bash
npm start
```

The server will listen on port 3400 by default.

## API

The server supports the following MCP method:

### calculateIntegral

Calculate an integral of a mathematical expression.

**Parameters:**

- `expression` (string): The mathematical expression to integrate
- `variable` (string): The variable to integrate with respect to
- `lowerBound` (number|string, optional): Lower bound for definite integral
- `upperBound` (number|string, optional): Upper bound for definite integral

**Example request:**

```json
{
  "method": "calculateIntegral",
  "parameters": {
    "expression": "x^2",
    "variable": "x",
    "lowerBound": 0,
    "upperBound": 1
  }
}
```

**Example response:**

```json
{
  "result": 0.3333333333333333
}
```

## Cline Integration

To use this server with Cline, make sure it's properly configured in your `cline_mcp_settings.json` file:

```json
"integrals-server": {
  "command": "node",
  "args": [
    "/path/to/integrals-server/build/index.js"
  ],
  "cwd": "/path/to/mcp-calc-tools",
  "disabled": false,
  "autoApprove": ["calculateIntegral"]
}
```
