import pytest
import numpy as np
from src.server import CalcToolsServer

pytestmark = pytest.mark.asyncio

@pytest.fixture
def server():
    return CalcToolsServer()

@pytest.mark.asyncio
async def test_riemann_integral(server):
    # Test x^2 from 0 to 1 (should be 1/3)
    result = await server._handle_riemann("x**2", 0, 1)
    assert abs(result["result"] - 1/3) < 1e-6

    # Test different methods
    for method in ["left", "right", "midpoint", "trapezoid"]:
        result = await server._handle_riemann("x**2", 0, 1, method=method)
        assert abs(result["result"] - 1/3) < 1e-6

@pytest.mark.asyncio
async def test_darboux_integral(server):
    result = await server._handle_darboux("x**2", 0, 1)
    assert abs(result["integral_value"] - 1/3) < 1e-6
    assert result["upper_sum"] >= result["lower_sum"]

@pytest.mark.asyncio
async def test_riemann_stieltjes(server):
    # Test ∫x dg where g(x) = x^2 from 0 to 1
    # Result should be 1/3
    result = await server._handle_riemann_stieltjes("x", "x**2", 0, 1)
    assert abs(result["result"] - 1/3) < 1e-6

@pytest.mark.asyncio
async def test_lebesgue_integral(server):
    # Test simple continuous function
    result = await server._handle_lebesgue("x**2", 0, 1)
    assert abs(result["result"] - 1/3) < 1e-2

@pytest.mark.asyncio
async def test_ito_integral(server):
    # Test simple process dW(t)
    result = await server._handle_ito("1", 0, 1, paths=1000, steps=1000)
    # Mean should be close to 0 for Ito integral of constant 1
    assert abs(result["mean"]) < 0.1
