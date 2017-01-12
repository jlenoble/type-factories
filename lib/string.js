'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Text = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = StringType;

var _value2 = require('./value');

var _value3 = _interopRequireDefault(_value2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function StringType(prototype, descriptors, symbol) {
  var _value = (typeof symbol === 'undefined' ? 'undefined' : _typeof(symbol)) === 'symbol' ? symbol : Symbol();

  var _prototype = Object.assign({}, prototype);

  var _descriptors = Object.assign({
    value: {
      get: function get() {
        return this[_value];
      },
      set: function set(value) {
        this[_value] = '' + value;
      }
    }
  }, descriptors);

  var Type = (0, _value3.default)(_prototype, _descriptors, _value);
  Object.defineProperty(Type, 'name', { value: 'String (derived from Value)' });

  return Type;
};

var Text = exports.Text = StringType();
Object.defineProperty(Text, 'name', { value: 'Text' });