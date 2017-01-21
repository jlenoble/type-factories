import {Float} from '../src/value';
import {expect} from 'chai';

describe('Testing Float', function () {
  before(function () {
    this.create = function (value) {
      return new Float(value);
    };

    this.set = function (value) {
      const d = new Float(0);
      d.value = value;
      return d;
    };

    this.execGood = function (func, value) {
      expect(func.bind(undefined, value)).not.to.throw();
      expect(func(value).value).not.to.be.undefined;
      expect(func(value).value).to.equal(value === undefined ? 0 :
        Number(value));
    };

    this.execBad = function (func, value) {
      expect(func.bind(undefined, value)).not.to.throw();
      expect(func(value).value).not.to.be.undefined;
      expect(func(value).value).to.be.NaN;
    };

    this.execThrow = function (func) {
      expect(func).to.throw(TypeError);
    };
  })

  it('Initializing with a number is Ok', function () {
    this.execGood(this.create, 23);
    this.execGood(this.create, 23.45);
    this.execGood(this.create, -.23e-8);
    this.execGood(this.create, '23e23');
    this.execGood(this.create, '-123.45');
    this.execGood(this.create, undefined);
  });

  it('Initializing with not a number is Ok', function () {
    this.execBad(this.create, NaN);
    this.execBad(this.create, /hello.*/);
    this.execBad(this.create, '24BAD');
    this.execBad(this.create, function () {});
    this.execBad(this.create, {});
  });

  it('Setting value property with a number is OK', function () {
    this.execGood(this.set, 23);
    this.execGood(this.set, 23.45);
    this.execGood(this.set, -.23e-8);
    this.execGood(this.set, '23e23');
    this.execGood(this.set, '-123.45');
    this.execGood(this.set, undefined);
  });

  it('Setting value property with not a number is Ok', function () {
    this.execBad(this.set, NaN);
    this.execBad(this.set, /hello.*/);
    this.execBad(this.set, '24BAD');
    this.execBad(this.set, function () {});
    this.execBad(this.set, {});
  });
});
