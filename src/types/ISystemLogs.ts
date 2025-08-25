import { IShift } from './IShift';
import { IUser } from './IUser';

export interface ISystemLogs {
  _id: string;
  actionType: string;
  refType: string;
  refId: IRefId;
  description: string;
  triggeredBy: ITriggeredBy;
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}

export type ITriggeredBy = Pick<IUser, 'username' | 'role' | '_id'>;
export interface goOutTime {
  _id: string;
  inAt: string;
  outAt: string;
  reason: string;
}
export interface IRefId {
  _id: string;
  date: string;
  shift: IShift;
  employee: IUser;
  createdAt: string;
  updatedAt: string;
  isHoliday: boolean;
  isRequestOff: boolean;
  probationLeaveDays: number;
  probationSalaryPercent: number;
  goOutTime: goOutTime[];
  [key: string]: any;
}
