import * as math from 'mathjs';

export const matrixMultiply = (a, b) => {
  try {
    return math.multiply(a, b);
  } catch (e) {
    throw new Error(`Matrix multiplication error: ${e.message}`);
  }
};

export const matrixInverse = (m) => {
  try {
    return math.inv(m);
  } catch (e) {
    throw new Error(`Matrix inverse error: ${e.message}`);
  }
};

export const matrixDeterminant = (m) => {
  try {
    return math.det(m);
  } catch (e) {
    throw new Error(`Matrix determinant error: ${e.message}`);
  }
};

export const eigenvalues = (m) => {
  try {
    return math.eigs(m).values;
  } catch (e) {
    throw new Error(`Eigenvalues error: ${e.message}`);
  }
};

