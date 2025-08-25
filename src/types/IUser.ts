import { IEmployBenefit } from '@/types';
import { IObjectLiteral } from './ICommon';
import { ISchedule } from './IShift';
import { Material } from './IDevices';

export type UserRole =
  | 'BOSS'
  | 'HIGH_MANAGER'
  | 'MANAGER'
  | 'LEADER'
  | 'SUPLEAD'
  | 'STAFF'
  | 'ASSISTANT'
  | 'SUPER_ADMIN'
  | 'ADMIN';

export type Team =
  | 'HR'
  | 'HC'
  | 'SALES'
  | 'SALES_ONLINE'
  | 'CRM'
  | 'TELESALES'
  | 'CSKH'
  | 'RISK'
  | 'PAYMENT'
  | 'SEO'
  | 'SEO_ONLINE'
  | 'IT_SEO';

export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'BLOCK';

export type SalaryStatus = 'DRAFT' | 'CONFIRMED' | 'PAID';

export interface ITeam {
  _id: string;
  name: string;
  parentId?: null | ITeam;
  createdAt: string;
  updatedAt: string;
}

export type CreateTeamPayload = Pick<ITeam, 'name'> & { parentId?: string };
export type UpdateTeamPayLoad = CreateTeamPayload & { teamId: string };

export interface IUser {
  _id: string;
  email: string;
  username: string;
  role: UserRole;
  team: string;
  teamId: ITeam;
  phone: string;
  fullname: string;
  status: UserStatus;
  salary: string | number;
  onboardAt: string;
  createdAt: string;
  updatedAt: string;
  birthday: string;
  officialAt: string;
  isOfficial: boolean;
  gender: string;
  social: IObjectLiteral;
  online: boolean;
  ip: string;
  userAgent: string;
  permissions?: Array<string>;
}

export type CreateUserPayload = Pick<IUser, 'email' | 'role'> & {
  teamId: string;
};
export type UpdateUserPayLoad = CreateUserPayload &
  Partial<
    Pick<
      IUser,
      | 'phone'
      | 'fullname'
      | 'username'
      | 'onboardAt'
      | 'birthday'
      | 'officialAt'
    >
  >;

export interface IBonus {
  name: string;
  amount: number;
}

export interface IPenalty {
  name: string;
  amount: number;
}

export interface ISalaryRecord {
  _id: string;
  employeeId: string;
  benefitId: string;
  schedules: Array<ISchedule>;
  month: number;
  year: number;
  workingDays: number;
  paidLeaveDays: number;
  unPaidLeaveDays: number;
  lateMinutes: number;
  lateCount: number;
  earlyMinutes: number;
  earlyLeaveCount: number;
  overtimeCount: number;
  overtimeBonus: number;
  bonus: number;
  allowance: number;
  penalty: number;
  insuranceDeduction: number;
  totalSalary: number;
  status: SalaryStatus;
  bonusDetails: Array<IBonus>;
  penaltyDetails: Array<IPenalty>;
  baseSalary: number;
  mainSalary: number;
  actionBy: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  employee: Omit<IUser, 'team' | 'teamId'> & { teamId: string; team: ITeam };
  role: string;
  team: string;
  isSentToEmployee: boolean;
  reason: string;
}

export type CalculateSalaryPayload = {
  employeeIds?: Array<string>;
  month: string;
  year: string;
};

export interface IWorkingDays {
  totalWorkDays: number;
  lateCount: number;
  earlyLeaveCount: number;
  earlyBreakCount: number;
}

export interface IRewardsAndPenalties {
  reward: number;
  penalty: number;
  bonusBirthday: boolean;
}

export interface IUserDetail {
  employee: IUser;
  employeeBenefit: IEmployBenefit;
  employeeMaterial: Array<Material>;
  workingDays: IWorkingDays;
  rewardsAndPenalties: IRewardsAndPenalties;
}
