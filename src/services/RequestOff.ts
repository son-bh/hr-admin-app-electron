import { useMutation, useQuery } from '@tanstack/react-query';
import { API_URL } from '../shared/constants/common';
import { request } from '../shared/utils/request';
import type { IPagination, IQueryParams, IRequestOff } from '../types';

export const getListRequestOff = (
  params?: IQueryParams
): Promise<{ data: Array<IRequestOff>; pagination: IPagination }> =>
  request.get(`${API_URL}/schedule/list-request-off`, { params });

export const changeStatus = ({
  requestId,
  data,
}: {
  requestId: string;
  data: { status: string };
}) =>
  request.post(`${API_URL}/schedule/approved-request-off/${requestId}`, data);

export const useQueryGetListRequestOff = (params = {}, options = {}) =>
  useQuery({
    queryKey: ['GET_LIST_REQUEST_OFF', params],
    queryFn: () => getListRequestOff(params),
    ...options,
  });

export const useChangeStatusRequestOffMutation = () =>
  useMutation({ mutationFn: changeStatus });
