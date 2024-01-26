import { ObjectId } from "mongodb";

interface MongoObject {
  _id: ObjectId;
}

export type ClassModelInput = {
  className: string;
  datetime: Date;
  studentId: string;
  serverId: string;
};
export type ClassModel = ClassModelInput & MongoObject;
