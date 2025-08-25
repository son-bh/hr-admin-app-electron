import { API_URL } from '@/shared/constants';
import { request } from '@/shared/utils/request';
import {
  CalculateSalaryPayload,
  IPagination,
  IQueryParams,
  ISalaryRecord,
} from '@/types';
import { useMutation, useQuery } from '@tanstack/react-query';

export const getSalaryInMonth = (
  params?: IQueryParams & {
    searchKeyword?: string;
    month?: string;
    year?: string;
  }
): Promise<{ data: Array<ISalaryRecord>; pagination: IPagination }> =>
  request.get(`${API_URL}/monthly-payroll`, { params });
export const calculateSalaryInMonth = (data: CalculateSalaryPayload) =>
  request.post(`${API_URL}/monthly-payroll/calculate`, data);
export const calculateSalaryAllInMonth = (data: CalculateSalaryPayload) =>
  request.post(`${API_URL}/monthly-payroll/calculate-all`, data);
export const changeSalaryRecordStatus = (data: {
  monthlyPayrollId: string;
  status: string;
}) => request.post(`${API_URL}/monthly-payroll/change-status`, data);
export const sendPayslip = (data: { monthlyPayrollId: string }) =>
  request.post(`${API_URL}/monthly-payroll/send`, data);

export const useQueryGetSalaryInMonth = (params = {}, options = {}) =>
  useQuery({
    queryKey: ['GET_SALARY_IN_MONTH', params],
    queryFn: () => getSalaryInMonth(params),
    ...options,
  });

export const useCalculateSalaryInMonthMutation = () =>
  useMutation({ mutationFn: calculateSalaryInMonth });
export const useCalculateSalaryAllInMonthMutation = () =>
  useMutation({ mutationFn: calculateSalaryAllInMonth });
export const useChangeSalaryStatusMutation = () =>
  useMutation({ mutationFn: changeSalaryRecordStatus });
export const useSendPayslipMutation = () =>
  useMutation({ mutationFn: sendPayslip });
