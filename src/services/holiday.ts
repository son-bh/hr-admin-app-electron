import { API_URL } from '@/shared/constants';
import { request } from '@/shared/utils/request';
import { IHoliday, IHolidayPayload, IPagination, IQueryParams } from '@/types';
import { useMutation, useQuery } from '@tanstack/react-query';

export const getHolidayList = (
  params?: IQueryParams
): Promise<{ data: Array<IHoliday>; pagination: IPagination }> =>
  request.get(`${API_URL}/holiday/get-list`, { params });
export const createHoliday = (data: IHolidayPayload) =>
  request.post(`${API_URL}/holiday/create`, data);
export const updateHoliday = (data: IHolidayPayload & { holidayId: string }) =>
  request.post(`${API_URL}/holiday/update`, data);
export const deleteHoliday = (params: { id: string }) =>
  request.post(`${API_URL}/holiday/delete/${params.id}`);
export const useQueryGetHolidayLists = (params = {}, options = {}) =>
  useQuery({
    queryKey: ['GET_HOLODAY_LIST', params],
    queryFn: () => getHolidayList(params),
    ...options,
  });

export const useCreateHolidayMutation = () =>
  useMutation({ mutationFn: createHoliday });
export const useDeleteHolidayMutation = () =>
  useMutation({ mutationFn: deleteHoliday });
export const useUpdateHolidayMutation = () =>
  useMutation({ mutationFn: updateHoliday });
