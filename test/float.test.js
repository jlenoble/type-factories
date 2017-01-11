import {Float} from '../src/type-factories';
import {expect} from 'chai';

describe('Float', function () {
  it(`Initializing with various args don't break type`, function () {
    // NB: parseFloat implicitly calls toString on objects, therefore some
    // wierd edge behaviors!
    expect(Float().value).to.be.NaN;
    expect(Float(12).value).to.equal(12);
    expect(Float(-1234.123).value).to.equal(-1234.123);
    expect(Float('34.5foo').value).to.equal(34.5);
    expect(Float({
      value: 12,
    }).value).to.be.NaN;
    expect(Float(12345e-3).value).to.equal(12.345);
    expect(Float([]).value).to.be.NaN;
    expect(Float([123]).value).to.equal(123);
    expect(Float([12.3, 4.56]).value).to.equal(12.3);
    expect(Float(['-12.3', '-4.56']).value).to.equal(-12.3);
    expect(Float(Float(10.34)).value).to.equal(10.34);
  });

  it('Updating with various values preserves type', function () {
    // NB: parseFloat implicitly calls toString on objects, therefore some
    // wierd edge behaviors!
    const a = Float();
    expect(a.value).to.be.NaN;
    a.value = 12;
    expect(a.value).to.equal(12);
    a.value = -1234.123;
    expect(a.value).to.equal(-1234.123);
    a.value = '34.5foo';
    expect(a.value).to.equal(34.5);
    a.value = {
      value: 12,
    };
    expect(a.value).to.be.NaN;
    a.value = 12345e-3;
    expect(a.value).to.equal(12.345);
    a.value = Float('.123bar');
    expect(a.value).to.equal(0.123);
    a.value = {
      baz: ['-.34.5foo', {}, 456],
      toString: function () {
        return '' + parseFloat(this.baz, 10);
      },
    };
    expect(a.value).to.equal(-0.34);
    a.value = Float(10.34);
    expect(a.value).to.equal(10.34);
  });
  it(`Floats don't bleed on one another`, function () {
    // Make sure value is not set on prototype and therefore not shared
    const a = Float(123.4);
    const b = Float(4.321);
    expect(a.value).to.equal(123.4);
    expect(b.value).to.equal(4.321);
  });
});
