import RootType from './root';
import ValueType from './value';
import UIDType from './uid';
import NumberType from './number';
import PrecisionType from './precision';

export {RootType, ValueType, UIDType, NumberType, PrecisionType};

export const Float = NumberType(parseFloat);
export const Integer = NumberType(parseInt);
