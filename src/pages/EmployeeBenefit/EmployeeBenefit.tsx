import { useCallback, useMemo, useState } from 'react';
import isEmpty from 'lodash/isEmpty';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import Button from '../../components/ui/button/Button';
import Pagination from '../../components/pagination/Pagination';
import { IEmployBenefit, IQueryParams } from '../../types';
import { useQueryGetTeams } from '../../services';
import PageMeta from '../../components/common/PageMeta';
import Filter from './components/Filter';
import { mappingOptionSelect } from '../../shared/utils/mapping';
// import BenefitFormModel from './components/BenefitFormModel';
import { useQueryGetEmployeeBenefit } from '@/services/employeeBenefit';
import DeleteEmployeeBenefitModal from './components/DeleteEmployBenefit';
import EmployeeBenefitTable from './components/EmployeeBenefitTable';
import CreateEmployBenefit from './components/CreateEmployBenefit';
import EditEmployBenefit from './components/EditEmployBenefit';
import DowloadFileBenefit from './components/DownloadBenefit';

type EmployeeBenefitQueryParams = IQueryParams & {
  searchKeyword?: string;
  roles?: string[];
  teamIds?: string[];
  isOfficial?: boolean;
};

const defaultFilter = { pageIndex: 0, pageSize: 50 };
const defaultOpenModal = {
  upsert: false,
  delete: false,
  block: false,
  download: false,
};

export default function EmployeeBenefit() {
  const [filter, setFilter] =
    useState<EmployeeBenefitQueryParams>(defaultFilter);
  const [employeeBenefitDetail, setEmployeeBenefitDetail] =
    useState<IEmployBenefit | null>(null);
  const [openModal, setOpenModal] = useState<{
    upsert: boolean;
    delete: boolean;
    block: boolean;
    download: boolean;
  }>(defaultOpenModal);

  const { data: userData, refetch } = useQueryGetEmployeeBenefit(filter);
  const { data: teamData } = useQueryGetTeams();

  const teamOptions = useMemo(
    () => mappingOptionSelect(teamData?.data || []),
    [teamData?.data]
  );

  const handleEditEmployeeBenefit = (
    data: IEmployBenefit,
    modalType: string
  ) => {
    setEmployeeBenefitDetail(data);
    setOpenModal({ ...defaultOpenModal, [modalType]: true });
  };
  const handleEditAfterCreate = async (
    employeeId: string,
    modalType: string
  ) => {
    const result = await refetch();
    if (result.data) {
      const employeeBenefit =
        result?.data?.data?.find(item => item.employeeId._id === employeeId) ||
        null;
      setEmployeeBenefitDetail(employeeBenefit);
      setOpenModal({ ...defaultOpenModal, [modalType]: true });
    }
  };

  const handleRefetchData = () => {
    refetch();
  };

  const handleCloseModal = () => {
    setOpenModal(defaultOpenModal);
    setEmployeeBenefitDetail(null);
  };

  const handleFilterChange = useCallback(
    (newFilter: EmployeeBenefitQueryParams) => {
      setFilter(newFilter);
    },
    []
  );

  return (
    <>
      <PageMeta title='Cài đặt lương' description='Cài đặt lương' />
      <div>
        <div className='flex flex-wrap items-center justify-between'>
          <PageBreadcrumb pageTitle='Cài đặt lương' />
          <div className='grid grid-cols-2 gap-2'>
            <Button
              onClick={() => {
                setOpenModal(prev => ({ ...prev, download: true }));
              }}
              className='mb-2'
            >
              Xuất mẫu lương nhân viên
            </Button>
            <Button
              onClick={() => {
                setOpenModal(prev => ({ ...prev, upsert: true }));
              }}
              className='mb-2'
            >
              Tạo lương cho nhân viên
            </Button>
          </div>
        </div>
        <Filter
          teamOptions={teamOptions}
          handleFilterChange={handleFilterChange}
        />
        <div>
          <EmployeeBenefitTable
            employeeBenefits={userData?.data || []}
            handleEditEmployeeBenefit={handleEditEmployeeBenefit}
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
      <CreateEmployBenefit
        isOpen={openModal.upsert}
        handleRefetchData={handleRefetchData}
        closeModal={handleCloseModal}
        handleEditAfterCreate={handleEditAfterCreate}
      />
      <EditEmployBenefit
        isOpen={openModal.block}
        employeeBenefit={employeeBenefitDetail}
        handleRefetchData={handleRefetchData}
        closeModal={handleCloseModal}
      />
      <DowloadFileBenefit
        isOpen={openModal.download}
        closeModal={handleCloseModal}
      />
      <DeleteEmployeeBenefitModal
        isOpen={openModal.delete}
        employeeBenefitDetail={employeeBenefitDetail}
        handleRefetchData={handleRefetchData}
        closeModal={handleCloseModal}
      />
    </>
  );
}
