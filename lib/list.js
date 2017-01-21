'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = makeListType;

var _helpers = require('./helpers');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function makeListType(Type) {
  var handler = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _helpers.defaultHandler;

  // Boolean to help formatting string outputs with proper quotes
  var isString = typeof Type() === 'string';

  function List() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    if (!this) {
      // List is used as converter; no context is set
      return new (Function.prototype.bind.apply(List, [null].concat(args)))().value;
    }

    // Private array
    var _value = [];

    // Array Proxy handler methods; we make sure any attempt to set an indexed
    // element will result in a type conversion
    var valueHandler = {
      set: function set(target, key, value) {
        if ((typeof key === 'undefined' ? 'undefined' : _typeof(key)) === 'symbol' || isNaN(key)) {
          if (key === 'length') {
            var prevLen = _value.length;
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
      }
    };

    // Define proxy for private array
    var valueProxy = new Proxy(_value, valueHandler);

    // Lock 'value' property accessor
    Object.defineProperty(this, 'value', {
      get: function get() {
        return valueProxy;
      }
    });

    // Define length Accessor
    Object.defineProperty(this, 'length', {
      get: function get() {
        return _value.length;
      },
      set: function set(len) {
        // Use proxy to trap initialization of new elements
        this.value.length = len;
      }
    });

    // Override indexOf/lastIndexOf for _value w/o overriding Array prototype
    // when type is a Data type: we want then loose equality
    if (Type.isData) {
      Object.defineProperties(_value, {
        indexOf: {
          value: function value(obj, start) {
            var idx = start !== undefined ? start : 0;
            var len = _value.length;
            for (; idx < len; idx++) {
              if (_value[idx].equiv(obj)) {
                break;
              }
            }
            return idx < len ? idx : -1;
          }
        },
        lastIndexOf: {
          value: function value(obj, start) {
            var idx = start !== undefined ? start : 0;
            var last = -1;
            var len = _value.length;
            for (; idx < len; idx++) {
              if (_value[idx].equiv(obj)) {
                last = idx;
              }
            }
            return last;
          }
        }
      });
    }

    // A List object should not be tempered with
    Object.seal(this);

    // Define proxy to be returned
    var proxy = new Proxy(this, handler);

    // Set private value through proxy, ensuring conversion
    proxy.push.apply(proxy, args);

    return proxy;
  }

  // ... We match one to one (except for the constructor) all the methods
  // of the contained array and set the List prototype accordingly.
  // They are non writable, non enumarable, non configurable by default.
  Object.getOwnPropertyNames(Array.prototype).forEach(function (name) {
    if (name !== 'constructor') {
      if (typeof Array.prototype[name] === 'function') {
        switch (name) {
          case 'toString':case 'toLocaleString':
            Object.defineProperty(List.prototype, name, {
              value: isString ? function () {
                for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                  args[_key2] = arguments[_key2];
                }

                return '["' + this.value.map(function (el) {
                  return el[name].apply(el, args);
                }).join('", "') + '"]';
              } : function () {
                for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                  args[_key3] = arguments[_key3];
                }

                return '[' + this.value.map(function (el) {
                  return el[name].apply(el, args);
                }).join(', ') + ']';
              }
            });
            break;

          case 'concat':
            Object.defineProperty(List.prototype, name, {
              value: function value() {
                var _ref;

                return this.value.concat(List.apply(undefined, _toConsumableArray((_ref = []).concat.apply(_ref, arguments))));
              }
            });
            break;

          default:
            Object.defineProperty(List.prototype, name, {
              value: (0, _helpers.makeMethod)(name)
            });
        }
      }
    }
  });

  // values method may be missing (January 2017: only Firefox nightly has it)
  if (!List.prototype.values) {
    Object.defineProperty(List.prototype, 'values', {
      value: function value() {
        throw new ReferenceError('Mirror array method \'values\' left undefined due to lack of' + 'support in your environment');
      }
    });
  }

  // Add Symbol.iterator function
  Object.defineProperty(List.prototype, Symbol.iterator, {
    value: function value() {
      return this.value[Symbol.iterator]();
    }
  });

  // Don't override default behaviors; List must always work as intended
  Object.freeze(List.prototype);

  return List;
}
module.exports = exports['default'];