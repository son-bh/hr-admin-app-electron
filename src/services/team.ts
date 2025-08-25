import { useMutation } from '@tanstack/react-query';
import { API_URL } from '../shared/constants';
import { request } from '../shared/utils/request';
import { CreateTeamPayload, UpdateTeamPayLoad } from '../types';

// export const getTeams = (
//   params?: TeamQueryParams
// ): Promise<{ data: Array<ITeam>; pagination: IPagination }> =>
//   request.get(`${API_URL}/teams`, { params });

export const createTeam = (data: CreateTeamPayload) =>
  request.post(`${API_URL}/teams`, data);

export const updateTeam = (data: UpdateTeamPayLoad) =>
  request.post(`${API_URL}/teams/update`, data);

export const deleteTeam = (data: { teamId: string }) =>
  request.post(`${API_URL}/teams/delete`, data);

export const useCreateTeamMutation = () =>
  useMutation({ mutationFn: createTeam });
export const useUpdateTeamMutation = () =>
  useMutation({ mutationFn: updateTeam });
export const useDeleteTeamMutation = () =>
  useMutation({ mutationFn: deleteTeam });

// export const useQueryGetTeams = (params = {}, options = {}) =>
//   useQuery({
//     queryKey: ['GET_TEAM', params],
//     queryFn: () => getTeams(params),
//     ...options,
//   });
