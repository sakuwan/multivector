import extendProps from './object';
import UnsupportedError from './error/UnsupportedError';

export const entry = (...args) => {
  const entryCount = args.length - 1;
  if (entryCount < 1 || typeof args[entryCount] !== 'function') {
    throw new TypeError('Entries must have at least one argument and a single method');
  }

  return args;
};

export const dispatch = (singleArgument, defaultFn, ...entries) => {
  if (!entries.length) throw new TypeError('dispatch requires at least a single entry');

  const makeDispatchMap = (a, c) => extendProps(c, a);
  const dispatchMap = entries.reduce(makeDispatchMap, Object.create(null));
  return singleArgument
    ? ({ buffer, elementType }) => {
      if (elementType === undefined) throw new UnsupportedError();

      return (elementType in dispatchMap)
        ? dispatchMap[elementType](buffer)
        : defaultFn(elementType);
    }
    : (a, b) => {
      const lhsType = a.elementType;
      const rhsType = b.elementType;
      if (lhsType === undefined || rhsType === undefined) throw new UnsupportedError();

      return (lhsType in dispatchMap && rhsType in dispatchMap[lhsType])
        ? dispatchMap[lhsType][rhsType](a.buffer, b.buffer)
        : defaultFn(lhsType, rhsType);
    };
};
