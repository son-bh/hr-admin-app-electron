import { API_URL } from '@/shared/constants';
import { request } from '@/shared/utils/request';
import {
  CreateWhiteListPayload,
  IPagination,
  IQueryParams,
  IWhiteList,
} from '@/types';
import { useMutation, useQuery } from '@tanstack/react-query';

export const getWhiteList = (
  params?: IQueryParams
): Promise<{ data: Array<IWhiteList>; pagination: IPagination }> =>
  request.get(`${API_URL}/ips`, { params });
export const createWhiteList = (data: CreateWhiteListPayload) =>
  request.post(`${API_URL}/ips`, data);
export const deleteWhiteList = (data: { id: string }) =>
  request.post(`${API_URL}/ips/delete`, data);

export const useQueryGetWhiteLists = (params = {}, options = {}) =>
  useQuery({
    queryKey: ['GET_IPS', params],
    queryFn: () => getWhiteList(params),
    ...options,
  });

export const useCreateWhiteListMutation = () =>
  useMutation({ mutationFn: createWhiteList });
export const useDeleteWhiteListMutation = () =>
  useMutation({ mutationFn: deleteWhiteList });
