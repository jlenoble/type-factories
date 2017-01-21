import {makeDataType} from '../src/type-factories';
import {expect} from 'chai';

describe('Testing Data', function () {
  before(function () {
    this.Data = makeDataType({
      isData: Boolean,
      name: String,
      count: Number,
    });

    this.execThrow = function (func) {
      expect(func).to.throw(TypeError);
    };
  });

  it('can be instantiated', function () {
    const data = new this.Data({
      isData: true,
      name: 'foo',
      count: 1,
    });
  });

  it('can be accessed via properties', function () {
    const data = new this.Data({
      isData: true,
      name: 'foo',
      count: 1,
    });

    expect(data.isData).to.be.true;
    expect(data.name).to.equal('foo');
    expect(data.count).to.equal(1);
  });

  it('can be set via properties', function () {
    const data = new this.Data();

    expect(data.isData).to.be.false;
    expect(data.name).to.equal('');
    expect(data.count).to.equal(0);

    data.isData = true;
    data.name = 'foo';
    data.count = 1;

    expect(data.isData).to.be.true;
    expect(data.name).to.equal('foo');
    expect(data.count).to.equal(1);
  });

  it(`Object can't be extended`, function () {
    this.execThrow(() => {
      const d = new this.Data({
        isData: true,
        name: 'foo',
        count: 1,
      });
      d.foo = 'bar';
    });

    this.execThrow(() => {
      const d = new this.Data({
        isData: true,
        name: 'foo',
        count: 1,
      });
      Object.defineProperty(d, 'foo', {value: 'bar'});
    });
  });

  it(`Property value can't be deleted`, function () {
    this.execThrow(() => {
      const d = new this.Data({
        isData: true,
        name: 'foo',
        count: 1,
      });
      expect(d.name).not.to.be.undefined;
      delete d.name;
    });

    this.execThrow(() => {
      const d = new this.Data({
        isData: true,
        name: 'foo',
        count: 1,
      });
      expect(d.dummy).to.be.undefined;
      delete d.dummy;
    });

    this.execThrow(() => {
      const d = new this.Data({
        isData: true,
        name: 'foo',
        count: 1,
      });
      delete d.value;
    });
  });

  it(`Prototype can't be extended`, function () {
    this.execThrow(() => {
      this.Data.prototype.foo = 'bar';
    });
  });

  it(`Prototype properties can't be deleted`, function () {
    this.execThrow(() => {
      delete this.Data.prototype.toString
    });
  });

  it(`Methods mirror Object methods`, function () {
    Object.getOwnPropertyNames(Object.prototype).filter(name =>
      name !== 'constructor' && typeof Array.prototype[name] === 'function')
      .forEach(name => {
        const a = {
          isData: true,
          name: 'foo',
          count: 1,
        };
        const d = new this.Data(a);

        let b;
        let func;

        switch(name) {
        case '__defineGetter__': case '__defineSetter__':
        case '__lookupGetter__': case '__lookupSetter__':
        case 'valueOf': case 'isPrototypeOf':
          break; // Do nothing

        case 'hasOwnProperty': case 'propertyIsEnumerable':
          expect(d[name]).not.to.be.undefined;
          expect(d[name]('isData')).to.be.true;
          expect(d[name]('name')).to.be.true;
          expect(d[name]('count')).to.be.true;
          expect(d[name]('foo')).to.be.false;
          break;

        case 'toString': case 'toLocaleString':
          expect(d[name]).not.to.be.undefined;
          expect(d[name]()).to.equal(`{
  isData: true,
  name: 'foo',
  count: 1
}`);
          break;

        default:
          throw new Error(`${name} method is not defined`);
        }
      });
  });

  it('in operator is Ok', function () {
    const a = {
      isData: true,
      name: 'foo',
      count: 1,
    };
    const d = new this.Data(a);

    expect('isData' in d).to.be.true;
    expect('isData' in d).to.equal('isData' in a);
    expect('name' in d).to.be.true;
    expect('name' in d).to.equal('name' in a);
    expect('count' in d).to.be.true;
    expect('count' in d).to.equal('count' in a);
  });
});
