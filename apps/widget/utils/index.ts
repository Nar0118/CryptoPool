export const isPromise = (p: any): boolean =>
  typeof p === 'object' && typeof p.then === 'function';

export const returnsPromise = (f: any): boolean =>
  f.constructor.name === 'AsyncFunction' ||
  (typeof f === 'function' && isPromise(f()));
