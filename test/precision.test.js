import {PrecisionType} from '../src/type-factories';
import {expect} from 'chai';

describe('PrecisionType', function () {
  it('Calling ctor with precision int',
  function () {
    const Type = PrecisionType(3);

    expect(+Type(123456789)).to.equal(123000000);
    expect(+Type(987654321)).to.equal(988000000);
    expect(+Type(.123456789)).to.equal(.123);
    expect(+Type(.987654321)).to.equal(.988);
    expect(+Type(12345.6789e23)).to.equal(123e25);
    expect(+Type(98765.4321e-34)).to.equal(988e-32);

    expect(+Type(-123456789)).to.equal(-123000000);
    expect(+Type(-987654321)).to.equal(-988000000);
    expect(+Type(-.123456789)).to.equal(-.123);
    expect(+Type(-.987654321)).to.equal(-.988);
    expect(+Type(-12345.6789e23)).to.equal(-123e25);
    expect(+Type(-98765.4321e-34)).to.equal(-988e-32);
  });
});
