import * as calculus from '../src/calculus.js';
import * as finance from '../src/finance.js';
import * as linalg from '../src/linear-algebra.js';
import assert from 'assert';

console.log('Running Math & Finance Tests...');

try {
  // Calculus Tests
  console.log('- Testing Calculus...');
  assert.strictEqual(calculus.derivative('x^2', 'x'), '2 * x');
  assert.strictEqual(calculus.integral('x', 'x'), 'x^2/2');
  const sum = calculus.riemannSum('x', 'x', 0, 1, 100, 'midpoint');
  assert(Math.abs(sum - 0.5) < 0.001);

  // Linear Algebra Tests
  console.log('- Testing Linear Algebra...');
  const a = [[1, 2], [3, 4]];
  const b = [[5, 6], [7, 8]];
  const mult = linalg.matrixMultiply(a, b);
  assert.deepStrictEqual(mult, [[19, 22], [43, 50]]);
  
  const det = linalg.matrixDeterminant(a);
  assert.strictEqual(det, -2);

  // Finance Tests
  console.log('- Testing Finance...');
  const price = finance.blackScholes(100, 100, 1, 0.05, 0.2, 'call');
  assert(price > 10 && price < 11); // Approx 10.45
  
  const sharpe = finance.sharpeRatio([0.1, 0.2, -0.05, 0.05], 0.01);
  assert(sharpe > 0);

  console.log('✅ All tests passed!');
} catch (e) {
  console.error('❌ Test failed:');
  console.error(e);
  process.exit(1);
}

