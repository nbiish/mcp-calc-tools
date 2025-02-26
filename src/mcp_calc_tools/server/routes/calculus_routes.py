"""Calculus route handlers."""

from typing import Dict, Any
from modelcontextprotocol.routing import Router
from pydantic import BaseModel

from mcp_calc_tools.core import calculus

router = Router()


class DerivativeInput(BaseModel):
    """Input model for symbolic derivative calculation."""

    expression: str
    variable: str


@router.tool("symbolic_derivative")
async def symbolic_derivative(data: DerivativeInput) -> Dict[str, Any]:
    """Calculate the symbolic derivative of a mathematical expression."""
    result = calculus.differentiate(data.expression, data.variable)
    return {"result": str(result)}


class IntegralInput(BaseModel):
    """Input model for symbolic integral calculation."""

    expression: str
    variable: str


@router.tool("symbolic_integral")
async def symbolic_integral(data: IntegralInput) -> Dict[str, Any]:
    """Calculate the symbolic integral of a mathematical expression."""
    result = calculus.integrate(data.expression, data.variable)
    return {"result": str(result)}


class EquationInput(BaseModel):
    """Input model for equation solving."""

    expression: str
    variable: str


@router.tool("solve_equation")
async def solve_equation(data: EquationInput) -> Dict[str, Any]:
    """Solve an equation for a given variable."""
    result = calculus.solve_equation(data.expression, data.variable)
    return {"result": str(result)}


class LimitInput(BaseModel):
    """Input model for limit calculation."""

    expression: str
    variable: str
    approach: str


@router.tool("calculate_limit")
async def calculate_limit(data: LimitInput) -> Dict[str, Any]:
    """Calculate the limit of an expression."""
    result = calculus.limit(data.expression, data.variable, data.approach)
    return {"result": str(result)}
