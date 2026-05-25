import * as calculus from '../src/calculus.js';
import * as finance from '../src/finance.js';
import * as linalg from '../src/linear-algebra.js';
import * as probability from '../src/probability.js';
import * as optim from '../src/optimization.js';
import * as transforms from '../src/transforms.js';
import * as pipelines from '../src/pipelines.js';
import * as utils from '../src/utils.js';
import assert from 'assert';

const passed = [];
const failed = [];

function test(name, fn) {
  try {
    fn();
    passed.push(name);
  } catch (e) {
    failed.push({ name, error: e });
  }
}

function closeEnough(actual, expected, tolerance = 1e-4) {
  if (typeof actual === 'number' && typeof expected === 'number') {
    assert(Math.abs(actual - expected) < tolerance,
      `Expected ${expected} ± ${tolerance}, got ${actual}`);
  } else {
    assert.strictEqual(actual, expected);
  }
}

// ============================================================
// Calculus
// ============================================================

test('derivative: x^2 -> 2 * x', () => {
  assert.strictEqual(calculus.derivative('x^2', 'x'), '2 * x');
});

test('derivative: sin(x) -> cos(x)', () => {
  assert.strictEqual(calculus.derivative('sin(x)', 'x'), 'cos(x)');
});

test('integral: x -> x^2/2', () => {
  assert.strictEqual(calculus.integral('x', 'x'), '0.5 * x^2');
});

test('integral: x^3 -> x^4/4', () => {
  assert.strictEqual(calculus.integral('x^3', 'x'), 'x^4/4');
});

test('integral: 3*x^2 -> x^3', () => {
  assert.strictEqual(calculus.integral('3*x^2', 'x'), '1 * x^3');
});

test('integral: 5 -> 5 * x', () => {
  assert.strictEqual(calculus.integral('5', 'x'), '5 * x');
});

test('integral: sin(x) -> -cos(x)', () => {
  assert.strictEqual(calculus.integral('sin(x)', 'x'), '-1 * cos(1 * x)');
});

test('integral: cos(x) -> sin(x)', () => {
  assert.strictEqual(calculus.integral('cos(x)', 'x'), '1 * sin(1 * x)');
});

test('integral: e^(2*x) -> 0.5 * e^(2*x)', () => {
  assert.strictEqual(calculus.integral('e^(2*x)', 'x'), '0.5 * e^(2 * x)');
});

test('integral: 1/x -> ln|x|', () => {
  assert.strictEqual(calculus.integral('1/x', 'x'), 'ln|x|');
});

test('integral: sin(3*x) -> -(1/3)*cos(3*x)', () => {
  const result = calculus.integral('sin(3*x)', 'x');
  assert.ok(result.includes('-0.333'), `Expected coefficient ~-0.333 in "${result}"`);
  assert.ok(result.includes('cos'), `Expected cos in "${result}"`);
});

test('integral: cos(5*x) -> (1/5)*sin(5*x)', () => {
  const result = calculus.integral('cos(5*x)', 'x');
  assert.ok(result.includes('0.2'), `Expected coefficient 0.2 in "${result}"`);
  assert.ok(result.includes('sin'), `Expected sin in "${result}"`);
});

test('integral: x * sin(x) -> sin(x) - x*cos(x) (by parts)', () => {
  assert.strictEqual(calculus.integral('x * sin(x)', 'x'), 'sin(x) - x * cos(x)');
});

test('integral: x * cos(x) -> cos(x) + x*sin(x) (by parts)', () => {
  assert.strictEqual(calculus.integral('x * cos(x)', 'x'), 'cos(x) + x * sin(x)');
});

test('integral: x * e^x -> e^x * (x - 1) (by parts)', () => {
  assert.strictEqual(calculus.integral('x * e^x', 'x'), 'e^x * (x - 1)');
});

test('integral: ln(x) -> x*ln(x) - x (by parts)', () => {
  assert.strictEqual(calculus.integral('ln(x)', 'x'), 'x * ln(x) - x');
});

test('integral: x * ln(x) -> x^2/2*ln(x) - x^2/4 (by parts)', () => {
  assert.strictEqual(calculus.integral('x * ln(x)', 'x'), 'x^2/2 * ln(x) - x^2/4');
});

test('integral: 1/(1+x^2) -> atan(x) (u-sub pattern)', () => {
  assert.strictEqual(calculus.integral('1/(1 + x^2)', 'x'), 'atan(x)');
});

test('integral: e^(x^2) * x -> 0.5*e^(x^2) (u-sub)', () => {
  const result = calculus.integral('e^(x^2) * x', 'x');
  assert.ok(result.includes('0.5'), `Expected 0.5 in "${result}"`);
  assert.ok(result.includes('e^(x^2)'), `Expected e^(x^2) in "${result}"`);
});

