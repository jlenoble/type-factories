import RootType from './root';

export default function ValueType (prototype, descriptors, symbol) {
  const _value = typeof symbol === 'symbol' ? symbol : Symbol();

  const _descriptors = Object.assign({}, {
    value: {
      get: function () {
        return this[_value];
      },
      set: function (value) {
        this[_value] = value;
      }
    }
  },
  descriptors);

  return RootType(prototype, _descriptors);
}
