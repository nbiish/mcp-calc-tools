from setuptools import setup, find_packages

setup(
    name="mcp_calc_tools",
    version="0.1.0",
    packages=find_packages(where="src"),
    package_dir={"": "src"},
    install_requires=[
        "fastmcp>=0.4.1",
        "numpy>=1.22.0",
        "scipy>=1.8.0",
        "sympy>=1.10.0",
    ],
    entry_points={
        "console_scripts": [
            "mcp-calc-tools=mcp_calc_tools.server.server:main",
        ],
    },
    python_requires=">=3.8",
    description="A collection of mathematical tools for MCP servers",
    author="Cline",
)
