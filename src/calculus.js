import * as math from 'mathjs';
import { assertSafeIdentifier, createSafeScope, escapeRegExp } from './security.js';

export const derivative = (expr, variable = 'x') => {
  try {
    assertSafeIdentifier(variable, 'variable');
    const node = math.parse(expr);
    const derivativeExpr = math.derivative(node, variable);
    return derivativeExpr.toString();
  } catch (e) {
    throw new Error(`Derivative error: ${e.message}`);
  }
};

export const integral = (expr, variable = 'x') => {
  try {
    assertSafeIdentifier(variable, 'variable');
    const v = variable;
    const e = escapeRegExp;

    // --- Polynomial patterns: a*x^n + b*x + c ---

    // Pure power: x^n
    const powerMatch = expr.match(new RegExp(`^${e(v)}\\^(\\d+)$`));
    if (powerMatch) {
      const n = parseInt(powerMatch[1]);
      return `${v}^${n + 1}/${n + 1}`;
    }

    // Coefficient * power: c*x^n
    const coeffPower = expr.match(new RegExp(`^([+-]?\\d*\\.?\\d*)\\s*\\*?\\s*${e(v)}\\^(\\d+)$`));
    if (coeffPower) {
      const c = coeffPower[1] === '' || coeffPower[1] === '+' ? 1 : coeffPower[1] === '-' ? -1 : parseFloat(coeffPower[1]);
      const n = parseInt(coeffPower[2]);
      const newCoeff = c / (n + 1);
      return `${stripTrailingZeros(newCoeff)} * ${v}^${n + 1}`;
    }

    // Linear: c*x or just x
    const linearMatch = expr.match(new RegExp(`^([+-]?\\d*\\.?\\d*)\\s*\\*?\\s*${e(v)}$`));
    if (linearMatch) {
      const c = linearMatch[1] === '' || linearMatch[1] === '+' ? 1 : linearMatch[1] === '-' ? -1 : parseFloat(linearMatch[1]);
      return `${stripTrailingZeros(c / 2)} * ${v}^2`;
    }

    // Constant: c
    if (/^[+-]?\d+(\.\d+)?$/.test(expr.trim())) {
      return `${expr.trim()} * ${v}`;
    }

    // --- Exponential patterns ---

    // e^(a*x) -> (1/a) * e^(a*x)
    const expLinear = expr.match(new RegExp(`^e\\^\\(\\s*([+-]?\\d*\\.?\\d*)\\s*\\*?\\s*${e(v)}\\s*\\)$`));
    if (expLinear) {
      const a = expLinear[1] === '' || expLinear[1] === '+' ? 1 : expLinear[1] === '-' ? -1 : parseFloat(expLinear[1]);
      return `${stripTrailingZeros(1 / a)} * e^(${stripTrailingZeros(a)} * ${v})`;
    }

    // e^x
    if (expr === 'e^x' && v === 'x') return 'e^x';
    const expVar = expr.match(new RegExp(`^e\\^${e(v)}$`));
    if (expVar) return `e^${v}`;

    // e^(c*x)
    const expCoeff = expr.match(new RegExp(`^e\\^\\(\\s*([+-]?\\d+\\.?\\d*)\\s*\\*\\s*${e(v)}\\s*\\)$`));
    if (expCoeff) {
      const c = parseFloat(expCoeff[1]);
      return `${stripTrailingZeros(1 / c)} * e^(${stripTrailingZeros(c)} * ${v})`;
    }

    // --- Trigonometric patterns ---

    // sin(a*x) -> -(1/a)*cos(a*x)
    const sinLinear = expr.match(new RegExp(`^sin\\(\\s*([+-]?\\d*\\.?\\d*)\\s*\\*?\\s*${e(v)}\\s*\\)$`));
    if (sinLinear) {
      const a = sinLinear[1] === '' || sinLinear[1] === '+' ? 1 : sinLinear[1] === '-' ? -1 : parseFloat(sinLinear[1]);
      return `${stripTrailingZeros(-1 / a)} * cos(${stripTrailingZeros(a)} * ${v})`;
    }

    // cos(a*x) -> (1/a)*sin(a*x)
    const cosLinear = expr.match(new RegExp(`^cos\\(\\s*([+-]?\\d*\\.?\\d*)\\s*\\*?\\s*${e(v)}\\s*\\)$`));
    if (cosLinear) {
      const a = cosLinear[1] === '' || cosLinear[1] === '+' ? 1 : cosLinear[1] === '-' ? -1 : parseFloat(cosLinear[1]);
      return `${stripTrailingZeros(1 / a)} * sin(${stripTrailingZeros(a)} * ${v})`;
    }

    // tan(a*x) -> -(1/a)*ln|cos(a*x)|
    const tanLinear = expr.match(new RegExp(`^tan\\(\\s*([+-]?\\d*\\.?\\d*)\\s*\\*?\\s*${e(v)}\\s*\\)$`));
    if (tanLinear) {
      const a = tanLinear[1] === '' || tanLinear[1] === '+' ? 1 : tanLinear[1] === '-' ? -1 : parseFloat(tanLinear[1]);
      return `${stripTrailingZeros(-1 / a)} * ln|cos(${stripTrailingZeros(a)} * ${v})|`;
    }

    // --- Inverse trigonometric ---

    // 1/sqrt(1 - x^2) -> asin(x)  (u-substitution pattern)
    if (expr === `1/sqrt(1 - ${v}^2)` || expr === `1 / sqrt(1 - ${v}^2)`) {
      return `asin(${v})`;
    }

    // 1/(1 + x^2) -> atan(x)
    if (expr === `1/(1 + ${v}^2)` || expr === `1 / (1 + ${v}^2)`) {
      return `atan(${v})`;
    }

    // --- Logarithmic ---

    // 1/x -> ln|x|
    const reciprocal = expr.match(new RegExp(`^1\\s*/\\s*${e(v)}$`));
    if (reciprocal) return `ln|${v}|`;

    // 1/(a*x) -> (1/a)*ln|x|
    const reciprocalCoeff = expr.match(new RegExp(`^1\\s*/\\s*\\(\\s*([+-]?\\d*\\.?\\d*)\\s*\\*?\\s*${e(v)}\\s*\\)$`));
    if (reciprocalCoeff) {
      const a = reciprocalCoeff[1] === '' || reciprocalCoeff[1] === '+' ? 1 : reciprocalCoeff[1] === '-' ? -1 : parseFloat(reciprocalCoeff[1]);
      return `${stripTrailingZeros(1 / a)} * ln|${v}|`;
    }

    // --- U-substitution: f(g(x)) * g'(x) patterns ---

    // e^(x^n) * x^(n-1) -> (1/n) * e^(x^n)
    const uSubExp = expr.match(new RegExp(
      `^e\\^\\(\\s*${e(v)}\\^(\\d+)\\s*\\)\\s*\\*\\s*${e(v)}$`
    ));
    if (uSubExp) {
      const outerExp = parseInt(uSubExp[1]);
      return `${stripTrailingZeros(1 / outerExp)} * e^(${v}^${outerExp})`;
    }

    // Also match e^(x^2) * x (power = 1 implied)
    const uSubExp2 = expr.match(new RegExp(
      `^e\\^\\(\\s*${e(v)}\\^(\\d+)\\s*\\)\\s*\\*\\s*${e(v)}\\^(\\d+)$`
    ));
    if (uSubExp2) {
      const outerExp = parseInt(uSubExp2[1]);
      const innerExp = parseInt(uSubExp2[2]);
      if (innerExp === outerExp - 1) {
        return `${stripTrailingZeros(1 / outerExp)} * e^(${v}^${outerExp})`;
      }
    }

    // x^(n-1) * sin(x^n) or cos(x^n) — u-sub for composition
    // sin(x^2) * x -> -(1/2)*cos(x^2)
    const sinComp = expr.match(new RegExp(
      `^sin\\(\\s*${e(v)}\\^(\\d+)\\s*\\)\\s*\\*\\s*${e(v)}$`
    ));
    if (sinComp) {
      const n = parseInt(sinComp[1]);
      return `${stripTrailingZeros(-1 / n)} * cos(${v}^${n})`;
    }

    // cos(x^2) * x -> (1/2)*sin(x^2)
    const cosComp = expr.match(new RegExp(
      `^cos\\(\\s*${e(v)}\\^(\\d+)\\s*\\)\\s*\\*\\s*${e(v)}$`
    ));
    if (cosComp) {
      const n = parseInt(cosComp[1]);
      return `${stripTrailingZeros(1 / n)} * sin(${v}^${n})`;
    }

    // --- Integration by parts: x^n * f(x) ---

    // x * sin(x) -> sin(x) - x*cos(x)
    if (expr === `${v} * sin(${v})`) return `sin(${v}) - ${v} * cos(${v})`;
    if (expr === `sin(${v}) * ${v}`) return `sin(${v}) - ${v} * cos(${v})`;

    // x * cos(x) -> cos(x) + x*sin(x)
    if (expr === `${v} * cos(${v})`) return `cos(${v}) + ${v} * sin(${v})`;
    if (expr === `cos(${v}) * ${v}`) return `cos(${v}) + ${v} * sin(${v})`;

    // x * e^x -> e^x * (x - 1)
    if (expr === `${v} * e^${v}` || expr === `e^${v} * ${v}`) return `e^${v} * (${v} - 1)`;

    // x^2 * sin(x) -> 2*x*sin(x) - (x^2 - 2)*cos(x)
    if (expr === `${v}^2 * sin(${v})` || expr === `sin(${v}) * ${v}^2`) {
      return `2 * ${v} * sin(${v}) - (${v}^2 - 2) * cos(${v})`;
    }

    // x^2 * cos(x) -> 2*x*cos(x) + (x^2 - 2)*sin(x)
    if (expr === `${v}^2 * cos(${v})` || expr === `cos(${v}) * ${v}^2`) {
      return `2 * ${v} * cos(${v}) + (${v}^2 - 2) * sin(${v})`;
    }

    // ln(x) -> x*ln(x) - x
    if (expr === `ln(${v})`) return `${v} * ln(${v}) - ${v}`;

    // x * ln(x) -> (x^2/2)*ln(x) - x^2/4
    if (expr === `${v} * ln(${v})` || expr === `ln(${v}) * ${v}`) {
      return `${v}^2/2 * ln(${v}) - ${v}^2/4`;
    }

    return 'Cannot compute integral symbolically for this expression';
  } catch (e) {
    throw new Error(`Integral error: ${e.message}`);
  }
};

