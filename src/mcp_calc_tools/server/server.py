"""MCP Calc Tools Server using FastMCP."""

import logging
from importlib.metadata import version

from fastmcp import FastMCP
import numpy as np
from scipy import integrate

# Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

def create_server() -> FastMCP:
    """Create and configure the FastMCP server instance."""    
    mcp = FastMCP(
        name="mcp-calc-tools",
        version=version("mcp-calc-tools"),
        description="A collection of calculus and mathematical tools for analysis and engineering."
    )

    # Financial calculation tools
    @mcp.tool()
    def compound_interest(principal: float, rate: float, time: float, compounds_per_year: int = 1) -> float:
        """Calculate compound interest."""
        return principal * (1 + rate/compounds_per_year)**(compounds_per_year * time)

    @mcp.tool()
    def present_value(future_value: float, rate: float, time: float) -> float:
        """Calculate present value."""
        return future_value / (1 + rate)**time

    # Engineering calculation tools
    @mcp.tool()
    def linear_regression(x_values: list[float], y_values: list[float]) -> dict:
        """Perform linear regression on x,y data points."""
        if len(x_values) != len(y_values):
            raise ValueError("Input arrays must be the same length")
        
        x = np.array(x_values)
        y = np.array(y_values)
        
        n = len(x)
        slope = (n * np.sum(x * y) - np.sum(x) * np.sum(y)) / (n * np.sum(x**2) - np.sum(x)**2)
        intercept = (np.sum(y) - slope * np.sum(x)) / n
        
        y_pred = slope * x + intercept
        r_squared = 1 - (np.sum((y - y_pred)**2) / np.sum((y - np.mean(y))**2))
        
        return {
            "slope": float(slope),
            "intercept": float(intercept),
            "r_squared": float(r_squared)
        }

    @mcp.resource("formulas://finance")
    def get_finance_formulas() -> str:
        """Get common financial formulas."""
        return """
        Common Financial Formulas:
        
        1. Compound Interest: A = P(1 + r/n)^(nt)
        2. Present Value: PV = FV / (1 + r)^t
        3. Future Value: FV = PV(1 + r)^t
        4. Net Present Value: NPV = Σ[CFt / (1 + r)^t] - Initial Investment
        """

    # Integration tools
    @mcp.tool()
    def definite_integral(function: str, lower_bound: float, upper_bound: float) -> float:
        """Compute the definite integral of a function between bounds."""
        def eval_func(x):
            allowed_vars = {
                "x": x, "np": np, "sin": np.sin, "cos": np.cos, 
                "tan": np.tan, "exp": np.exp, "log": np.log, "pi": np.pi
            }
            return eval(function, {"__builtins__": {}}, allowed_vars)
        
        result, error = integrate.quad(eval_func, lower_bound, upper_bound)
        return float(result)

    @mcp.tool()
    def numeric_derivative(function: str, x: float, h: float = 0.0001) -> float:
        """Compute the numerical derivative of a function at point x."""
        def eval_func(t):
            allowed_vars = {
                "x": t, "np": np, "sin": np.sin, "cos": np.cos, 
                "tan": np.tan, "exp": np.exp, "log": np.log, "pi": np.pi
            }
            return eval(function, {"__builtins__": {}}, allowed_vars)
        
        return (eval_func(x + h) - eval_func(x - h)) / (2 * h)

    @mcp.resource("integral-examples://basic")
    def get_basic_examples() -> str:
        """Get examples of basic integrals."""
        return """
        Basic Integral Examples:
        
        1. ∫ x² dx from 0 to 1 = 1/3
        2. ∫ sin(x) dx from 0 to π = 2
        3. ∫ e^x dx from 0 to 1 = e - 1
        
        Try these with the definite_integral tool!
        """

    # Financial tools extensions
    @mcp.tool()
    def black_scholes(S: float, K: float, T: float, r: float, sigma: float, option_type: str = "call") -> dict:
        """Calculate option price using Black-Scholes model."""
        import scipy.stats as si
        
        d1 = (np.log(S / K) + (r + 0.5 * sigma ** 2) * T) / (sigma * np.sqrt(T))
        d2 = d1 - sigma * np.sqrt(T)
        
        if option_type.lower() == "call":
            price = S * si.norm.cdf(d1) - K * np.exp(-r * T) * si.norm.cdf(d2)
            delta = si.norm.cdf(d1)
            gamma = si.norm.pdf(d1) / (S * sigma * np.sqrt(T))
            theta = -(S * sigma * si.norm.pdf(d1)) / (2 * np.sqrt(T)) - r * K * np.exp(-r * T) * si.norm.cdf(d2)
            vega = S * np.sqrt(T) * si.norm.pdf(d1)
            rho = K * T * np.exp(-r * T) * si.norm.cdf(d2)
        
        elif option_type.lower() == "put":
            price = K * np.exp(-r * T) * si.norm.cdf(-d2) - S * si.norm.cdf(-d1)
            delta = si.norm.cdf(d1) - 1
            gamma = si.norm.pdf(d1) / (S * sigma * np.sqrt(T))
            theta = -(S * sigma * si.norm.pdf(d1)) / (2 * np.sqrt(T)) + r * K * np.exp(-r * T) * si.norm.cdf(-d2)
            vega = S * np.sqrt(T) * si.norm.pdf(d1)
            rho = -K * T * np.exp(-r * T) * si.norm.cdf(-d2)
        
        else:
            raise ValueError("Option type must be 'call' or 'put'")
        
        return {
            "price": float(price),
            "delta": float(delta),
            "gamma": float(gamma),
            "theta": float(theta),
            "vega": float(vega),
            "rho": float(rho)
        }

    @mcp.tool()
    def greeks(S: float, K: float, T: float, r: float, sigma: float, option_type: str = "call") -> dict:
        """Calculate option Greeks using Black-Scholes model."""
        result = black_scholes(S, K, T, r, sigma, option_type)
        del result["price"]
        return result

    return mcp

# Create global server instance
server = create_server()
