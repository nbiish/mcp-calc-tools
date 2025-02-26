import * as math from 'mathjs';

export const derivative = (expr, variable = 'x') => {
  try {
    const node = math.parse(expr);
    const derivativeExpr = math.derivative(node, variable);
    return derivativeExpr.toString();
  } catch (e) {
    return `Error: ${e.message}`;
  }
};

export const integral = (expr, variable = 'x') => {
  try {
    // For basic polynomials
    const powerMatch = expr.match(new RegExp(`${variable}\\^(\\d+)`));
    if (powerMatch) {
      const n = parseInt(powerMatch[1]);
      return `${variable}^${n + 1}/${n + 1}`;
    }
    
    // For basic functions
    const rules = {
      'e^x': 'e^x',
      '1/x': `ln|${variable}|`,
      [`sin(${variable})`]: `-cos(${variable})`,
      [`cos(${variable})`]: `sin(${variable})`,
      'x': 'x^2/2'
    };
    
    return rules[expr] || 'Cannot compute integral';
  } catch (e) {
    return `Error: ${e.message}`;
  }
};

export const riemannSum = (expr, variable, a, b, n, method = 'midpoint') => {
  try {
    const deltaX = (b - a) / n;
    let sum = 0;
    const node = math.parse(expr);
    const scope = {};
    
    if (method === 'left' || method === 'right') {
      const offset = method === 'right' ? 1 : 0;
      for (let i = 0; i < n; i++) {
        const x = a + (i + offset) * deltaX;
        scope[variable] = x;
        sum += math.evaluate(node, scope) * deltaX;
      }
    } else if (method === 'midpoint') {
      for (let i = 0; i < n; i++) {
        const x = a + (i + 0.5) * deltaX;
        scope[variable] = x;
        sum += math.evaluate(node, scope) * deltaX;
      }
    } else if (method === 'trapezoid') {
      for (let i = 0; i <= n; i++) {
        const x = a + i * deltaX;
        scope[variable] = x;
        const coef = (i === 0 || i === n) ? 0.5 : 1;
        sum += coef * math.evaluate(node, scope) * deltaX;
      }
    }
    
    return sum;
  } catch (e) {
    return `Error: ${e.message}`;
  }
};

export const darbouxSum = (expr, variable, a, b, n, type = 'upper') => {
  try {
    const deltaX = (b - a) / n;
    let sum = 0;
    const node = math.parse(expr);
    const scope = {};

    for (let i = 0; i < n; i++) {
      const x1 = a + i * deltaX;
      const x2 = x1 + deltaX;
      scope[variable] = x1;
      const y1 = math.evaluate(node, scope);
      scope[variable] = x2;
      const y2 = math.evaluate(node, scope);
      
      const value = type === 'upper' ? Math.max(y1, y2) : Math.min(y1, y2);
      sum += value * deltaX;
    }
    
    return sum;
  } catch (e) {
    return `Error: ${e.message}`;
  }
};

export const findLimit = (expr, variable, approach) => {
  try {
    const node = math.parse(expr);
    const scope = {};
    const epsilon = 1e-10;
    
    // Evaluate near the approach point
    scope[variable] = approach + epsilon;
    const rightLimit = math.evaluate(node, scope);
    
    scope[variable] = approach - epsilon;
    const leftLimit = math.evaluate(node, scope);
    
    // Check if limits from both sides are approximately equal
    if (Math.abs(rightLimit - leftLimit) < epsilon) {
      return (rightLimit + leftLimit) / 2;
    }
    
    return 'Limit does not exist';
  } catch (e) {
    return `Error: ${e.message}`;
  }
};

export const laplaceTransform = (expr, t, s) => {
  try {
    const node = math.parse(expr);
    // Using numerical integration for a basic approximation
    const upperLimit = 100; // Approximation of infinity
    const steps = 1000;
    const dt = upperLimit / steps;
    let result = math.complex(0, 0);
    
    for (let i = 0; i < steps; i++) {
      const time = i * dt;
      const scope = { [t]: time };
      const ft = math.evaluate(node, scope);
      const expTerm = math.exp(math.multiply(math.complex(-s, 0), time));
      result = math.add(result, 
        math.multiply(ft, expTerm, dt));
    }
    
    return result.toString();
  } catch (e) {
    return `Error: ${e.message}`;
  }
};

export const fourierTransform = (expr, t, omega) => {
  try {
    const node = math.parse(expr);
    // Using numerical integration for a basic approximation
    const limit = 50; // Approximation of infinity
    const steps = 1000;
    const dt = (2 * limit) / steps;
    let result = math.complex(0, 0);
    
    for (let i = 0; i < steps; i++) {
      const time = -limit + i * dt;
      const scope = { [t]: time };
      const ft = math.evaluate(node, scope);
      const expTerm = math.exp(
        math.multiply(
          math.complex(0, -1),
          omega,
          time
        )
      );
      result = math.add(result, 
        math.multiply(ft, expTerm, dt));
    }
    
    return result.toString();
  } catch (e) {
    return `Error: ${e.message}`;
  }
};

export const zTransform = (expr, n, z, limit = 100) => {
  try {
    const node = math.parse(expr);
    let result = math.complex(0, 0);
    
    for (let k = 0; k <= limit; k++) {
      const scope = { [n]: k };
      const fn = math.evaluate(node, scope);
      const zTerm = math.pow(z, -k);
      result = math.add(result, math.multiply(fn, zTerm));
    }
    
    return result.toString();
  } catch (e) {
    return `Error: ${e.message}`;
  }
};
