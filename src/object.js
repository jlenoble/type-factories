import RootType from './root';
import {Float} from './number';
import {Text} from './string';
import {error} from 'explanation';

export default function ObjectType (propTypes, prototype, descriptors, symbol) {
  const _props = Symbol();
  const _propTypes = Object.assign({}, propTypes);

  Object.keys(_propTypes).forEach(key => {
    const Type = _propTypes[key];

    switch (Type) {
    case Number:
      _propTypes[key] = Float;
      break;

    case String:
      _propTypes[key] = Text;
      break;

    default:
      const t = Type();

      if (!t.isValueType) {
        error({
          message: 'Not a Value',
          explain: [
            `Type '${
              Type.name}' is not a Value type, nor can it be casted to one`,
          ],
        });
      }
    }
  });

  const _prototype = Object.assign({
    initialize (...props) {
      this[_props] = {};

      Object.keys(_propTypes).forEach(key => {
        this[_props][key] = _propTypes[key]();
      });

      props.forEach(prop => {
        this.props = prop;
      });
    },
  }, prototype);

  const _descriptors = {
    props: {
      set (props) {
        Object.keys(_propTypes).forEach(key => {
          if (key in props) {
            this[_props][key].value = props[key];
          }
        });
      },
    },
  };

  function makeDescriptor (key) {
    return {
      get () {
        return this[_props][key].value;
      },
      set (props) {
        this[_props][key].value = props && props[key] !== undefined ?
          props[key] : props;
      },
    };
  }

  Object.keys(_propTypes).forEach(key => {
    _descriptors[key] = makeDescriptor(key);
  });

  Object.assign(_descriptors, descriptors);

  const Type = RootType(_prototype, _descriptors);
  Object.defineProperty(Type, 'name', {value: 'Object (derived from Root)'});

  return Type;
}
