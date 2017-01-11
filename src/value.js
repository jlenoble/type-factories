import RootType from './root';

export default function ValueType (prototype, descriptors, symbol) {
  const _value = typeof symbol === 'symbol' ? symbol : Symbol();

  const _prototype = Object.assign({
    initialize (value) {
      this.value = value;
    },
    toString () {
      return this[_value].toString();
    },
    toLocaleString () {
      return this[_value].toLocaleString();
    },
    valueOf () {
      return this[_value];
    },
  }, prototype);

  const _descriptors = Object.assign({
    value: {
      get: function () {
        return this[_value];
      },
      set: function (value) {
        this[_value] = value && value.value ? value.value : value;
      },
    },
  },
  descriptors);

  return RootType(_prototype, _descriptors);
}
