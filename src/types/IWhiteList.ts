import { IUser } from './IUser';

export interface IWhiteList {
  _id: string;
  name: string;
  ip: string;
  createdAt: string;
  updatedAt: string;
  actionBy: actionBy;
}

export type CreateWhiteListPayload = Pick<IWhiteList, 'name' | 'ip'>;
export type actionBy = Pick<IUser, 'username' | '_id'>;
