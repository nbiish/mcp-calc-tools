# MCP Calc Tools

Advanced calculus tools for Model Context Protocol (MCP) servers, implementing various integral types.

## Features

- **Riemann Integral**: Multiple methods (left, right, midpoint, trapezoid)
- **Darboux Integral**: Upper and lower sum approximations
- **Riemann-Stieltjes Integral**: Integration against an integrator function
- **Lebesgue Integral**: Simple function approximation
- **Ito Integral**: Stochastic integration for financial mathematics

## Installation

Using UVX:
```bash
uvx install mcp-server-calc-tools
```

For development:
```bash
git clone https://github.com/nbiish/mcp-calc-tools.git
cd mcp-calc-tools
./build.sh
```

Requirements:
- UV package manager (`pip install uv`)
- UVX for package management

## Usage Examples

### Riemann Integral
```python
# Compute ∫₀¹ x² dx
result = await server.riemann_integral(
    function="x**2",
    start=0,
    end=1,
    method="trapezoid"  # or "left", "right", "midpoint"
)
```

### Darboux Integral
```python
# Compute upper and lower sums for ∫₀¹ x² dx
result = await server.darboux_integral(
    function="x**2",
    start=0,
    end=1,
    partitions=1000
)
```

### Riemann-Stieltjes Integral
```python
# Compute ∫₀¹ x d(x²)
result = await server.riemann_stieltjes(
    function="x",
    integrator="x**2",
    start=0,
    end=1
)
```

### Lebesgue Integral
```python
# Compute ∫₀¹ x² dx using simple function approximation
result = await server.lebesgue_integral(
    function="x**2",
    start=0,
    end=1,
    levels=100
)
```

### Ito Integral
```python
# Compute stochastic integral ∫₀¹ W(t) dW(t)
result = await server.ito_integral(
    function="w",  # Brownian motion as 'w'
    start_time=0,
    end_time=1,
    paths=1000,
    steps=1000
)
```

## Testing

Run the test suite:

```bash
python -m pytest tests/
```

Copyright © 2025 Nbiish Justin Kenwabikise. All rights reserved.