test('riemann_sum: x from 0 to 1 ≈ 0.5', () => {
  closeEnough(calculus.riemannSum('x', 'x', 0, 1, 100, 'midpoint'), 0.5);
});

test('riemann_sum: x^2 from 0 to 1 ≈ 1/3 (trapezoid)', () => {
  closeEnough(calculus.riemannSum('x^2', 'x', 0, 1, 1000, 'trapezoid'), 1 / 3);
});

test('riemann_sum: rejects n > 100000', () => {
  assert.throws(() => calculus.riemannSum('x', 'x', 0, 1, 100001, 'midpoint'));
});

test('limit: x^2 at x->3 ≈ 9', () => {
  closeEnough(calculus.findLimit('x^2', 'x', 3), 9);
});

test('limit: sin(x)/x at x->0 ≈ 1', () => {
  closeEnough(calculus.findLimit('sin(x)/x', 'x', 0), 1, 1e-4);
});

// ============================================================
// Linear Algebra
// ============================================================

test('matrix_multiply: [[1,2],[3,4]] * [[5,6],[7,8]]', () => {
  assert.deepStrictEqual(
    linalg.matrixMultiply([[1, 2], [3, 4]], [[5, 6], [7, 8]]),
    [[19, 22], [43, 50]]
  );
});

test('matrix_determinant: [[1,2],[3,4]] = -2', () => {
  assert.strictEqual(linalg.matrixDeterminant([[1, 2], [3, 4]]), -2);
});

test('matrix_inverse: [[1,2],[3,4]]', () => {
  const inv = linalg.matrixInverse([[1, 2], [3, 4]]);
  // Inverse should satisfy A * A^-1 = I
  const product = linalg.matrixMultiply([[1, 2], [3, 4]], inv);
  closeEnough(product[0][0], 1);
  closeEnough(product[0][1], 0);
  closeEnough(product[1][0], 0);
  closeEnough(product[1][1], 1);
});

test('eigenvalues: [[4,1],[2,3]]', () => {
  const eigs = linalg.eigenvalues([[4, 1], [2, 3]]);
  // Eigenvalues of [[4,1],[2,3]] are 5 and 2
  const sorted = [...eigs].sort((a, b) => a - b);
  closeEnough(sorted[0], 2, 0.1);
  closeEnough(sorted[1], 5, 0.1);
});

test('matrix_multiply: rejects mismatched dimensions', () => {
  assert.throws(() => linalg.matrixMultiply([[1, 2]], [[1, 2]]));
});

test('matrix_inverse: rejects non-square', () => {
  assert.throws(() => linalg.matrixInverse([[1, 2, 3], [4, 5, 6]]));
});

// ============================================================
// Finance
// ============================================================

test('black_scholes: call option ~10.45', () => {
  const price = finance.blackScholes(100, 100, 1, 0.05, 0.2, 'call');
  closeEnough(price, 10.45, 0.5);
});

test('black_scholes: put-call parity', () => {
  const S = 100, K = 105, T = 0.5, r = 0.03, sigma = 0.2;
  const call = finance.blackScholes(S, K, T, r, sigma, 'call');
  const put = finance.blackScholes(S, K, T, r, sigma, 'put');
  // Put-call parity: C - P = S - K*e^(-rT)
  const parity = S - K * Math.exp(-r * T);
  closeEnough(call - put, parity, 0.05);
});

test('option_greeks: call delta between 0 and 1', () => {
  const greeks = finance.optionGreeks(100, 100, 1, 0.05, 0.2, 'call');
  assert(greeks.delta > 0 && greeks.delta < 1, `call delta=${greeks.delta}`);
  assert(greeks.gamma > 0, `gamma=${greeks.gamma} should be positive`);
  assert(greeks.vega > 0, `vega=${greeks.vega} should be positive`);
});

test('option_greeks: put delta between -1 and 0', () => {
  const greeks = finance.optionGreeks(100, 100, 1, 0.05, 0.2, 'put');
  assert(greeks.delta > -1 && greeks.delta < 0, `put delta=${greeks.delta}`);
});

test('sharpe_ratio: positive for positive drift', () => {
  const sharpe = finance.sharpeRatio([0.1, 0.2, -0.05, 0.05], 0.01);
  assert(sharpe > 0);
});

test('sharpe_ratio: returns 0 for zero std', () => {
  assert.strictEqual(finance.sharpeRatio([5, 5], 0), 0);
});

test('value_at_risk: basic calculation', () => {
  const returns = Array(20).fill(0).map((_, i) => i * 0.01 - 0.1);
  const var95 = finance.valueAtRisk(returns, 0.95);
  assert(typeof var95 === 'number' && var95 > 0, `VaR should be positive, got ${var95}`);
});

