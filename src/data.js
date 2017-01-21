import {Float, Text, Bool} from './value';

export default function makeDataType (propTypes) {
  const _propTypes = Object.assign({}, propTypes);

  Object.keys(propTypes).forEach(key => {
    const Type = propTypes[key];

    switch (Type) {
    case Number:
      _propTypes[key] = Float;
      break;

    case String:
      _propTypes[key] = Text;
      break;

    case Boolean:
      _propTypes[key] = Bool;
      break;

    default:
      const t = Type();

      if (t.value === undefined) {
        throw new Error(`Type '${
          Type.name}' is not a Value type, nor can it be casted to one`);
      }
    }
  });

  function Data (...args) {
    // Initialize data with defaults
    Object.keys(_propTypes).forEach(key => {
      this[key] = new _propTypes[key]();
    });

    const valueHandler = {
      get (target, key) {
        if (typeof key !== 'symbol' && !isNaN(key)) {
          key = Number(key);
        }
        const prop = target[key];
        if (prop !== undefined) {
          const value = prop.value;
          return value !== undefined ? value : target[key];
        }
      },
      set (target, key, value) {
        if (key === 'value') { // Generic accessor to set from any object
          Object.keys(_propTypes).forEach(key => {
            if (key in value) {
              target[key].value = value[key];
            }
          });
          return true;
        }
        if (typeof key !== 'symbol' && !isNaN(key)) {
          key = Number(key);
        }
        target[key].value = value;
        return true;
      },
      deleteProperty (target, key) {
        return false;
      }
    };

    // Define proxy for private data
    const proxy = new Proxy(this, valueHandler);

    // A Data object should not be tempered with
    Object.seal(this);

    // Set private value through proxy, ensuring conversion
    args.forEach(arg => {
      proxy.value = arg;
    });

    return proxy;
  }

  // Override toString, toLocaleString, valueOf.
  Object.getOwnPropertyNames(Object.prototype).forEach(name => {
    if (name !== 'constructor') {
      if (typeof Object.prototype[name] === 'function') {
        switch (name) {
        case 'toString': case 'toLocaleString':
          Object.defineProperty(Data.prototype, name, {
            value: function () {
                return '{\n' + Object.getOwnPropertyNames(this)
                .map(key => {
                  const prop = this[key];
                  return typeof prop === 'string' ? `  ${key}: '${prop[name](
                    ...arguments)}'` : `  ${key}: ${prop[name](...arguments)}`;
                }).join(',\n') + '\n}';
              },
            });
          break;

        default:
          // Do nothing
        }
      }
    }
  });

  // Don't override default behaviors; Data must always work as intended
  Object.freeze(Data.prototype);

  return Data;
}
