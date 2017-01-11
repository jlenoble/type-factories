import ValueType from './value';

export default function UIDType (prefix) {
  const _prefix = typeof prefix === "string" ? prefix : 0;

  const _value = Symbol();
  let _uid = 0;

  const prototype = {
    initialize: function () {
      this[_value] = _prefix + ++_uid;
    }
  };

  const descriptors = {
    value: {
      get: function () {
        return this[_value];
      }
    }
  };

  return ValueType(prototype, descriptors);
};
