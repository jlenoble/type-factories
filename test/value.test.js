import {ValueType} from '../src/type-factories';
import {expect} from 'chai';

describe('ValueType', function () {
  it('is a generic type generator', function () {
    const Type = ValueType();

    expect(typeof Type === 'function').to.be.true;
    expect(Type).not.to.throw();
    expect(typeof Type() === 'object').to.be.true;
  });

  describe('generates Types that create objects', function () {
    it('that can be initialized', function () {
      const Type = ValueType();

      // value property is a base type
      expect(Type(42).value).to.eql(42);
      expect(Type(42).value).to.equal(42);

      // Object is not a base type
      expect(Type(42)).not.to.equal(42);
      expect(Type(42)).not.to.eql(42);

      // But object converts to one
      expect(+Type(42)).to.equal(42);
      expect(Type(42) + '').to.equal('42');
    });

    it('that can be initialized from same type or another Value type',
    function () {
      const Type1 = ValueType();
      const Type2 = ValueType();

      const a = Type1('dummy');
      expect(a.value).to.equal('dummy');

      const b = Type1(a);
      expect(b.value).to.equal('dummy');

      const c = Type2(a);
      expect(c.value).to.equal('dummy');
    });

    it('that are no singleton', function () {
      const Type = ValueType();

      expect(Type()).not.to.equal(Type());
      expect(Type(42)).not.to.equal(Type(42));
    });

    describe(`with a unique property 'value' which`, function () {
      const Type = ValueType();
      const obj = Type();

      it('can be accessed', function () {
        expect(function () {
          obj.value;
        }).not.to.throw();
      });

      it('has no default', function () {
        expect(obj.value).to.be.undefined;
      });

      it('can be set', function () {
        expect(function () {
          obj.value = 100;
        }).not.to.throw();
        expect(obj.value).to.equal(100);
      });

      it('can still be mutated once set', function () {
        obj.value = 200;
        expect(obj.value).to.equal(200);
      });

      it('is not static between instances', function () {
        expect(Type().value).not.to.equal(obj.value);
      });
    });
  });
});
