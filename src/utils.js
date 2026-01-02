import * as math from 'mathjs';

export const volumeOfRevolution = (expression, start, end, steps = 1000) => {
  if (steps <= 0) throw new Error('Steps must be positive');
  if (steps > 100000) throw new Error('Steps too large for safety');
  
  try {
    const dx = (end - start) / steps;
    let volume = 0;
    const node = math.parse(expression);
    
    for (let i = 0; i < steps; i++) {
      const x = start + i * dx;
      const scope = { x };
      const y = node.evaluate(scope);
      volume += Math.PI * y * y * dx;
    }
    
    return volume;
  } catch (e) {
    throw new Error(`Volume error: ${e.message}`);
  }
};

export const compoundInterest = (principal, rate, time, compounds = 12) => {
  if (principal < 0 || rate < 0 || time < 0 || compounds <= 0) {
    throw new Error('Principal, rate, time must be non-negative and compounds must be positive');
  }
  return principal * Math.pow(1 + rate/compounds, compounds * time);
};

export const presentValue = (futureValue, rate, time) => {
  if (time < 0) throw new Error('Time must be non-negative');
  return futureValue / Math.pow(1 + rate, time);
};

export const npv = (cashFlows, rate) => {
  return cashFlows.reduce((npv, cf, t) => 
    npv + cf / Math.pow(1 + rate, t), 0);
};

