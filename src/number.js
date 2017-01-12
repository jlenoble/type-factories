import ValueType from './value';

export default function NumberType (parseFunc, prototype, descriptors, symbol) {
  const _value = typeof symbol === 'symbol' ? symbol : Symbol();

  const _prototype = Object.assign({
    toExponential (fractionDigits) {
      return this[_value].toExponential(fractionDigits);
    },
    toFixed (digits) {
      return this[_value].toFixed(digits);
    },
    toPrecision (precision) {
      return this[_value].toPrecision(precision);
    },
  }, prototype);

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

  const Type = ValueType(_prototype, _descriptors, _value);
  Object.defineProperty(Type, 'name', {value: 'Number (derived from Value)'});

  return Type;
};

export const Float = NumberType(parseFloat);
Object.defineProperty(Float, 'name', {value: 'Float'});

export const Integer = NumberType(parseInt);
Object.defineProperty(Integer, 'name', {value: 'Integer'});
