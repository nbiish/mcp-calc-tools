import * as math from 'mathjs';

// Normal distribution approximation functions
export const normalCDF = (x) => {
  const t = 1 / (1 + 0.2316419 * Math.abs(x));
  const d = 0.3989423 * Math.exp(-x * x / 2);
  const p = d * t * (0.319381530 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
  return x >= 0 ? 1 - p : p;
};

export const normalPDF = (x) => {
  return (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * x * x);
};

export const blackScholes = (S, K, T, r, sigma, optionType = 'call') => {
  try {
    const d1 = (Math.log(S / K) + (r + 0.5 * sigma * sigma) * T) / (sigma * Math.sqrt(T));
    const d2 = d1 - sigma * Math.sqrt(T);

    if (optionType === 'call') {
      return S * normalCDF(d1) - K * Math.exp(-r * T) * normalCDF(d2);
    } else if (optionType === 'put') {
      return K * Math.exp(-r * T) * normalCDF(-d2) - S * normalCDF(-d1);
    } else {
      throw new Error('Invalid option type. Must be "call" or "put".');
    }
  } catch (e) {
    return `Error: ${e.message}`;
  }
};

export const optionGreeks = (S, K, T, r, sigma, optionType = 'call') => {
  try {
    const d1 = (Math.log(S / K) + (r + 0.5 * sigma * sigma) * T) / (sigma * Math.sqrt(T));
    const d2 = d1 - sigma * Math.sqrt(T);

    let delta, gamma, vega, theta, rho;

    if (optionType === 'call') {
      delta = normalCDF(d1);
      gamma = normalPDF(d1) / (S * sigma * Math.sqrt(T));
      vega = S * normalPDF(d1) * Math.sqrt(T);
      theta = -(S * normalPDF(d1) * sigma) / (2 * Math.sqrt(T)) - 
              r * K * Math.exp(-r * T) * normalCDF(d2);
      rho = K * T * Math.exp(-r * T) * normalCDF(d2);
    } else if (optionType === 'put') {
      delta = normalCDF(d1) - 1;
      gamma = normalPDF(d1) / (S * sigma * Math.sqrt(T));
      vega = S * normalPDF(d1) * Math.sqrt(T);
      theta = -(S * normalPDF(d1) * sigma) / (2 * Math.sqrt(T)) + 
              r * K * Math.exp(-r * T) * normalCDF(-d2);
      rho = -K * T * Math.exp(-r * T) * normalCDF(-d2);
    } else {
      throw new Error('Invalid option type. Must be "call" or "put".');
    }

    return { delta, gamma, vega, theta, rho };
  } catch (e) {
    return `Error: ${e.message}`;
  }
};
