from sympy import *

x, y, z = symbols("x y z")
init_printing(use_unicode=True)


def differentiate(expression, variable):
    try:
        expression = sympify(expression)
        variable = symbols(variable)
        derivative = diff(expression, variable)
        return str(derivative)
    except Exception as e:
        return f"Error: {e}"


def integrate(expression, variable):
    try:
        expression = sympify(expression)
        variable = symbols(variable)
        integral = integrate(expression, variable)
        return str(integral)
    except Exception as e:
        return f"Error: {e}"


def solve_equation(expression, variable):
    try:
        expression = sympify(expression)
        variable = symbols(variable)
        solutions = solve(expression, variable)
        return [str(solution) for solution in solutions]
    except Exception as e:
        return f"Error: {e}"


def limit(expression, variable, approach):
    try:
        expression = sympify(expression)
        variable = symbols(variable)
        limit_value = limit(expression, variable, approach)
        return str(limit_value)
    except Exception as e:
        return f"Error: {e}"


def riemann_sum(expression, variable, a, b, n, method="midpoint"):
    """
    Calculates the Riemann sum of a function using different methods.

    expression: Function to integrate
    variable: Variable of integration
    a: Lower limit of integration
    b: Upper limit of integration
    n: Number of subintervals
    method: 'left', 'right', 'midpoint', or 'trapezoid'
    """
    try:
        expression = sympify(expression)
        variable = symbols(variable)
        a = float(a)
        b = float(b)
        n = int(n)

        delta_x = (b - a) / n

        if method == "left":
            x_values = [a + i * delta_x for i in range(n)]
            riemann_sum = sum(expression.subs(variable, x) * delta_x for x in x_values)
        elif method == "right":
            x_values = [a + i * delta_x for i in range(1, n + 1)]
            riemann_sum = sum(expression.subs(variable, x) * delta_x for x in x_values)
        elif method == "midpoint":
            x_values = [a + (i + 0.5) * delta_x for i in range(n)]
            riemann_sum = sum(expression.subs(variable, x) * delta_x for x in x_values)
        elif method == "trapezoid":
            x_values = [a + i * delta_x for i in range(n + 1)]
            riemann_sum = (delta_x / 2) * (
                expression.subs(variable, x_values[0])
                + 2 * sum(expression.subs(variable, x) for x in x_values[1:n])
                + expression.subs(variable, x_values[n])
            )
        else:
            return "Error: Invalid method. Choose 'left', 'right', 'midpoint', or 'trapezoid'."

        return str(riemann_sum)
    except Exception as e:
        return f"Error: {e}"


def darboux_sum(expression, variable, a, b, n, type="upper"):
    """
    Calculates the Darboux sum of a function.

    expression: Function to integrate
    variable: Variable of integration
    a: Lower limit of integration
    b: Upper limit of integration
    n: Number of subintervals
    type: 'upper' or 'lower'
    """
    try:
        expression = sympify(expression)
        variable = symbols(variable)
        a = float(a)
        b = float(b)
        n = int(n)

        delta_x = (b - a) / n
        subintervals = [(a + i * delta_x, a + (i + 1) * delta_x) for i in range(n)]

        if type == "upper":
            darboux_sum = sum(
                max(
                    expression.subs(variable, x)
                    for x in [subintervals[i][0], subintervals[i][1]]
                )
                * delta_x
                for i in range(n)
            )
        elif type == "lower":
            darboux_sum = sum(
                min(
                    expression.subs(variable, x)
                    for x in [subintervals[i][0], subintervals[i][1]]
                )
                * delta_x
                for i in range(n)
            )
        else:
            return "Error: Invalid type. Choose 'upper' or 'lower'."

        return str(darboux_sum)
    except Exception as e:
        return f"Error: {e}"


def riemann_stieltjes_sum(expression, variable, integrator, a, b, n, method="midpoint"):
    """
    Calculates the Riemann-Stieltjes sum of a function.

    expression: Function to integrate
    variable: Variable of integration
    integrator: Integrator function (another expression)
    a: Lower limit of integration
    b: Upper limit of integration
    n: Number of subintervals
    method: 'left', 'right', or 'midpoint'
    """
    try:
        expression = sympify(expression)
        variable = symbols(variable)
        integrator = sympify(integrator)
        a = float(a)
        b = float(b)
        n = int(n)

        delta_x = (b - a) / n

        if method == "left":
            x_values = [a + i * delta_x for i in range(n)]
            stieltjes_sum = sum(
                expression.subs(variable, x) * integrator.subs(variable, x) * delta_x
                for x in x_values
            )
        elif method == "right":
            x_values = [a + i * delta_x for i in range(1, n + 1)]
            stieltjes_sum = sum(
                expression.subs(variable, x) * integrator.subs(variable, x) * delta_x
                for x in x_values
            )
        elif method == "midpoint":
            x_values = [a + (i + 0.5) * delta_x for i in range(n)]
            stieltjes_sum = sum(
                expression.subs(variable, x) * integrator.subs(variable, x) * delta_x
                for x in x_values
            )
        else:
            return "Error: Invalid method. Choose 'left', 'right', or 'midpoint'."

        return str(stieltjes_sum)
    except Exception as e:
        return f"Error: {e}"


def lebesgue_integral(expression, variable, a, b, n):
    """
    Calculates the Lebesgue integral of a function using simple function approximation.

    expression: Function to integrate
    variable: Variable of integration
    a: Lower limit of integration
    b: Upper limit of integration
    n: Number of subintervals (for simple function approximation)
    """
    try:
        expression = sympify(expression)
        variable = symbols(variable)
        a = float(a)
        b = float(b)
        n = int(n)

        delta_x = (b - a) / n
        x_values = [a + i * delta_x for i in range(n)]

        # Approximate with simple functions (e.g., step functions)
        lebesgue_sum = sum(expression.subs(variable, x) * delta_x for x in x_values)

        return str(lebesgue_sum)
    except Exception as e:
        return f"Error: {e}"


def ito_integral(expression, variable, a, b, n):
    """
    Calculates the Ito integral (stochastic integral) using a simple approximation.

    expression: Stochastic process to integrate (as a function of time)
    variable: Time variable
    a: Lower limit of integration (start time)
    b: Upper limit of integration (end time)
    n: Number of subintervals
    """
    try:
        expression = sympify(expression)
        variable = symbols(variable)
        a = float(a)
        b = float(b)
        n = int(n)

        delta_t = (b - a) / n
        ito_sum = 0

        # Simple Ito integral approximation (using left endpoint)
        for i in range(n):
            t = a + i * delta_t
            # dW = np.random.normal(0, np.sqrt(delta_t)) # Brownian motion increment (This requires numpy)
            dW = sqrt(delta_t)  # Simplified Brownian motion increment (dW)
            ito_sum += expression.subs(variable, t) * dW

        return str(ito_sum)
    except Exception as e:
        return f"Error: {e}"
