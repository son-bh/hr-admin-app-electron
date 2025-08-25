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

export interface ITeam {
  _id: string;
  name: string;
  parentId?: null | ITeam;
  createdAt: string;
  updatedAt: string;
}

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
  social: Record<string, any>;
  online: boolean;
  ip: string;
  userAgent: string;
  permissions?: Array<string>;
}
