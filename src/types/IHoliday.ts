import { IUser } from '.';

export interface IHoliday {
  _id: string;
  name: string;
  date: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  createdBy: createdBy;
}

export type IHolidayPayload = Pick<IHoliday, 'name' | 'date' | 'description'>;
type createdBy = Pick<IUser, 'username' | '_id'>;
