# type-factories
Lots of custom types for robustness and predictability

## Content

* [Another type factory?](#another-type-factory)
* [Available factories](#available-factories)
  * [NumberType](#numbertype)
  * [PrecisionType](#precisiontype)
  * [StringType](#stringtype)
  * [UIDType](#uidtype)
  * [ObjectType](#objecttype)
* [License](#license)

## Another type library?

There is so much boiler plate when handling data: Validating, converting, looping on attributes, plucking, dealing with undefined, and so on... This library provides *predictable* type factories. The capability of setting and getting data is removed from the user and instead data is always preprocessed on setting. Standard methods such as toString, valueOf, toPrecision, toExponential... are defined when needed so that console calls and implicit conversions work as expected (for the most part).

## Available factories

### ValueType

A generic factory used by number and string types.

```js
import {ValueType} from 'type-factories';

const Value = ValueType();
const s = Value('foo');
const d = Value(20);

s.value; // 'foo'
d.value; // 20

s.value += 'bar';
s.value; // 'foobar'

d.value *= 5;
d.value; // 100

s.value += d; // Implicit conversion to base type
s.value; // 'foobar100'
```

### NumberType

This factory requires a function argument that returns a number.

```js
import {NumberType} from 'type-factories';

const Func = NumberType(function (x) {
  const _x = parseFloat(x, 10);
  return _x * _x + 2;
});

const a = Func(0);
const b = Func(1);
const c = Func(2);

a.value; // 2
b.value; // 3
c.value; // 6

c.value = a + b; // Implicit conversions and computation
c.value; // 27 === (2+3)**2 + 2
```

### PrecisionType

This factory requires an integer argument between 1 and 21;

```js
import {PrecisionType} from 'type-factories';

const Approx = PrecisionType(6);

+Approx(123456789); // 123457000 (rounded to closest)
+Approx(.987654321); // .987654

+Approx(Approx(34e3) + Approx(-34e-3)); // 34000
```

### StringType

```js
import {StringType} from 'type-factories';

const Str = StringType();

Str(100) + Str(10); // '10010'
```

### UIDType

This factory can take a string as argument to represent a prefix. Uids start
at 1 and are indepent types.

```js
import {UIDType} from 'type-factories';

const UID = UIDType('id');
const CID = UIDType('c');

UID().value; // 'id1'
UID().value; // 'id2'
CID().value; // 'c1'
UID().value; // 'id3'
```

### ObjectType

This type factory make the other type factories above useful! Object types can be used very flexibly to set other Object types. Their attributes are always what they were set to be. See the following example.

```js
import {ObjectType} from 'type-factories';

const Person = ObjectType({
  firstName: String,
  lastName: String
});

const Job = ObjectType({
  job: String
});

const Employee = ObjectType({
  firstName: String,
  lastName: String,
  job: String
});

const Bob = Person({
  firstName: 'Bob',
  lastName: 'Smith'
});

const programmer = Job({
  job: 'programmer'
});

const employee = Employee(Bob, programmer);

employee.firstName.toString(); // 'Bob'
employee.lastName.toString(); // 'Smith'
employee.job.toString(); // 'programmer'

const director = Employee({
  firstName: 'Martha',
  lastName: 'Graham',
  job: 'director'
});

const Martha = Person(director);

Martha.firstName.toString(); // 'Martha'
Martha.lastName.toString(); // 'Graham'
Martha.job; // undefined

const job = Job(director);

job.firstName; // undefined
job.lastName; // undefined
job.job.toString(); // 'director'
```

## License

type-factories is [MIT licensed](./LICENSE).

© 2017 [Jason Lenoble](mailto:jason.lenoble@gmail.com)
