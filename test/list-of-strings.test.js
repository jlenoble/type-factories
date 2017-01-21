import {makeListType} from '../src/type-factories';
import {expect} from 'chai';

describe('List of Strings (String ctor)', function () {
  before(function () {
    this.List = makeListType(String);

    this.execThrow = function (func) {
      expect(func).to.throw(TypeError);
    };
  });

  it('can be instantiated', function () {
    this.list = new this.List(1, '2.5', 'toto');
  });

  it('can be accessed via [index]', function () {
    this.list = new this.List(1, '2.5', 'toto');

    expect(this.list[0]).to.equal('1');
    expect(this.list[1]).to.equal('2.5');
    expect(this.list[2]).to.equal('toto');
    expect(this.list.length).to.equal(3);
  });

  it('can be set via [index]', function () {
    this.list = new this.List();

    expect(this.list[0]).to.be.undefined;
    expect(this.list[1]).to.be.undefined;
    expect(this.list[2]).to.be.undefined;
    expect(this.list.length).to.equal(0);

    this.list[0] = 1;
    this.list[1] = '2.5';
    this.list[2] = 'toto';

    expect(this.list[0]).to.equal('1');
    expect(this.list[1]).to.equal('2.5');
    expect(this.list[2]).to.equal('toto');
    expect(this.list.length).to.equal(3);
  });

  it('can be reset or extended via length accessor', function () {
    this.list = new this.List(1, 2, 3);

    this.list.length = 5;

    expect(this.list[0]).to.equal('1');
    expect(this.list[1]).to.equal('2');
    expect(this.list[2]).to.equal('3');
    expect(this.list[3]).to.equal('');
    expect(this.list[4]).to.equal('');

    this.list.length = 0;

    expect(this.list[0]).to.be.undefined;
    expect(this.list[1]).to.be.undefined;
    expect(this.list[2]).to.be.undefined;
    expect(this.list[3]).to.be.undefined;
    expect(this.list[4]).to.be.undefined;

    this.list.length = 5;

    expect(this.list[0]).to.equal('');
    expect(this.list[1]).to.equal('');
    expect(this.list[2]).to.equal('');
    expect(this.list[3]).to.equal('');
    expect(this.list[4]).to.equal('');
  });

  it(`Object can't be extended`, function () {
    this.execThrow(() => {
      const d = new this.List(10);
      d.foo = 'bar';
    });

    this.execThrow(() => {
      const d = new this.List(10);
      Object.defineProperty(d, 'foo', {value: 'bar'});
    });
  });

  it(`Property value can't be deleted`, function () {
    this.execThrow(() => {
      const d = new this.List(10);
      delete d.value;
    });
  });

  it(`Prototype can't be extended`, function () {
    this.execThrow(() => {
      this.List.prototype.foo = 'bar';
    });
  });

  it(`Prototype properties can't be deleted`, function () {
    this.execThrow(() => {
      delete this.List.prototype.push;
    });
  });

  it(`Methods mirror Array methods`, function () {
    Object.getOwnPropertyNames(Array.prototype).filter(name =>
      name !== 'constructor' && typeof Array.prototype[name] === 'function')
      .forEach(name => {
        const d = new this.List(1, 3, 5, 7);
        const a = ['1', '3', '5', '7'];
        let b;
        let func;

        switch(name) {
        case 'toString': case 'toLocaleString':
          expect(d[name]()).to.equal(`["1", "3", "5", "7"]`);
          break;

        case 'join':
          expect(d[name](' ')).to.equal(`1 3 5 7`);
          break;

        case 'pop': case 'reverse': case 'shift':
          b = a[name]();
          expect(d[name]()).to.eql(b);
          expect(d.value).to.eql(a);
          break;

        case 'push': case 'unshift': case 'fill': case 'includes':
          b = a[name]('5');
          expect(d[name]('5')).to.eql(b);
          expect(d.value).to.eql(a);
          break;

        case 'indexOf': case 'lastIndexOf':
          b = a[name](5);
          expect(d[name](5)).to.eql(b);
          expect(d.value).to.eql(a);
          break;

        case 'slice': case 'splice':
          b = a[name](1, 2);
          expect(d[name](1, 2)).to.eql(b);
          expect(d.value).to.eql(a);
          break;

        case 'sort':
          func = (a, b) => b - a;
          b = a[name](func);
          expect(d[name](func)).to.eql(b);
          expect(d.value).to.eql(a);
          break;

        case 'filter': case 'some': case 'every': case 'find': case 'findIndex':
          func = a => a > 3;
          b = a[name](func);
          expect(d[name](func)).to.eql(b);
          expect(d.value).to.eql(a);
          break;

        case 'forEach':
          func = (a, i, arr) => {
            arr[i] = 2 * a;
          };
          b = a[name]((a, i, arr) => {
            arr[i] = '' + (2 * a);
          });
          expect(d[name](func)).to.eql(b);
          expect(d.value).to.eql(a);
          break;

        case 'map':
          func = a => 2 * a;
          b = a[name](func);
          expect(d[name](func)).to.eql(b);
          expect(d.value).to.eql(a);
          break;

        case 'reduce': case 'reduceRight':
          func = (a, b) => a + b;
          b = a[name](func);
          expect(d[name](func)).to.eql(b);
          expect(d.value).to.eql(a);
          break;

        case 'copyWithin':
          b = a[name](0, 2, 3);
          expect(d[name](0, 2, 3)).to.eql(b);
          expect(d.value).to.eql(a);
          break;

        case 'entries':
          b = d[name]();
          expect(b.next().value).to.eql([0, '1']);
          expect(b.next().value).to.eql([1, '3']);
          expect(b.next().value).to.eql([2, '5']);
          expect(b.next().value).to.eql([3, '7']);
          expect(b.next().done).to.be.true;
          break;

        case 'keys':
          b = d[name]();
          expect(b.next().value).to.eql(0);
          expect(b.next().value).to.eql(1);
          expect(b.next().value).to.eql(2);
          expect(b.next().value).to.eql(3);
          expect(b.next().done).to.be.true;
          break;

        case 'values':
          b = d[name]();
          expect(b.next().value).to.eql('1');
          expect(b.next().value).to.eql('3');
          expect(b.next().value).to.eql('5');
          expect(b.next().value).to.eql('7');
          expect(b.next().done).to.be.true;
          break;

        case 'concat':
          expect(d[name]([9, 11])).to.eql(['1', '3', '5', '7', '9', '11']);
          break;

        default:
          throw new Error(`${name} method is not defined`);
        }
      });
  });

  it('in operator is Ok', function () {
    const d = new this.List(1, 3, 5, 7);
    const a = ['1', '3', '5', '7'];

    expect('concat' in d).to.be.true;
    expect('concat' in d).to.equal('concat' in a);
    expect(0 in d).to.be.true;
    expect(0 in d).to.equal(0 in a);
  });

  it('Spread is Ok', function () {
    const d = new this.List(1, 3, 5, 7);
    const a = ['1', '3', '5', '7'];

    expect([...d]).to.eql(a);
  });

  it('Array.from is Ok', function () {
    const d = new this.List(1, 3, 5, 7);
    const a = ['1', '3', '5', '7'];

    expect(Array.from(d)).to.eql(a);
  });

  it('for of loop is Ok', function () {
    const d = new this.List(1, 3, 5, 7);
    const a = ['1', '3', '5', '7'];
    const iter = a.entries();

    for (let val of d) {
      expect(val).to.equal(iter.next().value[1]);
    }
  });

  it('for in loop is Ok', function () {
    const d = new this.List(1, 3, 5, 7);
    const a = ['1', '3', '5', '7'];

    for (let key in a) { // eslint-disable-line guard-for-in
      expect(d[key]).not.to.be.undefined;
    }
    for (let key in d) { // eslint-disable-line guard-for-in
      expect(key in a).to.be.true;
    }
  });

  it('Symbol.iterator is Ok', function () {
    const d = new this.List(1, 3, 5, 7);
    const iter1 = d[Symbol.iterator]();
    const a = ['1', '3', '5', '7'];
    const iter2 = a.entries();

    while (true) {
      const entry = iter2.next();
      if (entry.done) {
        break;
      }
      expect(entry.value[1]).to.equal(iter1.next().value);
    }
  });
});
