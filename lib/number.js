'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = NumberType;

var _value2 = require('./value');

var _value3 = _interopRequireDefault(_value2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function NumberType(parseFunc) {
  var _value = Symbol();

  var descriptors = {
    value: {
      get: function get() {
        return this[_value];
      },
      set: function set(value) {
        this[_value] = parseFunc(value, 10);
      }
    }
  };

  return (0, _value3.default)(undefined, descriptors, _value);
};
module.exports = exports['default'];