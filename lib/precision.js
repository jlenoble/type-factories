'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = PrecisionType;

var _number = require('./number');

var _number2 = _interopRequireDefault(_number);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function PrecisionType() {
  var precision = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 21;

  var _value = Symbol();
  var _precision = parseInt(precision, 10);
  if (_precision < 1) {
    _precision = 1;
  } else if (_precision > 21) {
    _precision = 21;
  }

  var descriptors = {
    value: {
      get: function get() {
        return this[_value];
      },
      set: function set(value) {
        var val = parseFloat(value, 10);
        val = val.toPrecision(_precision);
        this[_value] = parseFloat(val, 10);
      }
    }
  };

  var Type = (0, _number2.default)(undefined, undefined, descriptors, _value);
  Object.defineProperty(Type, 'name', { value: 'Precision' });

  return Type;
};
module.exports = exports['default'];