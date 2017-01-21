import {defaultHandler, makeMethod} from './helpers';

export default function makeListType (Type, handler = defaultHandler) {
  // Boolean to help formatting string outputs with proper quotes
  const isString = typeof Type() === 'string';

  function List (...args) {
    if (!this) {
      // List is used as converter; no context is set
      return (new List(...args)).value;
    }

    // Private array
    const _value = [];

    // Array Proxy handler methods; we make sure any attempt to set an indexed
    // element will result in a type conversion
    const valueHandler = {
      set (target, key, value) {
        if (typeof key === 'symbol' || isNaN(key)) {
          if (key === 'length') {
            const prevLen = _value.length;
            target.length = value;
            _value.fill(Type(), prevLen);
          } else {
            target[key] = value;
          }
          target[key] = value;
        } else {
          target[Number(key)] = Type(value);
        }
        return true;
      },
    };

    // Define proxy for private array
    const valueProxy = new Proxy(_value, valueHandler);

    // Lock 'value' property accessor
    Object.defineProperty(this, 'value', {
      get () {
        return valueProxy;
      },
    });

    // Define length Accessor
    Object.defineProperty(this, 'length', {
      get () {
        return _value.length;
      },
      set (len) {
        // Use proxy to trap initialization of new elements
        this.value.length = len;
      },
    });

    // Override indexOf/lastIndexOf for _value w/o overriding Array prototype
    // when type is a Data type: we want then loose equality
    if (Type.isData) {
      Object.defineProperties(_value, {
        indexOf: {
          value: function (obj, start) {
            let idx = start !== undefined ? start : 0;
            const len = _value.length;
            for (;idx < len; idx++) {
              if (_value[idx].equiv(obj)) {
                break;
              }
            }
            return idx < len ? idx : -1;
          },
        },
        lastIndexOf: {
          value: function (obj, start) {
            let idx = start !== undefined ? start : 0;
            let last = -1;
            const len = _value.length;
            for (;idx < len; idx++) {
              if (_value[idx].equiv(obj)) {
                last = idx;
              }
            }
            return last;
          },
        },
      });
    }

    // A List object should not be tempered with
    Object.seal(this);

    // Define proxy to be returned
    const proxy = new Proxy(this, handler);

    // Set private value through proxy, ensuring conversion
    proxy.push(...args);

    return proxy;
  }

  // ... We match one to one (except for the constructor) all the methods
  // of the contained array and set the List prototype accordingly.
  // They are non writable, non enumarable, non configurable by default.
  Object.getOwnPropertyNames(Array.prototype).forEach(name => {
    if (name !== 'constructor') {
      if (typeof Array.prototype[name] === 'function') {
        switch (name) {
        case 'toString': case 'toLocaleString':
          Object.defineProperty(List.prototype, name, {
            value: isString ?
              function (...args) {
                return '["' + this.value.map(el => el[name](...args))
                  .join('", "') + '"]';
              } :
              function (...args) {
                return '[' + this.value.map(el => el[name](...args))
                  .join(', ') + ']';
              },
          });
          break;

        case 'concat':
          Object.defineProperty(List.prototype, name, {
            value: function (...args) {
              return this.value.concat(List(...[].concat(...args)));
            },
          });
          break;

        default:
          Object.defineProperty(List.prototype, name, {
            value: makeMethod(name),
          });
        }
      }
    }
  });

  // values method may be missing (January 2017: only Firefox nightly has it)
  if (!List.prototype.values) {
    Object.defineProperty(List.prototype, 'values', {
      value: function () {
        throw new ReferenceError(
          `Mirror array method 'values' left undefined due to lack of` +
          `support in your environment`);
      },
    });
  }

  // Add Symbol.iterator function
  Object.defineProperty(List.prototype, Symbol.iterator, {
    value: function () {
      return this.value[Symbol.iterator]();
    },
  });

  // Don't override default behaviors; List must always work as intended
  Object.freeze(List.prototype);

  return List;
}
