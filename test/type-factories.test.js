import Muter, {captured} from 'muter';
import {expect} from 'chai';
import TypeFactories from '../src/type-factories';

describe('Testing TypeFactories', function() {

  const muter = Muter(console, 'log');

  it(`Class TypeFactories says 'Hello!'`, captured(muter, function() {
    new TypeFactories();
    expect(muter.getLogs()).to.equal('Hello!\n');
  }));

});
