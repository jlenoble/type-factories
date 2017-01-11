import ValueType from './value';

export default function NumberType (parseFunc) {
  const _value = Symbol();

  const descriptors = {
    value: {
      get () {
        return this[_value];
      },
      set (value) {
        this[_value] = parseFunc(value, 10);
      },
    },
  };

  return ValueType(undefined, descriptors, _value);
};
