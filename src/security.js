const IDENTIFIER_REGEX = /^[A-Za-z_][A-Za-z0-9_]*$/;
export const MATRIX_DIMENSION_LIMIT = 100;
export const SERIES_LENGTH_LIMIT = 10000;
export const CASHFLOW_PERIOD_LIMIT = 10000;

const isPlainObject = (value) =>
  Object.prototype.toString.call(value) === '[object Object]';

export const assertSafeIdentifier = (identifier, label = 'identifier') => {
  if (typeof identifier !== 'string' || !IDENTIFIER_REGEX.test(identifier)) {
    throw new Error(`${label} must be a safe identifier`);
  }

  return identifier;
};

export const escapeRegExp = (value) =>
  String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const createSafeScope = (entries = {}) => {
  const scope = new Map();

  for (const [key, value] of Object.entries(entries)) {
    scope.set(key, cloneSafeValue(value));
  }

  return scope;
};

export const assertFiniteNumber = (value, label = 'value') => {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error(`${label} must be a finite number`);
  }

  return value;
};

export const assertMatrixShape = (matrix, label = 'matrix', maxDimension = MATRIX_DIMENSION_LIMIT) => {
  if (!Array.isArray(matrix) || matrix.length === 0 || matrix.length > maxDimension) {
    throw new Error(`${label} must be a non-empty matrix with at most ${maxDimension} rows`);
  }

  let columnCount = null;

  for (const row of matrix) {
    if (!Array.isArray(row) || row.length === 0 || row.length > maxDimension) {
      throw new Error(`${label} must be a rectangular matrix with at most ${maxDimension} columns`);
    }

    if (columnCount === null) {
      columnCount = row.length;
    } else if (row.length !== columnCount) {
      throw new Error(`${label} must be rectangular`);
    }

    for (const value of row) {
      assertFiniteNumber(value, `${label} entry`);
    }
  }

  return { rows: matrix.length, columns: columnCount };
};

export const assertLengthWithinLimit = (values, label, maxLength = SERIES_LENGTH_LIMIT) => {
  if (!Array.isArray(values)) {
    throw new Error(`${label} must be an array`);
  }

  if (values.length > maxLength) {
    throw new Error(`${label} must contain at most ${maxLength} values`);
  }

  return values;
};

export const cloneSafeValue = (value) => {
  if (Array.isArray(value)) {
    return value.map(cloneSafeValue);
  }

  if (isPlainObject(value)) {
    const clone = {};

    for (const [key, entry] of Object.entries(value)) {
      clone[key] = cloneSafeValue(entry);
    }

    return clone;
  }

  return value;
};
