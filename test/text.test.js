import {Text} from '../src/type-factories';
import {expect} from 'chai';

describe('Testing Text', function () {
  before(function () {
    this.create = function (value) {
      return new Text(value);
    };

    this.set = function (value) {
      const d = new Text('hello');
      d.value = value;
      return d;
    };

    this.execGood = function (func, value) {
      expect(func.bind(undefined, value)).not.to.throw();
      expect(func(value).value).not.to.be.undefined;
      expect(func(value).value).to.equal(value === undefined ? '' :
        String(value));
    };

    this.execThrow = function (func) {
      expect(func).to.throw(TypeError);
    }
  })

  it('Initializing with anything is Ok', function () {
    this.execGood(this.create, 23);
    this.execGood(this.create, 23.45);
    this.execGood(this.create, -.23e-8);
    this.execGood(this.create, '23e23');
    this.execGood(this.create, '-123.45');
    this.execGood(this.create, undefined);
    this.execGood(this.create, NaN);
    this.execGood(this.create, /hello.*/);
    this.execGood(this.create, '24BAD');
    this.execGood(this.create, function () {});
    this.execGood(this.create, {});
  });

  it('Setting value property with anything is OK', function () {
    this.execGood(this.set, 23);
    this.execGood(this.set, 23.45);
    this.execGood(this.set, -.23e-8);
    this.execGood(this.set, '23e23');
    this.execGood(this.set, '-123.45');
    this.execGood(this.set, undefined);
    this.execGood(this.set, NaN);
    this.execGood(this.set, /hello.*/);
    this.execGood(this.set, '24BAD');
    this.execGood(this.set, function () {});
    this.execGood(this.set, {});
  });

  it(`Object can't be extended`, function () {
    this.execThrow(function () {
      const d = new Text('hello');
      d.foo = 'bar';
    });

    this.execThrow(function () {
      const d = new Text('hello');
      Object.defineProperty(d, 'foo', {value: 'bar'});
    });
  });

  it(`Property value can't be deleted`, function () {
    this.execThrow(function () {
      const d = new Text('hello');
      delete d.value;
    });
  });

  it(`Prototype can't be extended`, function () {
    this.execThrow(function () {
      Text.prototype.foo = 'bar';
    });
  });

  it(`Prototype properties can't be deleted`, function () {
    this.execThrow(function () {
      delete Text.prototype.toString;
    });
  });

  it(`Methods mirror String methods`, function () {
    Object.getOwnPropertyNames(String.prototype).filter(name =>
      name !== 'constructor' && typeof String.prototype[name] === 'function')
      .forEach(name => {
        const d = new Text('  Hello world ');

        switch(name) {
        case 'toString': case 'valueOf':
        case 'trim': case 'trimLeft': case 'trimRight':
        case 'toLowerCase': case 'toLocaleLowerCase':
        case 'toUpperCase': case 'toLocaleUpperCase':
        case 'link': case 'anchor':
        case 'big': case 'blink': case 'bold': case 'fixed':
        case 'fontcolor': case 'fontsize': case 'italics':
        case 'small': case 'strike': case 'sub': case 'sup':
          expect(d[name]()).to.equal(d.value[name]());
          break;

        case 'charAt': case 'charCodeAt': case 'codePointAt': case 'repeat':
          expect(d[name](4)).to.equal(d.value[name](4));
          break;

        case 'indexOf': case 'lastIndexOf': case 'startsWith':
        case 'includes': case 'endsWith':
          expect(d[name]('Hello', 2)).to.equal(d.value[name]('Hello', 2));
          break;

        case 'normalize':
          expect(d[name]("NFKD")).to.equal(d.value[name]('NFKD'));
          break;

        case 'localeCompare': case 'search': case 'match': case 'split':
          expect(d[name]('Hello')).to.eql(d.value[name]('Hello'));
        break;

        case 'replace': case 'concat':
          expect(d[name]('Hello', 'Hi')).to.eql(d.value[name]('Hello', 'Hi'));
            break;

        case 'substr': case 'substring': case 'slice':
          expect(d[name](2, 4)).to.eql(d.value[name](2, 4));
          break;

        default:
          throw new Error(`${name} method is not defined`);
        }
      });
  });

  it('Implicit concatenation is Ok', function () {
    const a = new Text('foo');
    const b = new Text('bar');
    const c = new Text(21);

    expect(a + b + 'hello').to.equal('foobarhello');
    expect(a + c + 'hello').to.equal('foo21hello');
  });

  it('Accessing characters is Ok', function () {
    const a = new Text('foobar');
    expect(a[3]).to.equal('b');
    expect(() => {
      a[3] = 'a';
    }).to.throw(TypeError);
  });
});
