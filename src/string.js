import ValueType from './value';

export default function StringType (prototype, descriptors, symbol) {
  const _value = typeof symbol === 'symbol' ? symbol : Symbol();

  const _prototype = Object.assign({}, prototype);

  const _descriptors = Object.assign({
    value: {
      get () {
        return this[_value];
      },
      set (value) {
        this[_value] = '' + value;
      },
    },
  },
  descriptors);

  const Type = ValueType(_prototype, _descriptors, _value);
  Object.defineProperty(Type, 'name', {value: 'String (derived from Value)'});

  return Type;
};

export const Text = StringType();
Object.defineProperty(Text, 'name', {value: 'Text'});
