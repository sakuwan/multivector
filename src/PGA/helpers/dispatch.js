export const entry = (...args) => {
  const [arg0] = args;
  const entryCount = args.length;
  if (entryCount <= 1 && typeof arg0 !== 'function') {
    throw new TypeError('Single argument entries must be default functions');
  }

  if (entryCount === 1 && typeof arg0 === 'function') return { fn: arg0 };

  return {
    args: args.slice(0, entryCount - 1),
    fn: args[entryCount - 1],
  };
};

export const dispatch = (handler, ...entries) => {
  if (typeof handler !== 'function') throw new TypeError('dispatch handler must be a function');

  const entryCount = entries.length;
  if (!entryCount) throw new TypeError('dispatch requires at least a single entry');

  const expandKeys = (a, c) => {

  };

  const makeDispatchMap = (a, c) => {
    const { args, fn } = c;
    if (!args && fn) Object.defineProperty(a, '__default', { value: fn });

    return Object.assign(a, args.reduce(expandKeys, Object.create(null)));
  };

  const dispatchMap = entries.reduce(makeDispatchMap, Object.create(null));
};
