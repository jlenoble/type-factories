# type-factories
Lots of custom types for robustness and predictability

## Content

* [Another type factory?](#another-type-factory)
* [Available factories](#available-factories)
  * [makeValueType(BaseType, handler)](#makevaluetypebasetype-handler)
  * [makeDataType(Types)](#makedatatypetypes)
  * [makeListType(Type, handler)](#makelisttypetype-handler)
* [License](#license)

## Another type library?

There is so much boiler plate when handling data: Validating, converting, looping on attributes, plucking, dealing with undefined, and so on... This library provides *predictable* type factories. The capability of setting and getting data is removed from the user and instead data is always preprocessed on setting. Standard methods such as toString, valueOf, toPrecision, toExponential... are defined when needed so that console calls and implicit conversions work as expected (for the most part).

## Available factories

### ```makeValueType(BaseType, handler)```

Types generated from this factory are scalar/1D in nature. They handle numbers and strings for the most part. The handler parameters allows to set conditions
on teh contained data.

```js
import {makeValueType} from 'type-factories';

const Integer = makeValueType(Number, {
  set (target, key, value) {
    if (key === 'value') {
      target.value = value === undefined ? 0 : Math.trunc(Number(value));
    } else {
      target[key] = value;
    }
    return true;
  }
});

Integer(2.4) === 2; // true

const i = new Integer('36.9');
i + i * 2.5 === 126;  // not 129.15
```

### ```makeDataType(Types)```

Types generated from this factory are a mixte bag of Value types. They are objects with strongly typed public properties.

```js
import {makeDataType} from 'type-factories';

const Person = makeDataType({
  name: String,
  age: Number,
  female: Boolean
});

const person = new Person({
  name: 'John Doe',
  age: '55'
});

person.name === 'John Doe'; // true
person.age === 55; // true
person.female === false; // true

person.value = {
  name: 'John H. Doe',
  age: 56
};

person.name === 'John H. Doe'; // true
person.age === 56; // true

person.age = {
  name: 'Patrick Gray',
  age: '10',
};
person.name === 'John H. Doe'; // not 'Patrick Gray'
person.age === 10; // true
```

### ```makeListType(Type, handler)```

Types from this factory are vectorial/multiD in nature. They handle list of same Value type instances. The handler helps override some default behaviors

```js
import {makeListType} from 'type-factories';

const Players = makeListType({
  number: Number,
  name: String
});

const players = new Players({
  number: 1,
  name: 'Kasparov'
},
{
  number: 2,
  name: 'Karpov'
});

players.push({
  number: '3',
  name: 'Fischer'
});

players.length === 3;
players[2].number === 3; // not '3'
```

## License

type-factories is [MIT licensed](./LICENSE).

© 2017 [Jason Lenoble](mailto:jason.lenoble@gmail.com)
