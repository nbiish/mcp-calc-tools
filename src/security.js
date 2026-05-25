const IDENTIFIER_REGEX = /^[A-Za-z_][A-Za-z0-9_]*$/;

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
