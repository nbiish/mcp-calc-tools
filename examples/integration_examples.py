"""
Example usage of integration and differentiation functionality.

This file demonstrates how to use the calculus functionality
directly from Python, which can be useful for testing and development.
"""

import numpy as np
from scipy import integrate

def example_definite_integral():
    """Example of calculating a definite integral."""
    # Define the function to integrate
    def f(x):
        return x**2
    
    # Calculate using scipy directly (for comparison)
    result, error = integrate.quad(f, 0, 1)
    print(f"∫ x² dx from 0 to 1 = {result}")
    
    # This is equivalent to calling the MCP tool:
    # definite_integral("x**2", 0, 1)

def example_numeric_derivative():
    """Example of calculating a numerical derivative."""
    # Define the function
    def f(x):
        return x**3
    
    # Point to evaluate derivative at
    x = 2
    h = 0.0001
    
    # Central difference approximation
    derivative = (f(x + h) - f(x - h)) / (2 * h)
    print(f"d/dx(x³) at x=2 is approximately {derivative}")
    
    # This is equivalent to calling the MCP tool:
    # numeric_derivative("x**3", 2)

if __name__ == "__main__":
    print("Running integral examples:")
    example_definite_integral()
    print("\nRunning derivative examples:")
    example_numeric_derivative()
