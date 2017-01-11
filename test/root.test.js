import {RootType} from '../src/type-factories';
import {expect} from 'chai';

describe('RootType', function () {
  it('is a generic type generator', function () {
    const Type = RootType();

    expect(typeof Type === 'function').to.be.true;
    expect(Type).not.to.throw();
    expect(typeof Type() === 'object').to.be.true;
  });
});
