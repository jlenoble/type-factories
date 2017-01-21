'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = makeValueType;
function makeValueType(BaseType, handler) {
  function Value(value) {
    if (!this) {
      // Value is used as converter; no context is set
      return new Value(value).value;
    }

    // Private value
    var _value = void 0;

    // Accessors: If handler.set is provided, don't do conversion here as it
    // should be handled by proxy
    var get = function get() {
      return _value;
    };
    var set = !handler || !handler.set ? function (value) {
      _value = value === undefined ? BaseType() : BaseType(value);
    } : function (value) {
      _value = value;
    };

    Object.defineProperty(this, 'value', { get: get, set: set });

    // Either return object or proxy depending on handler
    var returnObj = handler === undefined ? this : new Proxy(this, handler);

    // Set private value, directly or through proxy, ensuring conversion
    returnObj.value = value;

    // A Value object should not be tempered with
    Object.seal(this);

    return returnObj;
  }

  // The Value container serves as a proxy for its contained value...
  function makeMethod(name) {
    return function () {
      var _value2;

      return (_value2 = this.value)[name].apply(_value2, arguments);
    };
  }

  // ... We match one to one (except for the constructor) all the methods
  // of the contained type and set the Value prototype accordingly
  Object.getOwnPropertyNames(BaseType.prototype).forEach(function (name) {
    if (name !== 'constructor') {
      if (typeof BaseType.prototype[name] === 'function') {
        Value.prototype[name] = makeMethod(name);
      }
    }
  });

  // Don't override default behaviors; the type must always work as intended
  Object.freeze(Value.prototype);

  return Value;
}

var Bool = exports.Bool = makeValueType(Boolean);
var Float = exports.Float = makeValueType(Number);

var Integer = exports.Integer = makeValueType(Number, {
  set: function set(target, key, value) {
    if (key === 'value') {
      // Always convert to integer
      target.value = value === undefined ? 0 : Math.trunc(Number(value));
    } else {
      // We rely on the above seal in Value ctor to throw a meaningful error
      // when attempting to set any other property than value
      target[key] = value;
    }
    return true;
  }
});

var Text = exports.Text = makeValueType(String, {
  get: function get(target, key) {
    if ((typeof key === 'undefined' ? 'undefined' : _typeof(key)) === 'symbol' || isNaN(key)) {
      return target[key];
    }
    // Handle read-only string[index] access
    return target.value[Number(key)];
  }
});