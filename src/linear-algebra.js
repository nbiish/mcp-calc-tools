import * as math from 'mathjs';
import { assertMatrixShape } from './security.js';

export const matrixMultiply = (a, b) => {
  try {
    const aShape = assertMatrixShape(a, 'left matrix');
    const bShape = assertMatrixShape(b, 'right matrix');
    if (aShape.columns !== bShape.rows) {
      throw new Error('left matrix column count must equal right matrix row count');
    }
    return math.multiply(a, b);
  } catch (e) {
    throw new Error(`Matrix multiplication error: ${e.message}`);
  }
};

export const matrixInverse = (m) => {
  try {
    const shape = assertMatrixShape(m, 'matrix');
    if (shape.rows !== shape.columns) {
      throw new Error('matrix must be square');
    }
    return math.inv(m);
  } catch (e) {
    throw new Error(`Matrix inverse error: ${e.message}`);
  }
};

export const matrixDeterminant = (m) => {
  try {
    const shape = assertMatrixShape(m, 'matrix');
    if (shape.rows !== shape.columns) {
      throw new Error('matrix must be square');
    }
    return math.det(m);
  } catch (e) {
    throw new Error(`Matrix determinant error: ${e.message}`);
  }
};

export const eigenvalues = (m) => {
  try {
    const shape = assertMatrixShape(m, 'matrix');
    if (shape.rows !== shape.columns) {
      throw new Error('matrix must be square');
    }
    return math.eigs(m).values;
  } catch (e) {
    throw new Error(`Eigenvalues error: ${e.message}`);
  }
};
