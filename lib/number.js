'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Integer = exports.Float = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = NumberType;

var _value2 = require('./value');

var _value3 = _interopRequireDefault(_value2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function NumberType(parseFunc, prototype, descriptors, symbol) {
  var _value = (typeof symbol === 'undefined' ? 'undefined' : _typeof(symbol)) === 'symbol' ? symbol : Symbol();

  var _prototype = Object.assign({
    toExponential: function toExponential(fractionDigits) {
      return this[_value].toExponential(fractionDigits);
    },
    toFixed: function toFixed(digits) {
      return this[_value].toFixed(digits);
    },
    toPrecision: function toPrecision(precision) {
      return this[_value].toPrecision(precision);
    }
  }, prototype);

  var _descriptors = Object.assign({
    value: {
      get: function get() {
        return this[_value];
      },
      set: function set(value) {
        this[_value] = parseFunc(value, 10);
      }
    }
  }, descriptors);

  var Type = (0, _value3.default)(_prototype, _descriptors, _value);
  Object.defineProperty(Type, 'name', { value: 'Number (derived from Value)' });

  return Type;
};

var Float = exports.Float = NumberType(parseFloat);
Object.defineProperty(Float, 'name', { value: 'Float' });

var Integer = exports.Integer = NumberType(parseInt);
Object.defineProperty(Integer, 'name', { value: 'Integer' });