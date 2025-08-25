import { useCallback, useMemo, useState } from 'react';
import isEmpty from 'lodash/isEmpty';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import Button from '../../components/ui/button/Button';
import Pagination from '../../components/pagination/Pagination';
import { IBenefit, IQueryParams, PERMISSIONS } from '../../types';
import { useQueryGetBenefit, useQueryGetTeams } from '../../services';
import PageMeta from '../../components/common/PageMeta';
import Filter from './components/Filter';
import { mappingOptionSelect } from '../../shared/utils/mapping';
import BenefitTable from './components/BenefitTable';
import DeleteBenefitModal from './components/DeleteBenefitModal';
import BenefitFormModel from './components/BenefitFormModel';
import NoteModel from './components/NoteModel';
import AuthorizationWrapper from '@/components/common/AuthorizationWrapper';

type BenefitQueryParams = IQueryParams & {
  searchKeyword?: string;
  roles?: string[];
  teamIds?: string[];
  isOfficial?: boolean;
};

const defaultFilter = { pageIndex: 0, pageSize: 50 };
const defaultOpenModal = {
  upsert: false,
  delete: false,
  reset: false,
  changeStatus: false,
  note: false,
};

export default function BenefitList() {
  const [filter, setFilter] = useState<BenefitQueryParams>(defaultFilter);
  const [benefitDetail, setBenefitDetail] = useState<
    IBenefit | null | undefined
  >(null);
  const [openModal, setOpenModal] = useState<{
    upsert: boolean;
    delete: boolean;
    reset: boolean;
    changeStatus: boolean;
    note: boolean;
  }>(defaultOpenModal);

  const { data: userData, refetch } = useQueryGetBenefit(filter);
  const { data: teamData } = useQueryGetTeams();

  const teamOptions = useMemo(
    () => mappingOptionSelect(teamData?.data || []),
    [teamData?.data]
  );

  const handleEditBenefit = (data: IBenefit, modalType: string) => {
    setBenefitDetail(data);
    setOpenModal({ ...defaultOpenModal, [modalType]: true });
  };

  const handleRefetchData = () => {
    refetch();
  };

  const handleCloseModal = () => {
    setOpenModal(defaultOpenModal);
    setBenefitDetail(undefined);
  };

  const handleFilterChange = useCallback((newFilter: BenefitQueryParams) => {
    setFilter(newFilter);
  }, []);

  return (
    <>
      <PageMeta
        title='Quản lý lương & phép'
        description='Quản lý lương & phép'
      />
      <div>
        <div className='flex flex-wrap items-center justify-between'>
          <PageBreadcrumb pageTitle='Quản lý lương & phép' />
          <AuthorizationWrapper allowedRoles={PERMISSIONS.CREATE_BENEFIT}>
            <Button
              onClick={() => {
                setOpenModal(prev => ({ ...prev, upsert: true }));
              }}
              className='mb-2'
            >
              Tạo chính sách lương
            </Button>
          </AuthorizationWrapper>
        </div>
        <Filter
          teamOptions={teamOptions}
          handleFilterChange={handleFilterChange}
        />
        <div>
          <BenefitTable
            benefits={userData?.data || []}
            handleEditBenefit={handleEditBenefit}
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
      <BenefitFormModel
        isOpen={openModal.upsert}
        benefitDetail={benefitDetail}
        teamOptions={teamOptions}
        handleRefetchData={handleRefetchData}
        closeModal={handleCloseModal}
      />
      <NoteModel
        isOpen={openModal.note}
        note={benefitDetail?.note}
        closeModal={handleCloseModal}
      />
      <DeleteBenefitModal
        isOpen={openModal.delete}
        benefitDetail={benefitDetail}
        handleRefetchData={handleRefetchData}
        closeModal={handleCloseModal}
      />
    </>
  );
}
