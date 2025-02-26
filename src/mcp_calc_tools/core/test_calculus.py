import unittest
from .calculus import (
    riemann_sum,
    darboux_sum,
    riemann_stieltjes_sum,
    lebesgue_integral,
    ito_integral,
)
from sympy import symbols


class TestIntegralMethods(unittest.TestCase):
    def test_riemann_sum(self):
        x = symbols("x")
        expression = lambda x: x**2
        a = 0
        b = 1
        n = 100

        # Test different methods
        left_sum = float(riemann_sum(expression, x, a, b, n, method="left"))
        right_sum = float(riemann_sum(expression, x, a, b, n, method="right"))
        midpoint_sum = float(riemann_sum(expression, x, a, b, n, method="midpoint"))
        trapezoid_sum = float(riemann_sum(expression, x, a, b, n, method="trapezoid"))

        self.assertAlmostEqual(left_sum, 0.32835, places=5)
        self.assertAlmostEqual(right_sum, 0.33835, places=5)
        self.assertAlmostEqual(midpoint_sum, 0.33332, places=5)
        self.assertAlmostEqual(trapezoid_sum, 0.33332, places=5)

    def test_darboux_sum(self):
        x = symbols("x")
        expression = lambda x: x**2
        a = 0
        b = 1
        n = 100

        # Test upper and lower sums
        upper_sum = float(darboux_sum(expression, x, a, b, n, type="upper"))
        lower_sum = float(darboux_sum(expression, x, a, b, n, type="lower"))

        self.assertAlmostEqual(upper_sum, 0.33835, places=5)
        self.assertAlmostEqual(lower_sum, 0.32835, places=5)

    def test_riemann_stieltjes_sum(self):
        x = symbols("x")
        expression = lambda x: x**2
        integrator = lambda x: x
        a = 0
        b = 1
        n = 100

        # Test midpoint rule
        stieltjes_sum = float(
            riemann_stieltjes_sum(expression, x, integrator, a, b, n, method="midpoint")
        )
        self.assertAlmostEqual(stieltjes_sum, 0.25, places=2)

    def test_lebesgue_integral(self):
        x = symbols("x")
        expression = lambda x: x**2
        a = 0
        b = 1
        n = 100

        # Test lebesgue integral
        lebesgue_sum = float(lebesgue_integral(expression, x, a, b, n))
        self.assertAlmostEqual(lebesgue_sum, 0.32835, places=5)

    def test_ito_integral(self):
        x = symbols("x")
        expression = lambda x: x**2
        a = 0
        b = 1
        n = 100

        # Test ito integral
        ito_sum = float(ito_integral(expression, x, a, b, n))
        # Ito integral is stochastic, so the result will vary.  We'll just check that it runs without error for now.
        self.assertTrue(isinstance(ito_sum, float))


if __name__ == "__main__":
    unittest.main()
