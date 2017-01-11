'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Integer = exports.Float = exports.NumberType = exports.UIDType = exports.ValueType = exports.RootType = undefined;

var _root = require('./root');

var _root2 = _interopRequireDefault(_root);

var _value = require('./value');

var _value2 = _interopRequireDefault(_value);

var _uid = require('./uid');

var _uid2 = _interopRequireDefault(_uid);

var _number = require('./number');

var _number2 = _interopRequireDefault(_number);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.RootType = _root2.default;
exports.ValueType = _value2.default;
exports.UIDType = _uid2.default;
exports.NumberType = _number2.default;
var Float = exports.Float = (0, _number2.default)(parseFloat);
var Integer = exports.Integer = (0, _number2.default)(parseInt);