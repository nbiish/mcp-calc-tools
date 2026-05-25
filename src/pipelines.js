import * as math from 'mathjs';
import { createSafeScope } from './security.js';

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

    if (op === 'math') {
      const scope =
        processedArgs.scope && typeof processedArgs.scope === 'object'
          ? createSafeScope(processedArgs.scope)
          : createSafeScope();
      // Substitute $LAST in the expression string with the previous result
      const expression = String(processedArgs.expression).replace(
        /\$LAST/g,
        lastResult !== null && lastResult !== undefined ? String(lastResult) : '0'
      );
      lastResult = math.evaluate(expression, scope);
    } else {
      throw new Error(`Operation ${op} not supported in chain yet.`);
    }
    results.push(lastResult);
  }
  return { lastResult, results };
};
