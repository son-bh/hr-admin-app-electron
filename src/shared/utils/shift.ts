import {
  IOptionSelect,
  ISchedule,
  IShift,
  IShiftSchedule,
  IShiftScheduleExists,
} from '@/types';
import { endOfWeek, format, startOfWeek } from 'date-fns';

export const mergeShiftScheduleEmployee = (schedules: Array<ISchedule>) => {
  const grouped = new Map();

  schedules.forEach(item => {
    const date = format(item.date, 'yyyy-MM-dd');
    const shiftDetail = {
      ...item.shift,
      scheduleId: item._id,
      checkInTime: item.checkInTime,
      checkOutTime: item.checkOutTime,
      earlyMinutes: item.earlyMinutes,
      lateMinutes: item.lateMinutes,
      noteForCheckIn: item.noteForCheckIn,
      noteForCheckOut: item.noteForCheckOut,
      requestOff: item.requestOff,
      clientToken: item.clientToken,
      baseSalaryInDay: item.baseSalaryInDay,
    };

    if (!grouped.has(date)) {
      grouped.set(date, {
        date: date,
        scheduleId: item._id,
        overTimeEnd: item.overTimeEnd,
        overTimeStart: item.overTimeStart,
        noteForOvertime: item.noteForOvertime,
        isHoliday: item.isHoliday,
        holiday: item.holiday,
        shift: [{ ...shiftDetail }],
      });
    } else {
      grouped.get(date).shift.push({ ...shiftDetail });
    }
  });

  return Array.from(grouped.values());
};

export const findEmployeeNotExists = (
  currentEmployees: Array<IOptionSelect>,
  newEmployees: Array<IOptionSelect>
) => {
  const set1 = new Set(currentEmployees.map(item => item.value));
  const set2 = new Set(newEmployees.map(item => item.value));

  const uniqueFrom1 = currentEmployees.filter(item => !set2.has(item.value));
  const uniqueFrom2 = newEmployees.filter(item => !set1.has(item.value));

  return [...uniqueFrom1, ...uniqueFrom2];
};

export const mappingEmployeeOptions = <T extends Record<string, any>>(
  data: Array<T>
): Array<IOptionSelect> | [] =>
  data?.map(item => ({
    label: `${item?.fullname ? `${item?.fullname} - ` : ''}${item?.username}`,
    value: item._id,
  }));

export const mappingShiftOptions = <T extends Record<string, any>>(
  data: Array<T>
): Array<IOptionSelect> | [] =>
  data?.map(item => ({
    label: `${item?.name}: ${item?.startTime} - ${item?.endTime}`,
    value: item._id,
  }));

export const mappingShiftScheduleExists = (
  currentSchedule: Array<IShiftSchedule>,
  duplicateSchedule: Array<IShiftScheduleExists>
): Array<IShiftSchedule> => {
  // Create a lookup map for duplicate schedules by date
  const duplicateMap = duplicateSchedule.reduce(
    (acc, { date, data }) => {
      acc[date] = data.reduce(
        (userAcc, { user, shift }) => {
          // Store shifts by username for fast access
          userAcc[user.username] = userAcc[user.username] || [];
          userAcc[user.username].push(shift);
          return userAcc;
        },
        {} as Record<string, IShift[]>
      );
      return acc;
    },
    {} as Record<string, Record<string, IShift[]>>
  );

  return currentSchedule.map(item => ({
    ...item,
    schedules: item.schedules.map(scheduleItem => {
      const userShifts =
        duplicateMap[scheduleItem.date]?.[item.employee.username];

      return {
        ...scheduleItem,
        duplicate: userShifts || [],
      };
    }),
  }));
};

export const getCurrentWeek = () => {
  const currentDate = new Date();

  const startDate = startOfWeek(currentDate, { weekStartsOn: 1 });
  const endDate = endOfWeek(currentDate, { weekStartsOn: 1 });

  return { startDate, endDate };
};
