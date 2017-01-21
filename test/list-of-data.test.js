import {makeListType, makeDataType} from '../src/type-factories';
import {expect} from 'chai';

describe('List of Data', function () {
  before(function () {
    this.Data = makeDataType({
      isData: Boolean,
      name: String,
      count: Number,
    });

    this.List = makeListType(this.Data);

    this.a = {
      isData: true,
      name: 'foo',
      count: 1,
    };

    this.b = {
      name: 'bar',
    };

    this.c = {
      count: 3,
    };

    this.args = [this.a, this.b, this.c];

    this.execThrow = function (func) {
      expect(func).to.throw(TypeError);
    };

    this.compare = function (value, refValue) {
      if (Array.isArray(value)) {
        value.forEach((val, i) => this.compare(val, refValue[i]));
      } else {
        ['isData', 'name', 'count'].forEach(key => {
          if (refValue[key] !== undefined) {
            expect(refValue[key]).to.equal(value[key]);
          }
        });
      }
    };
  });

  it('can be instantiated', function () {
    new this.List(...this.args);
  });

  it('can be accessed via [index]', function () {
    this.list = new this.List(...this.args);

    expect(this.list[0]['isData']).to.equal(this.a['isData']);
    expect(this.list[1]['isData']).to.be.false;
    expect(this.list[2]['isData']).to.be.false;

    expect(this.list[0]['name']).to.equal(this.a['name']);
    expect(this.list[1]['name']).to.equal(this.b['name']);
    expect(this.list[2]['name']).to.equal('');

    expect(this.list[0]['count']).to.equal(this.a['count']);
    expect(this.list[1]['count']).to.equal(0);
    expect(this.list[2]['count']).to.equal(this.c['count']);

    expect(this.list.length).to.equal(3);
  });

  it('can be set via [index]', function () {
    this.list = new this.List();

    expect(this.list[0]).to.be.undefined;
    expect(this.list[1]).to.be.undefined;
    expect(this.list[2]).to.be.undefined;
    expect(this.list.length).to.equal(0);

    this.list[0] = this.a;
    this.list[1] = this.b;
    this.list[2] = this.c;

    expect(this.list[0]['isData']).to.equal(this.a['isData']);
    expect(this.list[1]['isData']).to.be.false;
    expect(this.list[2]['isData']).to.be.false;

    expect(this.list[0]['name']).to.equal(this.a['name']);
    expect(this.list[1]['name']).to.equal(this.b['name']);
    expect(this.list[2]['name']).to.equal('');

    expect(this.list[0]['count']).to.equal(this.a['count']);
    expect(this.list[1]['count']).to.equal(0);
    expect(this.list[2]['count']).to.equal(this.c['count']);

    expect(this.list.length).to.equal(3);
  });

  it('can be reset or extended via length accessor', function () {
    this.list = new this.List(...this.args);

    this.list.length = 5;

    expect(this.list[0]['isData']).to.equal(this.a['isData']);
    expect(this.list[1]['isData']).to.be.false;
    expect(this.list[2]['isData']).to.be.false;
    expect(this.list[3]['isData']).to.be.false;
    expect(this.list[4]['isData']).to.be.false;

    expect(this.list[0]['name']).to.equal(this.a['name']);
    expect(this.list[1]['name']).to.equal(this.b['name']);
    expect(this.list[2]['name']).to.equal('');
    expect(this.list[3]['name']).to.equal('');
    expect(this.list[4]['name']).to.equal('');

    expect(this.list[0]['count']).to.equal(this.a['count']);
    expect(this.list[1]['count']).to.equal(0);
    expect(this.list[2]['count']).to.equal(this.c['count']);
    expect(this.list[3]['count']).to.equal(0);
    expect(this.list[4]['count']).to.equal(0);

    this.list.length = 0;

    expect(this.list[0]).to.be.undefined;
    expect(this.list[1]).to.be.undefined;
    expect(this.list[2]).to.be.undefined;
    expect(this.list[3]).to.be.undefined;
    expect(this.list[4]).to.be.undefined;

    this.list.length = 5;

    expect(this.list[0]['isData']).to.be.false;
    expect(this.list[1]['isData']).to.be.false;
    expect(this.list[2]['isData']).to.be.false;
    expect(this.list[3]['isData']).to.be.false;
    expect(this.list[4]['isData']).to.be.false;

    expect(this.list[0]['name']).to.equal('');
    expect(this.list[1]['name']).to.equal('');
    expect(this.list[2]['name']).to.equal('');
    expect(this.list[3]['name']).to.equal('');
    expect(this.list[4]['name']).to.equal('');

    expect(this.list[0]['count']).to.equal(0);
    expect(this.list[1]['count']).to.equal(0);
    expect(this.list[2]['count']).to.equal(0);
    expect(this.list[3]['count']).to.equal(0);
    expect(this.list[4]['count']).to.equal(0);
  });

  it(`Object can't be extended`, function () {
    this.execThrow(() => {
      const d = new this.List(this.a);
      d.foo = 'bar';
    });

    this.execThrow(() => {
      const d = new this.List(this.a);
      Object.defineProperty(d, 'foo', {value: 'bar'});
    });
  });

  it(`Property value can't be deleted`, function () {
    this.execThrow(() => {
      const d = new this.List(this.a);
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
        const d = new this.List(...this.args);
        let b;
        let func;

        switch(name) {
        case 'toString': case 'toLocaleString':
          expect(d[name]()).to.equal(`[{
  isData: true,
  name: 'foo',
  count: 1
}, {
  isData: false,
  name: 'bar',
  count: 0
}, {
  isData: false,
  name: '',
  count: 3
}]`);
          break;

        case 'join':
          expect(d[name](' ')).to.equal(`{
  isData: true,
  name: 'foo',
  count: 1
} {
  isData: false,
  name: 'bar',
  count: 0
} {
  isData: false,
  name: '',
  count: 3
}`);
          break;

        case 'pop': case 'reverse': case 'shift':
          b = this.args[name]();
          this.compare(d[name](), b);
          this.compare(d, this.args);
          break;

        case 'push': case 'unshift': case 'indexOf': case 'lastIndexOf':
          b = this.args[name](this.a);
          expect(d[name](this.a)).to.equal(b);
          this.compare(d, this.args);
          break;

        case 'fill': case 'includes':
          b = this.args[name](this.a, 2);
          this.compare(d[name](this.a, 2), b);
          this.compare(d, this.args);
          break;

        case 'slice': case 'splice':
          b = this.args[name](1, 2);
          this.compare(d[name](1, 2), b);
          this.compare(d, this.args);
          break;

        case 'sort':
          func = (a, b) => b - a;
          b = this.args[name](func);
          this.compare(d[name](func), b);
          this.compare(d, this.args);
          break;

        case 'filter':
          func = a => a > 3;
          b = this.args[name](func);
          this.compare(d[name](func), b);
          this.compare(d, this.args);
          break;

        case 'some': case 'every': case 'find': case 'findIndex':
          func = a => a > 3;
          b = this.args[name](func);
          expect(d[name](func)).to.equal(b);
          this.compare(d, this.args);
          break;

        case 'forEach':
          func = (a, i, arr) => {
            arr[i] = this.a;
          };
          b = this.args[name](func);
          expect(d[name](func)).to.equal(b);
          this.compare(d, this.args);
          break;

        case 'map':
          func = a => this.b;
          b = this.args[name](func);
          this.compare(d[name](func), b);
          this.compare(d, this.args);
          break;

        case 'reduce': case 'reduceRight':
          this.args.push(this.a, this.c);
          d.push(this.a, this.c);
          func = (a, b) => {
            const _a = a.count ? a.count : a;
            const _b = b.count ? b.count : b;
            return _a + _b;
          };
          b = this.args[name](func);
          expect(d[name](func)).to.equal(b);
          this.compare(d, this.args);
          break;

        case 'copyWithin':
          b = this.args[name](0, 2, 3);
          this.compare(d[name](0, 2, 3), b);
          this.compare(d, this.args);
          break;

        case 'entries':
          b = d[name]();
          this.compare(b.next().value[1], this.c);
          this.compare(b.next().value[1], this.a);
          this.compare(b.next().value[1], this.a);
          this.compare(b.next().value[1], this.a);
          this.compare(b.next().value[1], this.a);
          expect(b.next().done).to.be.true;
          break;

        case 'keys':
          b = d[name]();
          expect(b.next().value).to.eql(0);
          expect(b.next().value).to.eql(1);
          expect(b.next().value).to.eql(2);
          expect(b.next().value).to.eql(3);
          expect(b.next().value).to.eql(4);
          expect(b.next().done).to.be.true;
          break;

        case 'values':
          b = d[name]();
          this.compare(b.next().value, this.c);
          this.compare(b.next().value, this.a);
          this.compare(b.next().value, this.a);
          this.compare(b.next().value, this.a);
          this.compare(b.next().value, this.a);
          expect(b.next().done).to.be.true;
          break;

        case 'concat':
          this.compare(d[name]([this.b, this.c]), [this.c, this.a, this.a,
            this.a, this.a, this.b, this.c]);
          break;

        default:
          throw new Error(`${name} method is not defined`);
        }
      });
  });

  it('in operator is Ok', function () {
    const d = new this.List(...this.args);

    expect('concat' in d).to.be.true;
    expect('concat' in d).to.equal('concat' in this.args);
    expect(0 in d).to.be.true;
    expect(0 in d).to.equal(0 in this.args);
  });

  it('Spread is Ok', function () {
    const d = new this.List(...this.args);

    [...d].forEach((val, i) => {
      this.compare(val, this.args[i]);
    });
  });

  it('Array.from is Ok', function () {
    const d = new this.List(...this.args);

    Array.from(d).forEach((val, i) => {
      this.compare(val, this.args[i]);
    });
  });

  it('for of loop is Ok', function () {
    const d = new this.List(...this.args);
    const iter = this.args.entries();

    for (let val of d) {
      const value = iter.next().value;

      this.compare(val, value);
    }
  });

  it('for in loop is Ok', function () {
    const d = new this.List(...this.args);

    for (let key in this.args) { // eslint-disable-line guard-for-in
      expect(d[key]).not.to.be.undefined;
    }
    for (let key in d) { // eslint-disable-line guard-for-in
      expect(key in a).to.be.true;
    }
  });

  it('Symbol.iterator is Ok', function () {
    const d = new this.List(...this.args);
    const iter1 = d[Symbol.iterator]();
    const iter2 = this.args.entries();

    while (true) {
      const entry = iter2.next();
      if (entry.done) {
        break;
      }

      const value = iter1.next().value;
      const refValue = entry.value[1];

      this.compare(value, refValue);
    }
  });
});
