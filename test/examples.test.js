import {ValueType, NumberType, PrecisionType, StringType, UIDType, ObjectType}
  from '../src/type-factories';
import {expect} from 'chai';

describe(`Testing README.md examples`, function () {
  it('ValueType example', function () {
    const Value = ValueType();
    const s = Value('foo');
    const d = Value(20);

    expect(s.value).to.equal('foo');
    expect(d.value).to.equal(20);

    s.value += 'bar';
    expect(s.value).to.equal('foobar');

    d.value *= 5;
    expect(d.value).to.equal(100);

    s.value += d; // Implicit conversion to base type
    expect(s.value).to.equal('foobar100');
  });

  it('NumberType example', function () {
    const Func = NumberType(function (x) {
      const _x = parseFloat(x, 10);
      return _x * _x + 2;
    });

    const a = Func(0);
    const b = Func(1);
    const c = Func(2);

    expect(a.value).to.equal(2);
    expect(b.value).to.equal(3);
    expect(c.value).to.equal(6);

    c.value = a + b; // Implicit conversions and computation
    expect(c.value).to.equal(27); // (2+3)**2 + 2)
  });

  it('PrecisionType example', function () {
    const Approx = PrecisionType(6);

    expect(+Approx(123456789)).to.equal(123457000);
    expect(+Approx(.987654321)).to.equal(.987654);

    expect(+Approx(Approx(34e3) + Approx(-34e-3))).to.equal(34000);
  });

  it('StringType example', function () {
    const Str = StringType();

    expect(Str(100) + Str(10)).to.equal('10010');
  });

  it('UIDType example', function () {
    const UID = UIDType('id');
    const CID = UIDType('c');

    expect(UID().value).to.equal('id1');
    expect(UID().value).to.equal('id2');
    expect(CID().value).to.equal('c1');
    expect(UID().value).to.equal('id3');
  });

  it('ObjectType example', function () {
    const Person = ObjectType({
      firstName: String,
      lastName: String,
    });

    const Job = ObjectType({
      job: String,
    });

    const Employee = ObjectType({
      firstName: String,
      lastName: String,
      job: String,
    });

    const Bob = Person({
      firstName: 'Bob',
      lastName: 'Smith',
    });

    const programmer = Job({
      job: 'programmer',
    });

    const employee = Employee(Bob, programmer);

    expect(employee.firstName).to.equal('Bob');
    expect(employee.lastName).to.equal('Smith');
    expect(employee.job).to.equal('programmer');

    const director = Employee({
      firstName: 'Martha',
      lastName: 'Graham',
      job: 'director',
    });

    const Martha = Person(director);

    expect(Martha.firstName).to.equal('Martha');
    expect(Martha.lastName).to.equal('Graham');
    expect(Martha.job).to.be.undefined;

    const job = Job(director);

    expect(job.firstName).to.be.undefined;
    expect(job.lastName).to.be.undefined;
    expect(job.job).to.equal('director');
  });
});
