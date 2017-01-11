import UIDType from '../src/uid';
import {expect} from 'chai';

describe('UIDType', function () {
  describe("generates Types that create objects whose properties 'value'", function () {
    it("always increment, starting at 1", function () {
      var UID = UIDType();

      expect(UID().value).to.equal(1);
      expect(UID().value).to.equal(2);
      expect(UID().value).to.equal(3);
      expect(UID().value).to.equal(4);
    });

    it("increment independently", function () {
      var UID1 = UIDType();
      var UID2 = UIDType();

      expect(UID1().value).to.equal(1);
      expect(UID2().value).to.equal(1);
      expect(UID2().value).to.equal(2);
      expect(UID2().value).to.equal(3);
      expect(UID1().value).to.equal(2);
    });

    it("cannot be modified", function () {
      var UID = UIDType();

      var uid = UID();
      expect(uid.value).to.equal(1);
      expect(function () {
        uid.value = 27;
      }).to.throw(TypeError, /set.*property.*has only a getter/);
      expect(uid.value).to.equal(1);
    });

    it("can have a prefix and still increment properly", function () {
      var UID = UIDType("foobar");

      expect(UID().value).to.equal("foobar1");
      expect(UID().value).to.equal("foobar2");
      expect(UID().value).to.equal("foobar3");
      expect(UID().value).to.equal("foobar4");
    });
  });
});
