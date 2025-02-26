"""Engineering route handlers."""

from typing import Dict, Any
from modelcontextprotocol.routing import Router
from pydantic import BaseModel, Field

from mcp_calc_tools.core import engineering

router = Router()


class LaplaceTransformInput(BaseModel):
    """Input model for Laplace transform calculation."""

    f: str = Field(..., description="Function of time")
    t: str = Field(..., description="Time variable")
    s: str = Field(..., description="Laplace variable")


@router.tool("laplace_transform")
async def laplace_transform(data: LaplaceTransformInput) -> Dict[str, Any]:
    """Calculate the Laplace transform of a function."""
    result = engineering.laplace_transform(data.f, data.t, data.s)
    return {"result": str(result)}
