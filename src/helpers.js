// Proxy handler methods for List itself
const defaultHandler = {
  has (target, key) {
    if (typeof key === 'symbol' || isNaN(key)) {
      return key in target;
    }
    // Handle array[index] access
    return Number(key) in target.value;
  },
  get (target, key) {
    if (key === 'name') {
      throw new Error(key);
    }
    if (typeof key === 'symbol' || isNaN(key)) {
      return target[key];
    }
    // Handle array[index] access
    return target.value[Number(key)];
  },
  set (target, key, value) {
    if (key === 'name') {
      throw new Error(key);
    }
    if (typeof key === 'symbol' || isNaN(key)) {
      // We rely on a seal to throw a meaningful error when
      // attempting to set any other property than an index
      target[key] = value;
    } else {
      target.value[Number(key)] = value;
    }
    return true;
  },
  enumerate (target) {
    // May not work any more as enumerate was removed from specs (Jan2017)
    return Object.keys(target.value)[Symbol.iterator]();
  }
};

// The container serves as a proxy for its contained array...
function makeMethod (name) {
  return function () {
    return this.value[name](...arguments);
  };
}

export {defaultHandler, makeMethod};
