function noop () {}

export default function RootType (prototype, descriptors) {
  const _prototype = Object.assign({}, {
    initialize: noop
  }, prototype);

  const _descriptors = descriptors || {};

  return function () {
    const obj = Object.create(_prototype, _descriptors);
    obj.initialize();
    return obj;
  };
}
