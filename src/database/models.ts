import { ObjectId } from "mongodb";

interface MongoObject {
  _id: ObjectId;
}

export type ClassInputModel = {
  className: string;
  datetime: Date;
  studentId: string;
  serverId: string;
};
export type ClassModel = ClassInputModel & MongoObject;
