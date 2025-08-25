import { IShift } from './IShift';
import { IUser } from './IUser';

export type IEmployee = Pick<IUser, '_id' | 'username' | 'email' | 'role'>;

export interface IRequestOut {
  _id: string;
  date: string;
  type: string;
  from: string;
  minutes: number;
  reason: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  employee: IEmployee;
  approvedBy: IEmployee;
  schedule: schedule;
  note: string;
}

// export interface IEmployeeRequestOut {
//   _id: string;
//   username: string;
//   role: string;
// }
interface schedule {
  _id?: string;
  date: string;
  shift: IShift;
}

// export interface IShiftRequestOut {
//   _id: string;
//   name: string;
//   startTime: string;
//   endTime: string;
// }
