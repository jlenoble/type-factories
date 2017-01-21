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

export const Float = makeValueType(Number);
