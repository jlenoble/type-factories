"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = RootType;
function noop() {}

function RootType(prototype, descriptors) {
  var _prototype = Object.assign({
    initialize: noop
  }, prototype);

  var _descriptors = descriptors || {};

  function Root() {
    var obj = Object.create(_prototype, _descriptors);
    obj.initialize.apply(obj, arguments);
    return obj;
  };

  return Root;
}
module.exports = exports["default"];