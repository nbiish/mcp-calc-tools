import * as math from 'mathjs';

/**
 * Evaluates a chain of operations.
 * @param {Array<{op: string, args: any}>} operations 
 * @returns {any}
 */
export const evaluateChain = (operations) => {
  let lastResult = null;
  const results = [];
  
  for (const step of operations) {
    const { op, args } = step;
    // Replace placeholder in args with lastResult if present
    const processedArgs = JSON.parse(JSON.stringify(args), (key, value) => {
      return value === '$LAST' ? lastResult : value;
    });

    // This is a simplified version. A real implementation would map 'op' to actual tool functions.
    // For now, we'll use math.evaluate if it's a simple math op, or handle specific cases.
    if (op === 'math') {
      lastResult = math.evaluate(processedArgs.expression, processedArgs.scope || {});
    } else {
      throw new Error(`Operation ${op} not supported in chain yet.`);
    }
    results.push(lastResult);
  }
  return { lastResult, results };
};

