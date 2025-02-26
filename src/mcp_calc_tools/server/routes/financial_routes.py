"""Financial route handlers."""

from typing import Dict, Any, Literal
from modelcontextprotocol.routing import Router
from pydantic import BaseModel, Field

from mcp_calc_tools.core import financial

router = Router()


class BlackScholesInput(BaseModel):
    """Input model for Black-Scholes option price calculation."""

    S: float = Field(..., description="Current price of the asset")
    K: float = Field(..., description="Strike price of the option")
    T: float = Field(..., description="Time to expiration in years")
    r: float = Field(..., description="Risk-free interest rate")
    sigma: float = Field(..., description="Volatility of the asset")
    option_type: Literal["call", "put"] = Field(
        default="call", description="Option type ('call' or 'put')"
    )


@router.tool("black_scholes")
async def black_scholes(data: BlackScholesInput) -> Dict[str, Any]:
    """Calculate Black-Scholes option price."""
    result = financial.black_scholes(
        data.S, data.K, data.T, data.r, data.sigma, data.option_type
    )
    return {"result": float(result)}


class GreeksInput(BaseModel):
    """Input model for Greeks calculation."""

    S: float = Field(..., description="Current price of the asset")
    K: float = Field(..., description="Strike price of the option")
    T: float = Field(..., description="Time to expiration in years")
    r: float = Field(..., description="Risk-free interest rate")
    sigma: float = Field(..., description="Volatility of the asset")
    option_type: Literal["call", "put"] = Field(
        default="call", description="Option type ('call' or 'put')"
    )


@router.tool("greeks")
async def greeks(data: GreeksInput) -> Dict[str, Any]:
    """Calculate option Greeks."""
    result = financial.greeks(
        data.S, data.K, data.T, data.r, data.sigma, data.option_type
    )
    return {
        "delta": float(result["delta"]),
        "gamma": float(result["gamma"]),
        "theta": float(result["theta"]),
        "vega": float(result["vega"]),
        "rho": float(result["rho"]),
    }
