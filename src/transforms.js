import * as math from 'mathjs';

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
      const ft = node.evaluate(scope);
      const expTerm = math.exp(math.multiply(math.complex(-s, 0), time));
      result = math.add(result, 
        math.multiply(ft, expTerm, dt));
    }
    
    return result.toString();
  } catch (e) {
    throw new Error(`Laplace Transform error: ${e.message}`);
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
      const ft = node.evaluate(scope);
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
    throw new Error(`Fourier Transform error: ${e.message}`);
  }
};

export const zTransform = (expr, n, z, limit = 100) => {
  if (limit > 10000) throw new Error('Limit too large for safety');
  try {
    const node = math.parse(expr);
    let result = math.complex(0, 0);
    
    for (let k = 0; k <= limit; k++) {
      const scope = { [n]: k };
      const fn = node.evaluate(scope);
      const zTerm = math.pow(z, -k);
      result = math.add(result, math.multiply(fn, zTerm));
    }
    
    return result.toString();
  } catch (e) {
    throw new Error(`Z-Transform error: ${e.message}`);
  }
};

