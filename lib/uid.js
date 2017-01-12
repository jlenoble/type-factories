'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = UIDType;

var _value2 = require('./value');

var _value3 = _interopRequireDefault(_value2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function UIDType(prefix) {
  var _prefix = typeof prefix === 'string' ? prefix : 0;

  var _value = Symbol();
  var _uid = 0;

  var prototype = {
    initialize: function initialize() {
      this[_value] = _prefix + ++_uid;
    }
  };

  var descriptors = {
    value: {
      get: function get() {
        return this[_value];
      }
    }
  };

  var Type = (0, _value3.default)(prototype, descriptors, _value);
  Object.defineProperty(Type, 'name', { value: 'UID' });

  return Type;
};
module.exports = exports['default'];