import ValueType from '../src/value';
import {expect} from 'chai';

describe('ValueType', function () {

  it('is a generic type generator', function () {
    const Type = ValueType();

    expect(typeof Type === 'function').to.be.true;
    expect(Type).not.to.throw();
    expect(typeof Type() === "object").to.be.true;
  });

  describe("generates Types that create objects", function () {
    it("that are no singleton", function () {
      const Type = ValueType();

      expect(Type()).not.to.equal(Type());
    });

    describe("with a unique property 'value' which", function () {
      const Type = ValueType();
      const obj = Type();

      it("can be accessed", function () {
        expect(function () {
          obj.value;
        }).not.to.throw();
      });

      it("has no default", function () {
        expect(obj.value).to.be.undefined;
      });

      it("can be set", function () {
        expect(function () {
          obj.value = 100;
        }).not.to.throw();
        expect(obj.value).to.equal(100);
      });

      it("can still be mutated once set", function () {
        obj.value = 200;
        expect(obj.value).to.equal(200);
      });

      it("is not static between instances", function () {
        expect(Type().value).not.to.equal(obj.value);
      });
    });
  });

});
