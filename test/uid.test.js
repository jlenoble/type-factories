import {UIDType} from '../src/type-factories';
import {expect} from 'chai';

describe('UIDType', function () {
  describe('generates Types that create objects', function () {
    describe(`whose properties 'value'`,
    function () {
      it('always increment, starting at 1', function () {
        const UID = UIDType();

        expect(UID().value).to.equal(1);
        expect(UID().value).to.equal(2);
        expect(UID().value).to.equal(3);
        expect(UID().value).to.equal(4);
      });

      it('increment independently', function () {
        const UID1 = UIDType();
        const UID2 = UIDType();

        expect(UID1().value).to.equal(1);
        expect(UID2().value).to.equal(1);
        expect(UID2().value).to.equal(2);
        expect(UID2().value).to.equal(3);
        expect(UID1().value).to.equal(2);
      });

      it('cannot be modified', function () {
        const UID = UIDType();

        const uid = UID();
        expect(uid.value).to.equal(1);
        expect(function () {
          uid.value = 27;
        }).to.throw(TypeError, /set.*property.*has only a getter/);
        expect(uid.value).to.equal(1);
      });

      it('can have a prefix and still increment properly', function () {
        const UID = UIDType('foobar');

        expect(UID().value).to.equal('foobar1');
        expect(UID().value).to.equal('foobar2');
        expect(UID().value).to.equal('foobar3');
        expect(UID().value).to.equal('foobar4');
      });
    });

    describe('that can be converted implicitly to base to int or string',
    function () {
      const UID1 = UIDType();
      const UID2 = UIDType('id');

      const uid1 = UID1();
      expect(+uid1).to.equal(1);

      const uid2 = UID2();
      expect(uid2 + ' is 1').to.equal('id1 is 1');
    });
  });
});
