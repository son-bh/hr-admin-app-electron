import { API_URL } from '@/shared/constants';
import { request } from '@/shared/utils/request';
import { IPagination, IQueryParams } from '@/types';
import {
  AssignMaterialsPayload,
  IDevices,
  Material,
  UpdateMaterialsPayload,
} from '@/types/IDevices';
import { useMutation, useQuery } from '@tanstack/react-query';

export const getDevices = (
  params?: IQueryParams
): Promise<{ data: Array<IDevices>; pagination: IPagination }> =>
  request.get(`${API_URL}/e-materials`, { params });
export const assginMaterials = (data: AssignMaterialsPayload) =>
  request.post(`${API_URL}/e-materials/assign`, data);
export const getdetailMaterials = (
  materialId: string
): Promise<{ data: Material }> =>
  request.get(`${API_URL}/e-materials/${materialId}`);

export const DeleteMaterials = (data: { materialId: string }) =>
  request.post(`${API_URL}/e-materials/delete`, data);
export const UpdateMaterials = (data: UpdateMaterialsPayload) =>
  request.post(`${API_URL}/e-materials/customize`, data);
//mutation
export const useAssignMaterialsMutation = () =>
  useMutation({ mutationFn: assginMaterials });
export const useDeleteMaterialsMutation = () =>
  useMutation({ mutationFn: DeleteMaterials });
export const useUpdateMaterialsMutation = () =>
  useMutation({ mutationFn: UpdateMaterials });
//query
export const useQueryGetDevices = (params = {}, options = {}) =>
  useQuery({
    queryKey: ['GET_DEVICES', params],
    queryFn: () => getDevices(params),
    ...options,
  });
export const useQueryDetailMaterials = (materialId: string) =>
  useQuery({
    queryKey: ['GET_DETAIL_DEVICES', materialId],
    queryFn: () => getdetailMaterials(materialId),
  });
