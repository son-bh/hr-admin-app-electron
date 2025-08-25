import { API_URL } from '@/shared/constants';
import { request } from '@/shared/utils/request';
import { IPolicy } from '@/types';
import { useMutation, useQuery } from '@tanstack/react-query';

export const getDetailPolicy = (params?: {
  teamId?: string;
}): Promise<{ data: IPolicy }> =>
  request.get(`${API_URL}/policies`, { params });

export const createPolicy = (data: IPolicy) =>
  request.post(`${API_URL}/policies/create`, data);

export const useCreatePolicyMuttion = () =>
  useMutation({ mutationFn: createPolicy });

export const useQueryGetDetailPolicy = (params = {}, options = {}) =>
  useQuery({
    queryKey: ['GET_POLICY', params],
    queryFn: () => getDetailPolicy(params),
    ...options,
  });
