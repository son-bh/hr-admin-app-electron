import { useQuery } from '@tanstack/react-query';
import { API_URL } from '../shared/constants/common';
import { request } from '../shared/utils/request';
import type { IPagination, IQueryParams, ISystemLogs } from '../types';

export const getListSystemLogs = (
  params?: IQueryParams
): Promise<{ data: Array<ISystemLogs>; pagination: IPagination }> =>
  request.get(`${API_URL}/system-logs`, { params });

export const useQueryGetListSystemLogs = (params = {}, options = {}) =>
  useQuery({
    queryKey: ['GET_LIST_SYSTEM_LOGS', params],
    queryFn: () => getListSystemLogs(params),
    ...options,
  });
