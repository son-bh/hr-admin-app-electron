import { API_URL } from '@/shared/constants';
import { request } from '@/shared/utils/request';
import {
  CreateShiftPayload,
  CreateShiftSchedulePayload,
  IPagination,
  IQueryParams,
  IShift,
  IShiftSchedule,
  IShiftScheduleExists,
  UpdateShiftPayLoad,
} from '@/types';
import { useMutation, useQuery } from '@tanstack/react-query';

export const getShifts = (
  params?: IQueryParams
): Promise<{ data: Array<IShift>; pagination: IPagination }> =>
  request.get(`${API_URL}/shifts`, { params });
export const createShift = (data: CreateShiftPayload) =>
  request.post(`${API_URL}/shifts/create`, data);
export const updateShift = (data: UpdateShiftPayLoad) =>
  request.post(`${API_URL}/shifts/update`, data);
export const deleteShift = (data: { shiftId: string }) =>
  request.post(`${API_URL}/shifts/delete/${data.shiftId}`, undefined);
export const allocationShiftEmployee = (
  data: CreateShiftSchedulePayload
): Promise<{
  conflicts: Array<IShiftScheduleExists>;
  data: Array<{ shift: string; _id: string }>;
}> => request.post(`${API_URL}/schedule/create`, data);
export const updateShiftEmployee = (data: {
  scheduleId: string;
  shiftId: string;
}): Promise<{ data: IShiftSchedule }> =>
  request.post(`${API_URL}/schedule/update`, data);
export const getShiftScheduleByEmployee = (params?: {
  userIds: Array<string>;
  startDate: string;
  endDate: string;
}): Promise<{
  data: Array<IShiftSchedule>;
  conflicts: Array<IShiftScheduleExists>;
}> => request.get(`${API_URL}/schedule/by-users`, { params });
export const getShiftScheduleByRange = (params?: {
  userIds?: Array<string>;
  startDate: string;
  endDate?: string;
}): Promise<{
  data: Array<IShiftSchedule>;
}> => request.get(`${API_URL}/schedule/by-range-date`, { params });
export const deleteShiftEmployee = (data: { scheduleId: string }) =>
  request.post(`${API_URL}/schedule/delete/${data.scheduleId}`, undefined);
export const exportShiftSchedule = (data: any): Promise<Blob | MediaSource> =>
  request.post(`${API_URL}/schedule/by-range-date/export`, data, {
    responseType: 'blob',
  });
export const setOverTime = (data: {
  scheduleId: string;
  overTimeStart: string;
  overTimeEnd: string;
  noteForOvertime?: string;
}) => request.post(`${API_URL}/schedule/set-overtime`, data);

export const useQueryGetShifts = (params = {}, options = {}) =>
  useQuery({
    queryKey: ['GET_SHIFTS', params],
    queryFn: () => getShifts(params),
    ...options,
  });
export const useQueryShiftScheduleByRange = (
  params: {
    userIds?: Array<string>;
    startDate: string;
    endDate?: string;
  },
  options = {}
) =>
  useQuery({
    queryKey: ['GET_SHIFT_SCHEDULE_BY_RANGE', params],
    queryFn: () => getShiftScheduleByRange(params),
    ...options,
  });

export const useCreateShiftMutation = () =>
  useMutation({ mutationFn: createShift });
export const useUpdateShiftMutation = () =>
  useMutation({ mutationFn: updateShift });
export const useDeleteShiftMutation = () =>
  useMutation({ mutationFn: deleteShift });
export const useAllocationShiftEmployeeMutation = () =>
  useMutation({ mutationFn: allocationShiftEmployee });
export const useGetShiftScheduleByEmployeeMutation = () =>
  useMutation({
    mutationFn: (params: {
      userIds: Array<string>;
      startDate: string;
      endDate: string;
    }) => getShiftScheduleByEmployee(params),
  });
export const useDeleteShiftEmployeeMutation = () =>
  useMutation({ mutationFn: deleteShiftEmployee });
export const useUpdateShiftEmployeeMutation = () =>
  useMutation({ mutationFn: updateShiftEmployee });
export const useExportShiftScheduleMutation = () =>
  useMutation({ mutationFn: exportShiftSchedule });
export const useSetOverTimeMutation = () =>
  useMutation({ mutationFn: setOverTime });
