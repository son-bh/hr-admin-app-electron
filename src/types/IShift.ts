import { IRequestOff } from './IRequestOff';
import { ITeam, IUser } from './IUser';

export interface ICheckTime {
  checkInTime?: string;
  checkOutTime?: string;
  earlyMinutes?: string;
  lateMinutes?: string;
  noteForCheckIn?: string;
  noteForCheckOut?: string;
}

export interface IDuplicateToken {
  token: string;
  tokenType: string;
  employeeReference: string;
}

export interface IClientToken {
  checkIn: string;
  duplicateToken: Array<IDuplicateToken>;
}

export interface IOverTime {
  overTimeStart?: string;
  overTimeEnd?: string;
  noteForOvertime?: string;
}

export interface IShift {
  _id: string;
  name: string;
  startTime: string;
  endTime: string;
  startBreakTime: string;
  endTimeOff: string;
  scheduleId?: string;
  createdAt: string;
  updatedAt: string;
  requestOff?: IRequestOff;
  clientToken: IClientToken;
  baseSalaryInDay?: number;
}

export type CreateShiftPayload = Pick<
  IShift,
  'name' | 'startTime' | 'endTime' | 'startBreakTime' | 'endTimeOff'
>;

export type UpdateShiftPayLoad = CreateShiftPayload & {
  shiftId: string;
};

export interface ISchedule extends ICheckTime {
  _id?: string;
  date: string;
  shift: Array<IShift & ICheckTime>;
  duplicate?: Array<IShift>;
  scheduleId?: string;
  requestOff: IRequestOff;
  clientToken: IClientToken;
  baseSalaryInDay: number;
  overTimeStart?: string;
  overTimeEnd?: string;
  noteForOvertime?: string;
  isHoliday?: boolean;
  holiday?: {
    name: string;
    description: string;
  };
}

export interface IShiftScheduleEmployee extends Omit<IUser, 'team' | 'teamId'> {
  teamId: string;
  team: ITeam;
}

export interface IShiftSchedule {
  _id?: string;
  employee: IShiftScheduleEmployee;
  schedules: Array<ISchedule>;
}

export interface IShiftScheduleExists {
  date: string;
  data: Array<{ user: IUser; shift: IShift }>;
}

export type CreateShiftSchedulePayload = {
  userIds: Array<string>;
  shiftIds: Array<string>;
  startDate?: string;
  endDate?: string;
  type: string;
  day?: string;
};
