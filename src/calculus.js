import * as math from 'mathjs';

export const derivative = (expr, variable = 'x') => {
  try {
    const node = math.parse(expr);
    const derivativeExpr = math.derivative(node, variable);
    return derivativeExpr.toString();
  } catch (e) {
    throw new Error(`Derivative error: ${e.message}`);
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
    
    return rules[expr] || 'Cannot compute integral symbolically for this expression';
  } catch (e) {
    throw new Error(`Integral error: ${e.message}`);
  }
};

export const riemannSum = (expr, variable, a, b, n, method = 'midpoint') => {
  if (n <= 0) throw new Error('n must be positive');
  if (n > 100000) throw new Error('n too large for safety');

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
        sum += node.evaluate(scope) * deltaX;
      }
    } else if (method === 'midpoint') {
      for (let i = 0; i < n; i++) {
        const x = a + (i + 0.5) * deltaX;
        scope[variable] = x;
        sum += node.evaluate(scope) * deltaX;
      }
    } else if (method === 'trapezoid') {
      for (let i = 0; i <= n; i++) {
        const x = a + i * deltaX;
        scope[variable] = x;
        const coef = (i === 0 || i === n) ? 0.5 : 1;
        sum += coef * node.evaluate(scope) * deltaX;
      }
    }
    
    return sum;
  } catch (e) {
    throw new Error(`Riemann sum error: ${e.message}`);
  }
};

export const darbouxSum = (expr, variable, a, b, n, type = 'upper') => {
  if (n <= 0) throw new Error('n must be positive');
  if (n > 100000) throw new Error('n too large for safety');

  try {
    const deltaX = (b - a) / n;
    let sum = 0;
    const node = math.parse(expr);
    const scope = {};

    for (let i = 0; i < n; i++) {
      const x1 = a + i * deltaX;
      const x2 = x1 + deltaX;
      scope[variable] = x1;
      const y1 = node.evaluate(scope);
      scope[variable] = x2;
      const y2 = node.evaluate(scope);
      
      const value = type === 'upper' ? Math.max(y1, y2) : Math.min(y1, y2);
      sum += value * deltaX;
    }
    
    return sum;
  } catch (e) {
    throw new Error(`Darboux sum error: ${e.message}`);
  }
};

export const findLimit = (expr, variable, approach) => {
  try {
    const node = math.parse(expr);
    const scope = {};
    const epsilon = 1e-10;
    
    // Evaluate near the approach point
    scope[variable] = approach + epsilon;
    const rightLimit = node.evaluate(scope);
    
    scope[variable] = approach - epsilon;
    const leftLimit = node.evaluate(scope);
    
    // Check if limits from both sides are approximately equal
    if (Math.abs(rightLimit - leftLimit) < 1e-6) {
      return (rightLimit + leftLimit) / 2;
    }
    
    return 'Limit does not exist or function is discontinuous';
  } catch (e) {
    throw new Error(`Limit error: ${e.message}`);
  }
};

