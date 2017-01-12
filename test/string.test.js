import {StringType} from '../src/type-factories';
import {expect} from 'chai';

describe('StringType', function () {
  it('Calling ctor creates a proper string type',
  function () {
    const Type = StringType();
    expect(Type().value).to.equal('undefined');
    expect(Type(20.4).value).to.equal('20.4');

    const t = Type();
    t.value = 'foo';
    expect(t.value).to.equal('foo');
  });
});
