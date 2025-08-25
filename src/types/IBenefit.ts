import { Omit } from 'lodash';
import { ITeam, UserRole, UserStatus } from './IUser';

export interface IBenefit {
  _id: string;
  name: string;
  role: UserRole;
  teamId: { name: string; _id: string } | null;
  isOfficial: boolean;
  benefits: {
    baseSalary: number;
    paidLeaveDays: number;
    bonus: number;
    hasInsurance: boolean;
    allowance: number;
  };
  note?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateBenefitPayload = Omit<
  ITeam,
  '_id' | 'createdAt' | 'teamId' | 'updatedAt'
> & { teamId: string };
export type UpdateBenefitPayLoad = CreateBenefitPayload & { benefitId: string };

export interface IEmployBenefit {
  actionBy?: {
    username: string;
    _id: string;
  };
  benefits: {
    baseSalary: number;
    paidLeaveDays: number;
    bonus: number;
    hasInsurance: boolean;
    allowance: number;
  };
  _id: string;
  role: string;
  teamId: ITeam;
  isOfficial: boolean;
  isCustomized: boolean;
  templateId: string;
  employeeId: {
    _id: string;
    username: string;
    role: UserRole;
    team: string;
    createdAt: string;
    updatedAt: string;
    benefit: string;
    status: UserStatus;
    fullname?: string;
  };
  createdAt: string;
  updatedAt: string;
}
export type UpdateEmployeeBenefitPayLoad = {
  benefits: {
    baseSalary: number;
    paidLeaveDays: number;
  };
  employeeBenefitId: string;
  note?: string;
};
