"""Advanced calculus tools for MCP Calc Tools."""

import numpy as np
import sympy as sp
from scipy import integrate
from fastmcp import FastMCP
from typing import Union, Optional, Dict, Any, Callable

def register_advanced_calculus_tools(mcp: FastMCP):
    """Register advanced calculus tools with the MCP server."""
    
    @mcp.tool()
    def symbolic_derivative(expression: str, variable: str = "x", order: int = 1) -> str:
        """
        Compute the symbolic derivative of an expression.
        
        Args:
            expression: A string representation of a mathematical expression
            variable: The variable to differentiate with respect to (default: "x")
            order: The order of differentiation (default: 1)
            
        Returns:
            The symbolic derivative as a string
            
        Examples:
            symbolic_derivative("x**2 + 3*x + 2")  # Returns "2*x + 3"
            symbolic_derivative("sin(x)")  # Returns "cos(x)"
            symbolic_derivative("x**2", order=2)  # Returns "2"
        """
        try:
            x = sp.Symbol(variable)
            expr = sp.sympify(expression)
            result = expr
            
            for _ in range(order):
                result = sp.diff(result, x)
                
            return str(result)
        except Exception as e:
            return f"Error computing symbolic derivative: {str(e)}"
    
    @mcp.tool()
    def symbolic_integral(expression: str, variable: str = "x", 
                          lower_bound: Optional[Union[float, str]] = None, 
                          upper_bound: Optional[Union[float, str]] = None) -> str:
        """
        Compute the symbolic integral of an expression.
        
        Args:
            expression: A string representation of a mathematical expression
            variable: The variable to integrate with respect to (default: "x")
            lower_bound: Optional lower bound for definite integration
            upper_bound: Optional upper bound for definite integration
            
        Returns:
            The symbolic integral as a string
            
        Examples:
            symbolic_integral("x**2")  # Returns "x**3/3"
            symbolic_integral("sin(x)")  # Returns "-cos(x)"
            symbolic_integral("x**2", lower_bound=0, upper_bound=1)  # Returns "1/3"
        """
        try:
            x = sp.Symbol(variable)
            expr = sp.sympify(expression)
            
            if lower_bound is not None and upper_bound is not None:
                # Convert string bounds to sympy expressions if needed
                if isinstance(lower_bound, str):
                    lower_bound = sp.sympify(lower_bound)
                if isinstance(upper_bound, str):
                    upper_bound = sp.sympify(upper_bound)
                
                result = sp.integrate(expr, (x, lower_bound, upper_bound))
            else:
                result = sp.integrate(expr, x)
                
            return str(result)
        except Exception as e:
            return f"Error computing symbolic integral: {str(e)}"
    
    @mcp.tool()
    def solve_equation(equation: str, variable: str = "x") -> str:
        """
        Solve an equation symbolically.
        
        Args:
            equation: A string representation of an equation (e.g., "x**2 - 4 = 0" or "x**2 - 4")
            variable: The variable to solve for (default: "x")
            
        Returns:
            The solutions as a string
            
        Examples:
            solve_equation("x**2 - 4 = 0")  # Returns "[-2, 2]"
            solve_equation("x**2 - 4")  # Also works, equals 0 is assumed
        """
        try:
            x = sp.Symbol(variable)
            
            # Check if the equation contains an equals sign
            if "=" in equation:
                left, right = equation.split("=", 1)
                left = sp.sympify(left.strip())
                right = sp.sympify(right.strip())
                expr = left - right
            else:
                # Assume equation is set equal to zero
                expr = sp.sympify(equation)
            
            solutions = sp.solve(expr, x)
            return str(solutions)
        except Exception as e:
            return f"Error solving equation: {str(e)}"
    
    @mcp.tool()
    def calculate_limit(expression: str, variable: str = "x", 
                       approaching: Union[float, str] = 0, 
                       direction: str = None) -> str:
        """
        Calculate the limit of an expression.
        
        Args:
            expression: A string representation of a mathematical expression
            variable: The variable in the expression (default: "x")
            approaching: The value the variable approaches
            direction: Direction of approach ("+" for right, "-" for left, None for both)
            
        Returns:
            The limit as a string
            
        Examples:
            calculate_limit("sin(x)/x")  # Returns "1" (as x approaches 0)
            calculate_limit("1/x", approaching=0, direction="+")  # Returns "∞"
        """
        try:
            x = sp.Symbol(variable)
            expr = sp.sympify(expression)
            
            # Handle direction
            if direction == "+":
                dir_arg = "+"
            elif direction == "-":
                dir_arg = "-"
            else:
                dir_arg = None
            
            # Convert string approaching to sympy expression if needed
            if isinstance(approaching, str):
                approaching = sp.sympify(approaching)
                
            result = sp.limit(expr, x, approaching, dir_arg)
            return str(result)
        except Exception as e:
            return f"Error calculating limit: {str(e)}"
    
    @mcp.tool()
    def numerical_integration_methods(function: str, lower_bound: float, upper_bound: float, 
                                    method: str = "quad", points: int = 1000) -> Dict[str, Any]:
        """
        Compute the numerical integral using different methods.
        
        Args:
            function: A string representation of a function in terms of x
            lower_bound: The lower bound of integration
            upper_bound: The upper bound of integration
            method: Integration method ("quad", "trapezoid", "simpson", "midpoint")
            points: Number of points for methods other than quad
            
        Returns:
            Dictionary containing the result and error estimate
            
        Examples:
            numerical_integration_methods("x**2", 0, 1, method="quad")
            numerical_integration_methods("x**2", 0, 1, method="trapezoid", points=1000)
        """
        try:
            # Create a safe evaluation function
            def eval_func(x):
                allowed_vars = {"x": x, "np": np, "sin": np.sin, "cos": np.cos, 
                              "tan": np.tan, "exp": np.exp, "log": np.log, "pi": np.pi}
                return eval(function, {"__builtins__": {}}, allowed_vars)
            
            # Select integration method
            if method == "quad":
                result, error = integrate.quad(eval_func, lower_bound, upper_bound)
                return {"result": float(result), "error": float(error), "method": "scipy.quad"}
            
            elif method == "trapezoid":
                x = np.linspace(lower_bound, upper_bound, points)
                y = np.array([eval_func(xi) for xi in x])
                result = np.trapz(y, x)
                # Approximate error
                error = abs(result - np.trapz(y[::2], x[::2]))
                return {"result": float(result), "error": float(error), "method": "trapezoid"}
            
            elif method == "simpson":
                x = np.linspace(lower_bound, upper_bound, points)
                y = np.array([eval_func(xi) for xi in x])
                result = integrate.simpson(y, x)
                # Approximate error using comparison with lower resolution
                error = abs(result - integrate.simpson(y[::2], x[::2]))
                return {"result": float(result), "error": float(error), "method": "simpson"}
            
            elif method == "midpoint":
                dx = (upper_bound - lower_bound) / points
                x = np.linspace(lower_bound + dx/2, upper_bound - dx/2, points)
                y = np.array([eval_func(xi) for xi in x])
                result = np.sum(y) * dx
                # Approximate error
                error = abs(result - np.sum(y[::2]) * dx * 2)
                return {"result": float(result), "error": float(error), "method": "midpoint"}
            
            else:
                return {"error": f"Unknown method: {method}"}
                
        except Exception as e:
            return {"error": f"Error during integration: {str(e)}"}
    
    @mcp.tool()
    def laplace_transform(expression: str, t_var: str = "t", s_var: str = "s") -> str:
        """
        Compute the Laplace transform of an expression.
        
        Args:
            expression: A string representation of a function in terms of t
            t_var: The time variable (default: "t")
            s_var: The frequency variable (default: "s")
            
        Returns:
            The Laplace transform as a string
            
        Examples:
            laplace_transform("t**2")  # Returns "2/s**3"
            laplace_transform("exp(-a*t)")  # Returns "1/(s + a)"
        """
        try:
            t = sp.Symbol(t_var, real=True, positive=True)
            s = sp.Symbol(s_var, real=True, positive=True)
            
            expr = sp.sympify(expression)
            result = sp.laplace_transform(expr, t, s)
            
            # Extract just the transformation result, not conditions
            if isinstance(result, tuple):
                return str(result[0])
            return str(result)
        except Exception as e:
            return f"Error computing Laplace transform: {str(e)}"
    
    @mcp.tool()
    def taylor_series(expression: str, variable: str = "x", 
                     around_point: Union[float, str] = 0, order: int = 5) -> str:
        """
        Compute the Taylor series expansion of an expression.
        
        Args:
            expression: A string representation of a function
            variable: The variable of the function (default: "x")
            around_point: The point around which to expand
            order: The order of the expansion
            
        Returns:
            The Taylor series as a string
            
        Examples:
            taylor_series("exp(x)")  # Returns "1 + x + x**2/2 + x**3/6 + x**4/24 + x**5/120 + O(x**6)"
            taylor_series("sin(x)", order=3)  # Returns "x - x**3/6 + O(x**4)"
        """
        try:
            x = sp.Symbol(variable)
            expr = sp.sympify(expression)
            
            # Convert string around_point to sympy expression if needed
            if isinstance(around_point, str):
                around_point = sp.sympify(around_point)
                
            series = expr.series(x, around_point, order + 1).removeO()
            return str(series)
        except Exception as e:
            return f"Error computing Taylor series: {str(e)}"

    @mcp.resource("calculus://formulas")
    def get_calculus_formulas() -> str:
        """Get common calculus formulas and identities"""
        return """
        # Calculus Formulas and Identities
        
        ## Derivatives
        - d/dx(x^n) = n·x^(n-1)
        - d/dx(sin(x)) = cos(x)
        - d/dx(cos(x)) = -sin(x)
        - d/dx(e^x) = e^x
        - d/dx(ln(x)) = 1/x
        
        ## Integrals
        - ∫ x^n dx = x^(n+1)/(n+1) + C  (n ≠ -1)
        - ∫ 1/x dx = ln|x| + C
        - ∫ e^x dx = e^x + C
        - ∫ sin(x) dx = -cos(x) + C
        - ∫ cos(x) dx = sin(x) + C
        
        ## Limits
        - lim(x→0) sin(x)/x = 1
        - lim(x→∞) (1 + 1/x)^x = e
        - lim(x→0) (1-cos(x))/x^2 = 1/2
        
        ## Taylor Series
        - e^x = 1 + x + x^2/2! + x^3/3! + ...
        - sin(x) = x - x^3/3! + x^5/5! - ...
        - cos(x) = 1 - x^2/2! + x^4/4! - ...
        - ln(1+x) = x - x^2/2 + x^3/3 - ... (|x| < 1)
        """

    return mcp
