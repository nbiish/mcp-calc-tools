#!/usr/bin/env python3

from fastmcp.server import Server
from fastmcp.schema import Tool, Param
import numpy as np
from scipy import integrate
from typing import List, Dict, Any
import sympy as sp

class CalcToolsServer(Server):
    def __init__(self):
        super().__init__(
            name="mcp-calc-tools",
            version="0.1.0",
            description="Advanced calculus tools implementing various integral types"
        )
        
        # Register all tools
        self.add_tool(self.riemann_integral())
        self.add_tool(self.darboux_integral())
        self.add_tool(self.riemann_stieltjes())
        self.add_tool(self.lebesgue_integral())
        self.add_tool(self.ito_integral())

    def riemann_integral(self) -> Tool:
        """Compute Riemann integral with various methods."""
        return Tool(
            name="riemann_integral",
            description="Compute Riemann integral using specified method",
            params=[
                Param("function", str, "Mathematical function to integrate (e.g., 'x**2')"),
                Param("start", float, "Lower bound of integration"),
                Param("end", float, "Upper bound of integration"),
                Param("method", str, "Integration method (left, right, midpoint, trapezoid)", default="trapezoid")
            ],
            handler=self._handle_riemann
        )

    async def _handle_riemann(self, function: str, start: float, end: float, method: str = "trapezoid") -> Dict[str, Any]:
        try:
            # Convert string to sympy expression
            x = sp.Symbol('x')
            expr = sp.sympify(function)
            f = sp.lambdify(x, expr, 'numpy')
            
            # Number of points for numerical integration
            n = 1000
            x = np.linspace(start, end, n)
            dx = (end - start) / (n - 1)
            
            if method == "left":
                result = np.sum(f(x[:-1]) * dx)
            elif method == "right":
                result = np.sum(f(x[1:]) * dx)
            elif method == "midpoint":
                x_mid = (x[:-1] + x[1:]) / 2
                result = np.sum(f(x_mid) * dx)
            else:  # trapezoid
                result = integrate.trapezoid(f(x), x)
            
            return {
                "result": float(result),
                "method": method,
                "interval": [start, end]
            }
        except Exception as e:
            return {"error": str(e)}

    def darboux_integral(self) -> Tool:
        """Compute Darboux integral using upper and lower sums."""
        return Tool(
            name="darboux_integral",
            description="Compute Darboux integral using upper and lower sums",
            params=[
                Param("function", str, "Mathematical function to integrate"),
                Param("start", float, "Lower bound of integration"),
                Param("end", float, "Upper bound of integration"),
                Param("partitions", int, "Number of partitions", default=1000)
            ],
            handler=self._handle_darboux
        )

    async def _handle_darboux(self, function: str, start: float, end: float, partitions: int = 1000) -> Dict[str, Any]:
        try:
            x = sp.Symbol('x')
            expr = sp.sympify(function)
            f = sp.lambdify(x, expr, 'numpy')
            
            x = np.linspace(start, end, partitions + 1)
            dx = (end - start) / partitions
            
            # Compute values at partition points
            y = f(x)
            # Upper and lower sums
            upper_sum = np.sum(np.maximum.reduce([y[:-1], y[1:]]) * dx)
            lower_sum = np.sum(np.minimum.reduce([y[:-1], y[1:]]) * dx)
            
            return {
                "upper_sum": float(upper_sum),
                "lower_sum": float(lower_sum),
                "integral_value": float((upper_sum + lower_sum) / 2),
                "error_bound": float((upper_sum - lower_sum) / 2)
            }
        except Exception as e:
            return {"error": str(e)}

    def riemann_stieltjes(self) -> Tool:
        """Compute Riemann-Stieltjes integral."""
        return Tool(
            name="riemann_stieltjes",
            description="Compute Riemann-Stieltjes integral",
            params=[
                Param("function", str, "Function to integrate (f)"),
                Param("integrator", str, "Integrator function (g)"),
                Param("start", float, "Lower bound of integration"),
                Param("end", float, "Upper bound of integration"),
                Param("partitions", int, "Number of partitions", default=1000)
            ],
            handler=self._handle_riemann_stieltjes
        )

    async def _handle_riemann_stieltjes(self, function: str, integrator: str, 
                                      start: float, end: float, partitions: int = 1000) -> Dict[str, Any]:
        try:
            x = sp.Symbol('x')
            f_expr = sp.sympify(function)
            g_expr = sp.sympify(integrator)
            
            f = sp.lambdify(x, f_expr, 'numpy')
            g = sp.lambdify(x, g_expr, 'numpy')
            
            # Partition points
            x = np.linspace(start, end, partitions + 1)
            
            # Evaluate functions at partition points
            f_vals = f(x)
            g_vals = g(x)
            
            # Compute differences in g
            dg = np.diff(g_vals)
            
            # Compute Riemann-Stieltjes sum using midpoint values of f
            f_midpoints = (f_vals[1:] + f_vals[:-1]) / 2
            result = np.sum(f_midpoints * dg)
            
            return {
                "result": float(result),
                "partitions": partitions
            }
        except Exception as e:
            return {"error": str(e)}

    def lebesgue_integral(self) -> Tool:
        """Approximate Lebesgue integral using simple functions."""
        return Tool(
            name="lebesgue_integral",
            description="Approximate Lebesgue integral using simple functions",
            params=[
                Param("function", str, "Function to integrate"),
                Param("start", float, "Lower bound of domain"),
                Param("end", float, "Upper bound of domain"),
                Param("levels", int, "Number of levels for simple function approximation", default=100)
            ],
            handler=self._handle_lebesgue
        )

    async def _handle_lebesgue(self, function: str, start: float, end: float, levels: int = 100) -> Dict[str, Any]:
        try:
            x = sp.Symbol('x')
            expr = sp.sympify(function)
            f = sp.lambdify(x, expr, 'numpy')
            
            # Create partition of range
            x_points = np.linspace(start, end, 1000)
            y_values = f(x_points)
            y_min, y_max = np.min(y_values), np.max(y_values)
            
            # Create levels for simple function approximation
            level_values = np.linspace(y_min, y_max, levels)
            dx = (end - start) / 999  # Width of each x-interval
            
            # Approximate using simple functions
            result = 0.0
            for i in range(levels - 1):
                level = level_values[i]
                next_level = level_values[i + 1]
                mask = (y_values >= level) & (y_values < next_level)
                measure = np.sum(mask) * dx  # Lebesgue measure of the set
                result += level * measure
            
            return {
                "result": float(result),
                "levels_used": levels,
                "domain": [float(start), float(end)]
            }
        except Exception as e:
            return {"error": str(e)}

    def ito_integral(self) -> Tool:
        """Compute Ito stochastic integral using simple processes."""
        return Tool(
            name="ito_integral",
            description="Compute Ito stochastic integral for simple processes",
            params=[
                Param("function", str, "Integrand function of time and Brownian motion"),
                Param("start_time", float, "Start time for integration"),
                Param("end_time", float, "End time for integration"),
                Param("paths", int, "Number of sample paths", default=1000),
                Param("steps", int, "Number of time steps", default=1000)
            ],
            handler=self._handle_ito
        )

    async def _handle_ito(self, function: str, start_time: float, end_time: float, 
                         paths: int = 1000, steps: int = 1000) -> Dict[str, Any]:
        try:
            dt = (end_time - start_time) / steps
            times = np.linspace(start_time, end_time, steps + 1)
            
            # Generate Brownian motion paths
            dW = np.random.normal(0, np.sqrt(dt), (paths, steps))
            W = np.cumsum(dW, axis=1)
            W = np.insert(W, 0, 0, axis=1)
            
            # Create function to evaluate integrand
            t, w = sp.symbols('t w')
            expr = sp.sympify(function)
            f = sp.lambdify([t, w], expr, 'numpy')
            
            # Compute Ito integral for each path
            integral_values = np.zeros(paths)
            for i in range(paths):
                integrand = f(times[:-1], W[i, :-1])
                integral_values[i] = np.sum(integrand * dW[i, :])
            
            mean_value = np.mean(integral_values)
            std_value = np.std(integral_values)
            
            return {
                "mean": float(mean_value),
                "std_dev": float(std_value),
                "confidence_interval": [
                    float(mean_value - 1.96 * std_value / np.sqrt(paths)),
                    float(mean_value + 1.96 * std_value / np.sqrt(paths))
                ],
                "paths": paths,
                "steps": steps
            }
        except Exception as e:
            return {"error": str(e)}

if __name__ == "__main__":
    server = CalcToolsServer()
    server.run()
