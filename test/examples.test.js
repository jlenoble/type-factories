import {makeValueType, makeDataType, makeListType} from '../src/type-factories';
import {expect} from 'chai';

describe('Testing README.md examples', function () {
  it('makeValueType', function () {
    const Integer = makeValueType(Number, {
      set (target, key, value) {
        if (key === 'value') {
          target.value = value === undefined ? 0 : Math.trunc(Number(value));
        } else {
          target[key] = value;
        }
        return true;
      },
    });

    expect(Integer(2.4)).to.equal(2);

    const i = new Integer('36.9');
    expect(i + i * 2.5).to.equal(126);  // not 129.15
  });

  it('makeDataType', function () {
    const Person = makeDataType({
      name: String,
      age: Number,
      female: Boolean,
    });

    const person = new Person({
      name: 'John Doe',
      age: '55',
    });

    expect(person.name).to.equal('John Doe');
    expect(person.age).to.equal(55);
    expect(person.female).to.equal(false);

    person.value = {
      name: 'John H. Doe',
      age: 56,
    };

    expect(person.name).to.equal('John H. Doe');
    expect(person.age).to.equal(56);

    person.age = {
      name: 'Patrick Gray',
      age: '10',
    };
    expect(person.name).to.equal('John H. Doe');
    expect(person.age).to.equal(10);
  });

  it('makeListType', function () {
    const Players = makeListType({
      number: Number,
      name: String,
    });

    const players = new Players({
      number: 1,
      name: 'Kasparov',
    }, {
      number: 2,
      name: 'Karpov',
    });

    players.push({
      number: '3',
      name: 'Fischer',
    });

    expect(players.length).to.equal(3);
    expect(players[2].number).to.equal(3); // not '3'
  });
});
