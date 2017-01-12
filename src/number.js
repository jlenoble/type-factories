import ValueType from './value';

export default function NumberType (parseFunc, prototype, descriptors, symbol) {
  const _value = typeof symbol === 'symbol' ? symbol : Symbol();

  const _prototype = Object.assign({}, prototype);

  const _descriptors = Object.assign({
    value: {
      get () {
        return this[_value];
      },
      set (value) {
        this[_value] = parseFunc(value, 10);
      },
    },
  },
  descriptors);

  return ValueType(_prototype, _descriptors, _value);
};

export const Float = NumberType(parseFloat);
export const Integer = NumberType(parseInt);
