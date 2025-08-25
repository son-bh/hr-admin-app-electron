import { API_URL } from '@/shared/constants';
import { request } from '@/shared/utils/request';
import { IPagination, IQueryParams } from '@/types';
import { IRequestOut } from '@/types/IRequestOut';
import { useMutation, useQuery } from '@tanstack/react-query';

export const getListRequestOut = (
  params?: IQueryParams
): Promise<{ data: Array<IRequestOut>; pagination: IPagination }> =>
  request.get(`${API_URL}/schedule/list-request`, { params });
export const changeStatus = ({
  requestId,
  data,
}: {
  requestId: string;
  data: { status: string };
}) => request.post(`${API_URL}/schedule/approved-request/${requestId}`, data);

export const useQueryGetListRequestOut = (params = {}, options = {}) =>
  useQuery({
    queryKey: ['GET_LIST_REQUEST_OUT', params],
    queryFn: () => getListRequestOut(params),
    ...options,
  });

export const useChangeStatusRequestOutMutation = () =>
  useMutation({ mutationFn: changeStatus });
