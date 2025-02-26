"""Routes package for MCP Calc Tools."""

from fastmcp import FastMCP

from . import calculus_routes
from . import financial_routes
from . import engineering_routes


def register_routes(app: FastMCP) -> None:
    """Register all route modules with the main app."""
    app.include_router(calculus_routes.router)
    app.include_router(financial_routes.router)
    app.include_router(engineering_routes.router)


__all__ = [
    "calculus_routes",
    "financial_routes",
    "engineering_routes",
    "register_routes",
]
