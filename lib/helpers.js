'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

// Proxy handler methods for List itself
var defaultHandler = {
  has: function has(target, key) {
    if ((typeof key === 'undefined' ? 'undefined' : _typeof(key)) === 'symbol' || isNaN(key)) {
      return key in target;
    }
    // Handle array[index] access
    return Number(key) in target.value;
  },
  get: function get(target, key) {
    if (key === 'name') {
      throw new Error(key);
    }
    if ((typeof key === 'undefined' ? 'undefined' : _typeof(key)) === 'symbol' || isNaN(key)) {
      return target[key];
    }
    // Handle array[index] access
    return target.value[Number(key)];
  },
  set: function set(target, key, value) {
    if (key === 'name') {
      throw new Error(key);
    }
    if ((typeof key === 'undefined' ? 'undefined' : _typeof(key)) === 'symbol' || isNaN(key)) {
      // We rely on a seal to throw a meaningful error when
      // attempting to set any other property than an index
      target[key] = value;
    } else {
      target.value[Number(key)] = value;
    }
    return true;
  },
  enumerate: function enumerate(target) {
    // May not work any more as enumerate was removed from specs (Jan2017)
    return Object.keys(target.value)[Symbol.iterator]();
  }
};

// The container serves as a proxy for its contained array...
function makeMethod(name) {
  return function () {
    var _value;

    return (_value = this.value)[name].apply(_value, arguments);
  };
}

exports.defaultHandler = defaultHandler;
exports.makeMethod = makeMethod;