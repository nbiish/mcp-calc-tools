"""
MCP extension configuration for VSCode integration.
This file helps Cline and Roo Code discover and use your MCP server.
"""

from fastmcp import FastMCP
from .server import mcp

def get_vscode_metadata():
    """
    Return metadata needed for VSCode extension integration.
    """
    return {
        "name": "Math Tools",
        "description": "Mathematical tools for calculus, finance and engineering",
        "version": "0.1.0",
        "publisher": "Cline",
        "extensions": ["roo-code", "cline"],
        "capabilities": ["calculation", "integration", "differentiation", "regression"]
    }

# Register the metadata function with the MCP server
mcp.register_metadata_provider(get_vscode_metadata)
