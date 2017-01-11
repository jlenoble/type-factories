"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = RootType;
function noop() {}

function RootType(prototype, descriptors) {
  var _prototype = Object.assign({}, {
    initialize: noop
  }, prototype);

  var _descriptors = descriptors || {};

  return function () {
    var obj = Object.create(_prototype, _descriptors);
    obj.initialize();
    return obj;
  };
}
module.exports = exports["default"];