/** Strip unnecessary trailing zeros from a number string: 0.5 -> "0.5", 1.0 -> "1" */
const stripTrailingZeros = (n) => {
  const s = Number(n).toFixed(10);
  return parseFloat(s).toString();
};

export const riemannSum = (expr, variable, a, b, n, method = 'midpoint') => {
  try {
    assertSafeIdentifier(variable, 'variable');
    if (n <= 0) throw new Error('n must be positive');
    if (n > 100000) throw new Error('n too large for safety');

    const deltaX = (b - a) / n;
    let sum = 0;
    const node = math.parse(expr);
    const scope = createSafeScope();
    
    if (method === 'left' || method === 'right') {
      const offset = method === 'right' ? 1 : 0;
      for (let i = 0; i < n; i++) {
        const x = a + (i + offset) * deltaX;
        scope.set(variable, x);
        sum += node.evaluate(scope) * deltaX;
      }
    } else if (method === 'midpoint') {
      for (let i = 0; i < n; i++) {
        const x = a + (i + 0.5) * deltaX;
        scope.set(variable, x);
        sum += node.evaluate(scope) * deltaX;
      }
    } else if (method === 'trapezoid') {
      for (let i = 0; i <= n; i++) {
        const x = a + i * deltaX;
        scope.set(variable, x);
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
  try {
    assertSafeIdentifier(variable, 'variable');
    if (n <= 0) throw new Error('n must be positive');
    if (n > 100000) throw new Error('n too large for safety');

    const deltaX = (b - a) / n;
    let sum = 0;
    const node = math.parse(expr);
    const scope = createSafeScope();

    for (let i = 0; i < n; i++) {
      const x1 = a + i * deltaX;
      const x2 = x1 + deltaX;
      scope.set(variable, x1);
      const y1 = node.evaluate(scope);
      scope.set(variable, x2);
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
    assertSafeIdentifier(variable, 'variable');
    const node = math.parse(expr);
    const scope = createSafeScope();
    const epsilon = 1e-10;
    
    // Evaluate near the approach point
    scope.set(variable, approach + epsilon);
    const rightLimit = node.evaluate(scope);
    
    scope.set(variable, approach - epsilon);
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
