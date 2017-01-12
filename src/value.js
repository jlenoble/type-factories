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
    isValueType: {
      get () {
        return true;
      },
    },
  },
  descriptors);

  const Type = RootType(_prototype, _descriptors);
  Object.defineProperty(Type, 'name', {value: 'Value'});

  return Type;
}
