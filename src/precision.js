import NumberType from './number';

export default function PrecisionType (precision = 21) {
  const _value = Symbol();
  let _precision = parseInt(precision, 10);
  if (_precision < 1) {
    _precision = 1;
  } else if (_precision > 21) {
    _precision = 21;
  }

  const descriptors = {
    value: {
      get () {
        return this[_value];
      },
      set (value) {
        let val = parseFloat(value, 10);
        val = val.toPrecision(_precision);
        this[_value] = parseFloat(val, 10);
      },
    },
  };

  return NumberType(undefined, undefined, descriptors, _value);
};
