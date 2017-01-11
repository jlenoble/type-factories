'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = ValueType;

var _root = require('./root');

var _root2 = _interopRequireDefault(_root);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ValueType(prototype, descriptors, symbol) {
  var _value = (typeof symbol === 'undefined' ? 'undefined' : _typeof(symbol)) === 'symbol' ? symbol : Symbol();

  var _descriptors = Object.assign({}, {
    value: {
      get: function get() {
        return this[_value];
      },
      set: function set(value) {
        this[_value] = value;
      }
    }
  }, descriptors);

  return (0, _root2.default)(prototype, _descriptors);
}
module.exports = exports['default'];