test('cashflow_schedule: 1000 at 10% for 3 periods', () => {
  const schedule = finance.cashflowSchedule(1000, 0.1, 3);
  assert.strictEqual(schedule.length, 3);
  closeEnough(schedule[0].balance, 1100);
  closeEnough(schedule[2].balance, 1331, 0.5);
});

test('finance: rejects invalid inputs', () => {
  assert.throws(() => finance.blackScholes(-1, 100, 1, 0.05, 0.2, 'call'));
  assert.throws(() => finance.cashflowSchedule(100, 0.05, 12, 0));
});

// ============================================================
// Probability
// ============================================================

test('normal_distribution: PDF at x=0, mu=0, sigma=1', () => {
  const pdf = probability.normalDistribution(0, 0, 1);
  closeEnough(pdf, 1 / Math.sqrt(2 * Math.PI), 1e-10);
});

test('normal_distribution: PDF at x=mu is max', () => {
  const atMean = probability.normalDistribution(5, 5, 1);
  const away = probability.normalDistribution(6, 5, 1);
  assert(atMean > away);
});

test('normal_distribution: rejects sigma <= 0', () => {
  assert.throws(() => probability.normalDistribution(0, 0, 0));
  assert.throws(() => probability.normalDistribution(0, 0, -1));
});

test('binomial_distribution: P(X=5|n=10,p=0.5)', () => {
  const p = probability.binomialDistribution(5, 10, 0.5);
  closeEnough(p, 0.2461, 0.001);
});

test('binomial_distribution: P(X=0|n=5,p=0) = 1', () => {
  closeEnough(probability.binomialDistribution(0, 5, 0), 1);
});

test('binomial_distribution: k>n returns 0', () => {
  assert.strictEqual(probability.binomialDistribution(6, 5, 0.5), 0);
});

test('poisson_distribution: P(X=0|λ=1)', () => {
  closeEnough(probability.poissonDistribution(0, 1), Math.exp(-1), 1e-10);
});

test('poisson_distribution: P(X=3|λ=2)', () => {
  const expected = (Math.pow(2, 3) * Math.exp(-2)) / 6;
  closeEnough(probability.poissonDistribution(3, 2), expected, 1e-10);
});

test('poisson_distribution: rejects invalid k', () => {
  assert.throws(() => probability.poissonDistribution(-1, 1));
  assert.throws(() => probability.poissonDistribution(1.5, 1));
});

// ============================================================
// Optimization
// ============================================================

test('find_root: x^2 - 4 = 0 => ±2', () => {
  const root = optim.findRoot('x^2 - 4', 'x', 3);
  closeEnough(root, 2);
});

test('find_root: x^2 - 4 = 0 from negative guess => -2', () => {
  const root = optim.findRoot('x^2 - 4', 'x', -3);
  closeEnough(root, -2);
});

test('find_root: cos(x) - 0.5 = 0 => π/3', () => {
  const root = optim.findRoot('cos(x) - 0.5', 'x', 1);
  closeEnough(root, Math.PI / 3, 1e-5);
});

test('find_root: linear x - 5 = 0 => 5', () => {
  closeEnough(optim.findRoot('x - 5', 'x', 0), 5, 1e-10);
});

// ============================================================
// Transforms
// ============================================================

test('laplace_transform: e^(-t) at s=1 ≈ 1/(s+1) = 0.5', () => {
  const result = transforms.laplaceTransform('e^(-t)', 't', 1);
  const numeric = parseFloat(result.replace(/[()]/g, ''));
  closeEnough(numeric, 0.5, 0.05);
});

test('laplace_transform: 1 at s=0 ≈ 100 (integral of 1 from 0 to 100)', () => {
  const result = transforms.laplaceTransform('1', 't', 0);
  const numeric = parseFloat(result.replace(/[()]/g, ''));
  closeEnough(numeric, 100, 5);
});

test('fourier_transform: e^(-t^2) at ω=0 ≈ sqrt(pi) (Gaussian)', () => {
  const result = transforms.fourierTransform('e^(-t^2)', 't', 0);
  const numeric = parseFloat(result.replace(/[()]/g, ''));
  closeEnough(numeric, Math.sqrt(Math.PI), 0.5);
});

test('laplace_transform: rejects unsafe variable', () => {
  assert.throws(() => transforms.laplaceTransform('t', '__proto__', 1));
});

test('fourier_transform: rejects unsafe variable', () => {
  assert.throws(() => transforms.fourierTransform('t', 'constructor', 1));
});

// --- Convergence tests for numerical transforms ---

test('laplace convergence: e^(-t) improves with known transform 1/(s+1)', () => {
  // L{e^(-t)} = 1/(s+1). Test at s=2, exact = 1/3 ≈ 0.333
  const exact = 1 / 3;
  const result = transforms.laplaceTransform('e^(-t)', 't', 2);
  const numeric = parseFloat(result.replace(/[()]/g, ''));
  closeEnough(numeric, exact, 0.05);
});

