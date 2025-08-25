import { API_URL } from '@/shared/constants';
import { request } from '@/shared/utils/request';
import {
  IEmployBenefit,
  IPagination,
  IQueryParams,
  UpdateEmployeeBenefitPayLoad,
} from '@/types';
import { useMutation, useQuery } from '@tanstack/react-query';

type EmployeeBenefitQueryParams = IQueryParams & {
  searchKeyword?: string;
  role?: string;
  teamId?: string;
  isOfficial?: boolean;
};

export const getEmployeeBenefit = (
  params?: EmployeeBenefitQueryParams
): Promise<{ data: Array<IEmployBenefit>; pagination: IPagination }> =>
  request.get(`${API_URL}/e-benefits`, { params });

export const createEmployeeBenefit = (data: {
  employeeIds?: string[];
  // templateId: string;
}): Promise<{ successCount: number }> =>
  request.post(`${API_URL}/e-benefits/assign-all`, data);
export const updateEmployeeBenefit = (data: UpdateEmployeeBenefitPayLoad) =>
  request.post(`${API_URL}/e-benefits/customize`, data);
export const deleteEmployeeBenefit = (data: { benefitId: string }) =>
  request.post(`${API_URL}/e-benefits/delete`, data);
export const exportEmployeeBenefitTemplate = (
  data: any
): Promise<Blob | MediaSource> =>
  request.post(`${API_URL}/e-benefits/export-template`, data, {
    responseType: 'blob',
  });

export const useCreateEmployeeBenefitMutation = () =>
  useMutation({ mutationFn: createEmployeeBenefit });
export const useUpdateEmployeeBenefitMutation = () =>
  useMutation({ mutationFn: updateEmployeeBenefit });
export const useDeleteEmployeeBenefitMutation = () =>
  useMutation({ mutationFn: deleteEmployeeBenefit });

export const useExportEmployeeBenefitTemplateMutation = () =>
  useMutation({ mutationFn: exportEmployeeBenefitTemplate });

export const useQueryGetEmployeeBenefit = (params = {}, options = {}) =>
  useQuery({
    queryKey: ['GET_EMPLOYEE_BENEFIT', params],
    queryFn: () => getEmployeeBenefit(params),
    ...options,
  });
