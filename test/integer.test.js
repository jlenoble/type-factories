import {Integer} from '../src/type-factories';
import {expect} from 'chai';

describe('Integer', function () {
  it(`Initializing with various args don't break type`, function () {
    // NB: parseInt implicitly calls toString on objects, therefore some
    // wierd edge behaviors!
    expect(Integer().value).to.be.NaN;
    expect(Integer(12).value).to.equal(12);
    expect(Integer(-1234.123).value).to.equal(-1234);
    expect(Integer('34.5foo').value).to.equal(34);
    expect(Integer({
      value: 12,
    }).value).to.be.NaN;
    expect(Integer(12345e-3).value).to.equal(12);
    expect(Integer([]).value).to.be.NaN;
    expect(Integer([123]).value).to.equal(123);
    expect(Integer([12.3, 4.56]).value).to.equal(12);
    expect(Integer(['-12.3', '-4.56']).value).to.equal(-12);
    expect(Integer(Integer(10.34)).value).to.equal(10);
  });

  it('Updating with various values preserves type', function () {
    // NB: parseInt implicitly calls toString on objects, therefore some
    // wierd edge behaviors!
    const a = Integer();
    expect(a.value).to.be.NaN;
    a.value = 12;
    expect(a.value).to.equal(12);
    a.value = -1234.123;
    expect(a.value).to.equal(-1234);
    a.value = '34.5foo';
    expect(a.value).to.equal(34);
    a.value = {
      value: 12,
    };
    expect(a.value).to.be.NaN;
    a.value = 12345e-3;
    expect(a.value).to.equal(12);
    a.value = Integer('.123bar');
    expect(a.value).to.be.NaN;
    a.value = {
      baz: ['-0.34.5foo', {}, 456],
      toString: function () {
        return '' + parseInt(this.baz, 10);
      },
    };
    expect(a.value).to.equal(0);
    a.value = Integer(10.34);
    expect(a.value).to.equal(10);
  });

  it(`Integers don't bleed on one another`, function () {
    // Make sure value is not set on prototype and therefore not shared
    const a = Integer(123.4);
    const b = Integer(4.321);
    expect(a.value).to.equal(123);
    expect(b.value).to.equal(4);
  });
});
