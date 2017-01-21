export default function makeValueType (BaseType, handler) {
  function Value (value) {
    if (!this) {
      // Value is used as converter; no context is set
      return (new Value(value)).value;
    }

    // Private value
    let _value;

    // Accessors: If handler.set is provided, don't do conversion here as it
    // should be handled by proxy
    const get = function () {
      return _value;
    };
    const set = !handler || !handler.set ? function (value) {
      _value = value === undefined ? BaseType() : BaseType(value);
    } : function (value) {
      _value = value;
    };

    Object.defineProperty(this, 'value', {get, set});

    // Either return object or proxy depending on handler
    const returnObj = handler === undefined ? this : new Proxy(this, handler);

    // Set private value, directly or through proxy, ensuring conversion
    returnObj.value = value;

    // A Value object should not be tempered with
    Object.seal(this);

    return returnObj;
  }

  // The Value container serves as a proxy for its contained value...
  function makeMethod (name) {
    return function () {
      return this.value[name](...arguments);
    };
  }

  // ... We match one to one (except for the constructor) all the methods
  // of the contained type and set the Value prototype accordingly
  Object.getOwnPropertyNames(BaseType.prototype).forEach(name => {
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

export const Bool = makeValueType(Boolean);
export const Float = makeValueType(Number);

export const Integer = makeValueType(Number, {
  set (target, key, value) {
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

export const Text = makeValueType(String, {
  get (target, key) {
    if (typeof key === 'symbol' || isNaN(key)) {
      return target[key];
    }
    // Handle read-only string[index] access
    return target.value[Number(key)];
  },
});
