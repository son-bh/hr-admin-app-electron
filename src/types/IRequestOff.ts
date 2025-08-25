import { IShift } from './IShift';
import { IUser } from './IUser';
export type IEmployee = Pick<IUser, '_id' | 'username' | 'email' | 'role'>;
interface schedule {
  _id?: string;
  date: string;
  shift: IShift;
}
export interface IRequestOff {
  _id: string;
  reason: string;
  typeOff: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  approvedBy: IEmployee;
  note: string;
  schedule: schedule;
  employee: IEmployee;
}
