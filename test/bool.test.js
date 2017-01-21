import {Bool} from '../src/type-factories';
import {expect} from 'chai';

describe('Testing Bool', function () {
  before(function () {
    this.create = function (value) {
      return new Bool(value);
    };

    this.set = function (value) {
      const d = new Bool(false);
      d.value = value;
      return d;
    };

    this.execGood = function (func, value) {
      expect(func.bind(undefined, value)).not.to.throw();
      expect(func(value).value).to.be.true;
    };

    this.execBad = function (func, value) {
      expect(func.bind(undefined, value)).not.to.throw();
      expect(func(value).value).to.be.false;
    };

    this.execThrow = function (func) {
      expect(func).to.throw(TypeError);
    }
  })

  it('Initializing with anything is Ok', function () {
    this.execGood(this.create, 23);
    this.execGood(this.create, 'foo');
    this.execGood(this.create, true);
    this.execGood(this.create, {});
    this.execGood(this.create, []);
    this.execBad(this.create, NaN);
    this.execBad(this.create, null);
    this.execBad(this.create, undefined);
    this.execBad(this.create, false);
    this.execBad(this.create, 0);
  });

  it('Setting value property with anything is OK', function () {
    this.execGood(this.set, 23);
    this.execGood(this.set, 'foo');
    this.execGood(this.set, true);
    this.execGood(this.set, {});
    this.execGood(this.set, []);
    this.execBad(this.set, NaN);
    this.execBad(this.set, null);
    this.execBad(this.set, undefined);
    this.execBad(this.set, false);
    this.execBad(this.set, 0);
  });

  it(`Object can't be extended`, function () {
    this.execThrow(function () {
      const d = new Bool(false);
      d.foo = 'bar';
    });

    this.execThrow(function () {
      const d = new Bool(false);
      Object.defineProperty(d, 'foo', {value: 'bar'});
    });
  });

  it(`Property value can't be deleted`, function () {
    this.execThrow(function () {
      const d = new Bool(false);
      delete d.value;
    });
  });

  it(`Prototype can't be extended`, function () {
    this.execThrow(function () {
      Bool.prototype.foo = 'bar';
    });
  });

  it(`Prototype properties can't be deleted`, function () {
    this.execThrow(function () {
      delete Bool.prototype.toString;
    });
  });

  it(`Methods mirror Boolean methods`, function () {
    Object.getOwnPropertyNames(Boolean.prototype).filter(name =>
      name !== 'constructor').forEach(name => {
        const d = new Bool(true);
        expect(d[name]()).to.equal(d.value[name]());
      });
  });

  it('Implicit conversion is Ok', function () {
    const a = new Bool(123.4);
    const b = new Bool(-.5);
    const c = new Bool(NaN);

    expect(a + b).to.equal(2);
    expect(a - b).to.equal(0);
    expect(a * b).to.equal(1);
    expect(a / b).to.equal(1);

    expect(a + c).to.equal(1);
    expect(a - c).to.equal(1);
    expect(a * c).to.equal(0);
    expect(a / c).to.equal(Infinity);
  });
});
