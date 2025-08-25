import { useMemo, useState } from 'react';
import isEmpty from 'lodash/isEmpty';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import Button from '../../components/ui/button/Button';
import Pagination from '../../components/pagination/Pagination';
import { IOptionSelect, IQueryParams, ITeam, PERMISSIONS } from '../../types';
// import { useQueryGetTeams } from '../../services';
// import UserFormModal from './components/UserForm';
import PageMeta from '../../components/common/PageMeta';
import Label from '../../components/form/Label';
import Input from '../../components/form/input/InputField';
import RSelect from '../../components/form/form-elements/RSelect';
import TeamTable from './components/TeamTable';
import DeleteTeamModal from './components/DeleteTeamModal';
import TeamForm from './components/TeamForm';
import { useQueryGetTeams } from '@/services';
import { mappingOptionSelect } from '@/shared/utils/mapping';
import AuthorizationWrapper from '@/components/common/AuthorizationWrapper';

type TeamQueryParams = IQueryParams & {
  searchKeyword?: string;
  parentId?: string | null;
};

type FilterEditing = IQueryParams & {
  searchKeyword?: string;
  parentId?: IOptionSelect | null;
};

const defaultFilter = { pageIndex: 0, pageSize: 50 };
const defaultOpenModal = {
  upsert: false,
  delete: false,
};

export default function UserList() {
  const [filter, setFilter] = useState<TeamQueryParams>(defaultFilter);
  const [filterEditing, setFilterEditing] =
    useState<FilterEditing>(defaultFilter);
  const [teamDetail, setTeamDetail] = useState<ITeam | null>(null);
  const [openModal, setOpenModal] = useState<{
    upsert: boolean;
    delete: boolean;
  }>(defaultOpenModal);

  const { data: userData, refetch: refetchUserData } = useQueryGetTeams(filter);
  const { data: userOption, refetch: refetchUserOption } = useQueryGetTeams({
    isParent: true,
  });
  const teamOptions = useMemo(
    () => mappingOptionSelect(userOption?.data || []),
    [userOption?.data]
  );
  const handleEditTeam = (data: ITeam, modalType: string) => {
    setTeamDetail(data);
    setOpenModal({ ...defaultOpenModal, [modalType]: true });
  };

  const handleRefetchData = () => {
    refetchUserData();
    refetchUserOption();
  };

  const handleCloseModal = () => {
    setOpenModal(defaultOpenModal);
    setTeamDetail(null);
  };

  return (
    <>
      <PageMeta title='Quản lý bộ phận' description='Quản lý bộ phận' />
      <div>
        <div className='flex flex-wrap items-center justify-between'>
          <PageBreadcrumb pageTitle='Quản lý bộ phận' />
          <AuthorizationWrapper allowedRoles={PERMISSIONS.CREATE_TEAM}>
            <Button
              className='mb-2'
              onClick={() => {
                setOpenModal(prev => ({ ...prev, upsert: true }));
              }}
            >
              Thêm bộ phận
            </Button>
          </AuthorizationWrapper>
        </div>
        <div className='mb-5 xl:flex items-end gap-2 flex-wrap'>
          <div className='max-xl:pb-2'>
            <Label>Từ khoá</Label>
            <Input
              name='searchKeyword'
              placeholder='Nhập từ khoá'
              value={filterEditing.searchKeyword || ''}
              className='xl:!w-fit !bg-white'
              onChange={e => {
                setFilterEditing(prev => ({
                  ...prev,
                  [e.target.name]: e.target.value,
                }));
              }}
            />
          </div>
          <div className='max-xl:pb-2'>
            <Label>Bộ phận</Label>
            <RSelect
              value={filterEditing.parentId}
              options={teamOptions}
              placeholder='--Chọn bộ phận--'
              onChange={newValue => {
                setFilterEditing(prev => ({
                  ...prev,
                  parentId: newValue as IOptionSelect,
                }));
              }}
              selectClassName='min-w-[190px]'
            />
          </div>
          <div className='flex flex-row gap-2'>
            <Button
              size='sm'
              onClick={() => {
                setFilterEditing({
                  ...defaultFilter,
                  parentId: null,
                  searchKeyword: '',
                });
                setFilter({
                  ...defaultFilter,
                  parentId: null,
                  searchKeyword: '',
                });
              }}
            >
              Cài lại
            </Button>
            <Button
              size='sm'
              onClick={() => {
                setFilter({
                  ...filterEditing,
                  parentId: filterEditing.parentId?.value,
                });
              }}
            >
              Tìm kiếm
            </Button>
          </div>
        </div>
        <div>
          <TeamTable
            team={userData?.data || []}
            handleEditTeam={handleEditTeam}
          />
          <div className='flex justify-end'>
            {!isEmpty(userData?.data) && (
              <Pagination
                page={userData?.pagination?.page as number}
                pageLength={userData?.pagination?.pageSize as number}
                totalRecords={userData?.pagination?.count as number}
                onPageChange={(page, pageLength) => {
                  setFilter({
                    ...filter,
                    pageSize: pageLength,
                    pageIndex: page - 1,
                  });
                }}
              />
            )}
          </div>
        </div>
      </div>
      <TeamForm
        isOpen={openModal.upsert}
        teamDetail={teamDetail}
        handleRefetchData={handleRefetchData}
        closeModal={handleCloseModal}
        teamOptions={teamOptions}
      />
      <DeleteTeamModal
        isOpen={openModal.delete}
        teamDetail={teamDetail}
        handleRefetchData={handleRefetchData}
        closeModal={handleCloseModal}
      />
    </>
  );
}
