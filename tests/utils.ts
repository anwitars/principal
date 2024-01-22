import { ObjectId } from "mongodb";

export const withoutObjectId = <T extends { _id: ObjectId }>(obj: T): Omit<T, "_id"> => {
  const { _id: _, ...rest } = obj;
  _;
  return rest;
};
