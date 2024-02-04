import { Types } from 'mongoose';

export function filterObj(obj, ...allowedFields) {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
}

export function isEqualIds(id1: string | Types.ObjectId, id2: string | Types.ObjectId) {
  return id1 && id2 && id1.toString() === id2.toString();
}
