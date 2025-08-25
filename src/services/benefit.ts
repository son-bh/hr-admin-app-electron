import { API_URL } from '@/shared/constants';
import { request } from '@/shared/utils/request';
import {
  CreateBenefitPayload,
  IBenefit,
  IPagination,
  IQueryParams,
  UpdateBenefitPayLoad,
} from '@/types';
import { useMutation, useQuery } from '@tanstack/react-query';

export const getBenefit = (
  params?: IQueryParams & { teamIds?: string[]; roles?: string[] }
): Promise<{ data: Array<IBenefit>; pagination: IPagination }> =>
  request.get(`${API_URL}/benefits`, { params });

export const createBenefit = (data: CreateBenefitPayload) =>
  request.post(`${API_URL}/benefits`, data);

export const updateBenefit = (data: UpdateBenefitPayLoad) =>
  request.post(`${API_URL}/benefits/update`, data);

export const deleteBenefit = (data: { benefitId: string }) =>
  request.post(`${API_URL}/benefits/delete`, data);

export const useCreateBenefitMutation = () =>
  useMutation({ mutationFn: createBenefit });
export const useUpdateBenefitMutation = () =>
  useMutation({ mutationFn: updateBenefit });
export const useDeleteBenefitMutation = () =>
  useMutation({ mutationFn: deleteBenefit });

export const useQueryGetBenefit = (params = {}, options = {}) =>
  useQuery({
    queryKey: ['GET_BENEFIT', params],
    queryFn: () => getBenefit(params),
    ...options,
  });
