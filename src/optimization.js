import * as math from 'mathjs';

export const findRoot = (expression, variable, guess, maxIterations = 100, tolerance = 1e-7) => {
  try {
    const node = math.parse(expression);
    const derivativeNode = math.derivative(node, variable);
    
    let x = guess;
    for (let i = 0; i < maxIterations; i++) {
      const scope = { [variable]: x };
      const f_x = node.evaluate(scope);
      const df_x = derivativeNode.evaluate(scope);
      
      if (Math.abs(df_x) < 1e-12) break; // Avoid division by zero
      
      const nextX = x - f_x / df_x;
      if (Math.abs(nextX - x) < tolerance) {
        return nextX;
      }
      x = nextX;
    }
    return x;
  } catch (e) {
    throw new Error(`Find root error: ${e.message}`);
  }
};

