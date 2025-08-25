/* eslint-disable @typescript-eslint/no-explicit-any */
import { format } from 'date-fns';
import { IOptionSelect, ISchedule } from '../../types';
import { USER_ROLE } from '@/configs';

export const mappingOptionSelect = <T extends Record<string, any>>(
  data: Array<T>,
  labelKey: string = 'name',
  valueKey: string = '_id'
): Array<IOptionSelect> | [] =>
  data?.map(item => ({
    label: String(item?.[labelKey] ?? ''),
    value: String(item?.[valueKey] ?? ''),
  }));

export const mappingOptionEmployeeBenefit = <T extends Record<string, any>>(
  data: Array<T>,
  labelKey: string = 'name',
  valueKey: string = '_id',
  roleKey: string = 'role',
  teamIdKey: string = 'teamId',
  isOfficial: string = 'isOfficial'
): Array<IOptionSelect> | [] =>
  data?.map(item => ({
    label: `${item?.[labelKey] || ''}-${USER_ROLE[item?.[roleKey] as keyof typeof USER_ROLE] || ''}${item?.[teamIdKey]?.name ? '-' + item?.[teamIdKey]?.name : ''}-${item?.[isOfficial] ? 'Chính thức' : 'Thử việc'}`,
    value: String(item?.[valueKey] ?? ''),
  }));

export const mappingEmployeeShiftSchedule = (
  schedule: Array<ISchedule>,
  dateRange: Array<Date | string>
) => {
  const mappingSchedule = new Map(
    [...schedule].map((item: any) => [item.date, item])
  );

  const result = dateRange.map(
    date =>
      mappingSchedule.get(format(date, 'yyyy-MM-dd')) || {
        date: format(date, 'yyyy-MM-dd'),
        shift: [],
      }
  );

  return result;
};
