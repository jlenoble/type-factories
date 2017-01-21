'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = makeDataType;

var _value = require('./value');

function makeDataType(propTypes) {
  var _propTypes = Object.assign({}, propTypes);

  Object.keys(propTypes).forEach(function (key) {
    var Type = propTypes[key];

    switch (Type) {
      case Number:
        _propTypes[key] = _value.Float;
        break;

      case String:
        _propTypes[key] = _value.Text;
        break;

      case Boolean:
        _propTypes[key] = _value.Bool;
        break;

      default:
        var t = Type();

        if (t.value === undefined) {
          throw new Error('Type \'' + Type.name + '\' is not a Value type, nor can it be casted to one');
        }
    }
  });

  function Data() {
    var _this = this;

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    if (!this) {
      // Data is used as converter; no context is set
      return new (Function.prototype.bind.apply(Data, [null].concat(args)))();
    }

    // Initialize data with defaults
    Object.keys(_propTypes).forEach(function (key) {
      _this[key] = new _propTypes[key]();
    });

    var valueHandler = {
      get: function get(target, key) {
        if ((typeof key === 'undefined' ? 'undefined' : _typeof(key)) !== 'symbol' && !isNaN(key)) {
          key = Number(key);
        }
        var prop = target[key];
        if (prop !== undefined) {
          var value = prop.value;
          return value !== undefined ? value : target[key];
        }
      },
      set: function set(target, key, value) {
        if (key === 'value') {
          // Generic accessor to set from any object
          if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) !== 'object') {
            throw new TypeError('Setting Data as a whole from a non-object is meaningless');
          }
          Object.keys(_propTypes).forEach(function (key) {
            if (value && value[key] !== undefined) {
              target[key].value = value[key];
            }
          });
          return true;
        }
        if ((typeof key === 'undefined' ? 'undefined' : _typeof(key)) !== 'symbol' && !isNaN(key)) {
          key = Number(key);
        }
        if (value && value[key] !== undefined) {
          target[key].value = value[key];
        } else {
          target[key].value = value;
        }
        return true;
      },
      deleteProperty: function deleteProperty(target, key) {
        return false;
      }
    };

    // Define proxy for private data
    var proxy = new Proxy(this, valueHandler);

    // A Data object should not be tempered with
    Object.seal(this);

    // Set private value through proxy, ensuring conversion
    args.forEach(function (arg) {
      proxy.value = arg;
    });

    return proxy;
  }

  // Override toString, toLocaleString, valueOf.
  Object.getOwnPropertyNames(Object.prototype).forEach(function (name) {
    if (name !== 'constructor') {
      if (typeof Object.prototype[name] === 'function') {
        switch (name) {
          case 'toString':case 'toLocaleString':
            Object.defineProperty(Data.prototype, name, {
              value: function value() {
                var _this2 = this;

                for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                  args[_key2] = arguments[_key2];
                }

                return '{\n' + Object.getOwnPropertyNames(this).map(function (key) {
                  var prop = _this2[key];
                  return typeof prop === 'string' ? '  ' + key + ': \'' + prop[name].apply(prop, args) + '\'' : '  ' + key + ': ' + prop[name].apply(prop, args);
                }).join(',\n') + '\n}';
              }
            });
            break;

          default:
          // Do nothing
        }
      }
    }
  });

  // Define a helper to compare Data instances
  Object.defineProperties(Data.prototype, {
    equiv: {
      value: function value(obj) {
        var _this3 = this;

        return Object.keys(_propTypes).every(function (key) {
          return _this3[key] === obj[key];
        });
      }
    }
  });

  // Define boolean to mark this kind of type
  Object.defineProperty(Data, 'isData', {
    value: true
  });

  // Don't override default behaviors; Data must always work as intended
  Object.freeze(Data.prototype);
  Object.freeze(Data);

  return Data;
}
module.exports = exports['default'];