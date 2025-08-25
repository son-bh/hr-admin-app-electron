export interface IPolicy {
  name: string;
  description: string;
  rewards: IRewards;
  penalties: IPenalties;
  probationLeaveDays: number;
  probationSalaryPercent: number;
}
export interface IRewards {
  birthday: number;
  overtimeBonus: number;
  performanceBonus: number;
  other?: Array<IOtherReward> | null;
}

export interface IOtherReward {
  name: string;
  amount: number;
}

export interface IPenalties {
  late: number;
  earlyLeave: number;
  overBreak: number;
}
