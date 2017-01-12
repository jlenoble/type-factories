function noop () {}

export default function RootType (prototype, descriptors) {
  const _prototype = Object.assign({
    initialize: noop,
  }, prototype);

  const _descriptors = descriptors || {};

  function Root (...args) {
    const obj = Object.create(_prototype, _descriptors);
    obj.initialize(...args);
    return obj;
  };

  return Root;
}
