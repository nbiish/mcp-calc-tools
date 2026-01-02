import * as math from 'mathjs';

export const normalDistribution = (x, mu = 0, sigma = 1) => {
  try {
    const exponent = -Math.pow(x - mu, 2) / (2 * Math.pow(sigma, 2));
    const coefficient = 1 / (sigma * Math.sqrt(2 * Math.PI));
    return coefficient * Math.exp(exponent);
  } catch (e) {
    throw new Error(`Normal distribution error: ${e.message}`);
  }
};

export const binomialDistribution = (k, n, p) => {
  if (k < 0 || k > n) return 0;
  try {
    const combinations = math.combinations(n, k);
    return combinations * Math.pow(p, k) * Math.pow(1 - p, n - k);
  } catch (e) {
    throw new Error(`Binomial distribution error: ${e.message}`);
  }
};

export const poissonDistribution = (k, lambda) => {
  if (k < 0) return 0;
  try {
    return (Math.pow(lambda, k) * Math.exp(-lambda)) / math.factorial(k);
  } catch (e) {
    throw new Error(`Poisson distribution error: ${e.message}`);
  }
};

