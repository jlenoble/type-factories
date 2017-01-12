import {NumberType} from '../src/type-factories';
import {expect} from 'chai';

describe('NumberType', function () {
  it('Calling ctor with no args creates an uninstanciable type', function () {
    const Type = NumberType();
    expect(Type).to.throw(TypeError, /parseFunc is not a function/);
  });

  it('Calling ctor with a dummy func creates a useless type', function () {
    const Type = NumberType(function () {});
    expect(Type().value).to.be.undefined;

    const t = Type('foo');
    expect(t.value).to.be.undefined;
    t.value = 14;
    expect(t.value).to.be.undefined;
  });

  it('Calling ctor with a custom float func creates a proper number type',
  function () {
    const Type = NumberType(function (value) {
      return Math.sin(parseFloat(value));
    });
    expect(Type(20.4).value).to.equal(Math.sin(20.4));
    expect(+Type(20.4)).to.equal(Math.sin(20.4));

    const t = Type();
    expect(t.value).to.be.NaN;
    t.value = 400.;
    expect(t.value).to.equal(Math.sin(400));
  });

  it('Testing toPrecision, toFixed, toExponential', function () {
    const Type = NumberType(parseFloat);

    expect(Type(12345).toPrecision(2)).to.equal('1.2e+4');
    expect(Type(12345).toFixed(2)).to.equal('12345.00');
    expect(Type(12345).toExponential(2)).to.equal('1.23e+4');
  });
});
