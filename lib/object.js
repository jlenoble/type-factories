'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ObjectType;

var _root = require('./root');

var _root2 = _interopRequireDefault(_root);

var _number = require('./number');

var _string = require('./string');

var _explanation = require('explanation');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ObjectType(propTypes, prototype, descriptors, symbol) {
  var _props = Symbol();
  var _propTypes = Object.assign({}, propTypes);

  Object.keys(_propTypes).forEach(function (key) {
    var Type = _propTypes[key];

    switch (Type) {
      case Number:
        _propTypes[key] = _number.Float;
        break;

      case String:
        _propTypes[key] = _string.Text;
        break;

      default:
        var t = Type();

        if (!t.isValueType) {
          (0, _explanation.error)({
            message: 'Not a Value',
            explain: ['Type \'' + Type.name + '\' is not a Value type, nor can it be casted to one']
          });
        }
    }
  });

  var _prototype = Object.assign({
    initialize: function initialize() {
      var _this = this;

      this[_props] = {};

      Object.keys(_propTypes).forEach(function (key) {
        _this[_props][key] = _propTypes[key]();
      });

      for (var _len = arguments.length, props = Array(_len), _key = 0; _key < _len; _key++) {
        props[_key] = arguments[_key];
      }

      props.forEach(function (prop) {
        _this.props = prop;
      });
    }
  }, prototype);

  var _descriptors = {
    props: {
      set: function set(props) {
        var _this2 = this;

        Object.keys(_propTypes).forEach(function (key) {
          if (key in props) {
            _this2[_props][key].value = props[key];
          }
        });
      }
    }
  };

  function makeDescriptor(key) {
    return {
      get: function get() {
        return this[_props][key].value;
      },
      set: function set(props) {
        this[_props][key].value = props;
      }
    };
  }

  Object.keys(_propTypes).forEach(function (key) {
    _descriptors[key] = makeDescriptor(key);
  });

  Object.assign(_descriptors, descriptors);

  var Type = (0, _root2.default)(_prototype, _descriptors);
  Object.defineProperty(Type, 'name', { value: 'Object (derived from Root)' });

  return Type;
}
module.exports = exports['default'];