import {ObjectType, Float, Integer} from '../src/type-factories';
import {expect} from 'chai';

describe('ObjectType', function () {
  it('Calling ctor with no args creates a useless type', function () {
    const Type = ObjectType();

    const t = Type({
      foo: 'bar',
    });
    expect(t.foo).to.be.undefined;

    t.foo = 'bar';
    expect(t.foo).to.equal('bar');
  });

  it('Calling ctor with native types Number or String works', function () {
    const Type = ObjectType({
      i: Number,
      a: String,
    });

    const t = Type({
      i: 10,
      a: 'bar',
    });

    expect(+t.i).to.equal(10);
    expect(t.a.toString()).to.equal('bar');
  });

  it('Calling ctor with Value types creates a functional type', function () {
    const Type = ObjectType({
      a: Float,
      b: Float,
      i: Integer,
      j: Integer,
    });

    let t = Type();
    expect(t.a).to.be.NaN;
    expect(t.b).to.be.NaN;
    expect(t.i).to.be.NaN;
    expect(t.j).to.be.NaN;

    t = Type({
      a: 'dummy',
      b: 3.2e-5,
      i: '72',
    });
    expect(t.a.value).to.be.NaN;
    expect(t.b.value).to.equal(3.2e-5);
    expect(t.i.value).to.equal(72);
    expect(t.j.value).to.be.NaN;

    let s = Type(t);
    expect(s.a.value).to.be.NaN;
    expect(s.b.value).to.equal(3.2e-5);
    expect(s.i.value).to.equal(72);
    expect(s.j.value).to.be.NaN;

    t.a = '23e3';
    t.b = 45.2;
    t.i = '453e-1';
    t.j = -12;
    expect(t.a.value).to.equal(23000);
    expect(t.b.value).to.equal(45.2);
    expect(t.i.value).to.equal(453);
    expect(t.j.value).to.equal(-12);

    s.props = t;
    expect(s.a.value).to.equal(23000);
    expect(s.b.value).to.equal(45.2);
    expect(s.i.value).to.equal(453);
    expect(s.j.value).to.equal(-12);
  });

  it('Updating with native types Number or String works', function () {
    const Type = ObjectType({
      i: Number,
      a: String,
    });

    const model = {
      i: 10,
      a: 'bar',
    };
    let t = Type();

    t.i = model;
    t.a = model;

    expect(t.i.value).to.equal(10);
    expect(t.a.value).to.equal('bar');
  });

  it('Updating with Value types creates a functional type', function () {
    const Type = ObjectType({
      a: Float,
      b: Float,
      i: Integer,
      j: Integer,
    });

    let t = Type();
    expect(t.a.value).to.be.NaN;
    expect(t.b.value).to.be.NaN;
    expect(t.i.value).to.be.NaN;
    expect(t.j.value).to.be.NaN;

    const m1 = {
      a: 'dummy',
      b: 3.2e-5,
      i: '72',
    };

    t.a = m1;
    t.b = m1;
    t.i = m1;
    expect(t.a.value).to.be.NaN;
    expect(t.b.value).to.equal(3.2e-5);
    expect(t.i.value).to.equal(72);
    expect(t.j.value).to.be.NaN;
  });
});