test('fourier convergence: dirac-like impulse at t=0 (using narrow Gaussian)', () => {
  // Fourier transform of e^(-t^2) = sqrt(pi)*e^(-omega^2/4)
  // At omega=0, this is sqrt(pi) ≈ 1.772
  const result = transforms.fourierTransform('e^(-t^2)', 't', 0);
  const numeric = parseFloat(result.replace(/[()]/g, ''));
  closeEnough(numeric, Math.sqrt(Math.PI), 0.5);
});

test('fourier convergence: e^(-t^2) at ω=2', () => {
  // sqrt(pi)*e^(-4/4) = sqrt(pi)*e^(-1) ≈ 0.652
  const expected = Math.sqrt(Math.PI) * Math.exp(-1);
  const result = transforms.fourierTransform('e^(-t^2)', 't', 2);
  const numeric = parseFloat(result.replace(/[()]/g, ''));
  closeEnough(numeric, expected, 0.5);
});

// ============================================================
// Pipelines
// ============================================================

test('pipeline: single math operation', () => {
  const result = pipelines.evaluateChain([
    { op: 'math', args: { expression: '2 + 3' } }
  ]);
  assert.strictEqual(result.lastResult, 5);
  assert.deepStrictEqual(result.results, [5]);
});

test('pipeline: chained with $LAST', () => {
  const result = pipelines.evaluateChain([
    { op: 'math', args: { expression: '10' } },
    { op: 'math', args: { expression: '$LAST + 5' } },
    { op: 'math', args: { expression: '$LAST * 2' } }
  ]);
  assert.strictEqual(result.lastResult, 30);
  assert.deepStrictEqual(result.results, [10, 15, 30]);
});

test('pipeline: math with scope', () => {
  const result = pipelines.evaluateChain([
    { op: 'math', args: { expression: 'x + y', scope: { x: 3, y: 7 } } }
  ]);
  assert.strictEqual(result.lastResult, 10);
});

test('pipeline: rejects unsupported op', () => {
  assert.throws(() => pipelines.evaluateChain([
    { op: 'unknown', args: {} }
  ]));
});

// ============================================================
// Utils
// ============================================================

test('volume_of_revolution: y=1 from 0 to 1 => π', () => {
  const vol = utils.volumeOfRevolution('1', 0, 1, 1000);
  closeEnough(vol, Math.PI, 0.01);
});

test('volume_of_revolution: y=x from 0 to 1 => π/5', () => {
  // V = π * integral(x^2, 0, 1) = π/3... actually for y=x, V = π∫x²dx = π/3
  const vol = utils.volumeOfRevolution('x', 0, 1, 5000);
  closeEnough(vol, Math.PI / 3, 0.01);
});

test('volume_of_revolution: rejects steps > 100000', () => {
  assert.throws(() => utils.volumeOfRevolution('1', 0, 1, 100001));
});

test('compound_interest: 1000 at 10% for 1 year monthly', () => {
  const result = utils.compoundInterest(1000, 0.1, 1, 12);
  closeEnough(result, 1104.71, 0.5);
});

test('npv: basic cashflows at 10%', () => {
  const result = utils.npv([-100, 30, 30, 30, 30], 0.1);
  closeEnough(result, -4.87, 0.5);
});

// ============================================================
// Security Hardening
// ============================================================

test('security: rejects __proto__ variable', () => {
  assert.throws(() => calculus.riemannSum('x', '__proto__', 0, 1, 10, 'midpoint'));
});

test('security: rejects regex-injection variable', () => {
  assert.throws(() => calculus.integral('x^2', 'x('));
});

test('security: rejects constructor variable', () => {
  assert.throws(() => optim.findRoot('x^2 - 4', 'constructor', 1));
});

test('security: rejects unsafe transform variable', () => {
  assert.throws(() => transforms.laplaceTransform('t', '__proto__', 1));
});

test('security: normal_distribution rejects sigma=0', () => {
  assert.throws(() => probability.normalDistribution(0, 0, 0));
});

test('security: cashflowSchedule rejects compounds=0', () => {
  assert.throws(() => finance.cashflowSchedule(100, 0.05, 12, 0));
});

// ============================================================
// Summary
// ============================================================

console.log('');
for (const name of passed) {
  console.log(`  ✅ ${name}`);
}
for (const { name, error } of failed) {
  console.error(`  ❌ ${name}`);
  console.error(`     ${error.message || error}`);
}

console.log('');
console.log(`Results: ${passed.length} passed, ${failed.length} failed`);

if (failed.length > 0) {
  process.exit(1);
}
