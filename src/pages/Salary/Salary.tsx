import { useCallback, useState } from 'react';
import isEmpty from 'lodash/isEmpty';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import Button from '@/components/ui/button/Button';
import Pagination from '@/components/pagination/Pagination';
import { IQueryParams, ISalaryRecord } from '@/types';
import { useQueryGetSalaryInMonth } from '@/services';
import PageMeta from '@/components/common/PageMeta';
import SalaryTable from './components/SalaryTable';
import SalaryFormModal from './components/SalaryFormModal';
import ChangeStatusModal from './components/ChangeStatusModal';
import Filter from './components/Filter';
import SalaryDetailModal from './components/SalaryDetailModal';
import SendPayslipModal from './components/SendPayslipModal';
import PayslipFeedbackModal from './components/PayslipFeedbackModal';

type SalaryQueryParams = IQueryParams & {
  searchKeyword?: string;
  month?: string;
  year?: string;
  status?: string;
  isSentToEmployee?: string;
};

const defaultFilter = { pageIndex: 0, pageSize: 50 };
const defaultOpenModal = {
  upsert: false,
  changeStatus: false,
  detail: false,
  send: false,
  note: false,
};

export default function UserList() {
  const [filter, setFilter] = useState<SalaryQueryParams>(defaultFilter);
  const [salaryDetail, setSalaryDetail] = useState<ISalaryRecord | null>(null);
  const [openModal, setOpenModal] = useState<{
    upsert: boolean;
    changeStatus: boolean;
    detail: boolean;
    send: boolean;
    note: boolean;
  }>(defaultOpenModal);

  const { data: salaryData, refetch } = useQueryGetSalaryInMonth(filter);

  const handleEditSalary = (data: ISalaryRecord, modalType: string) => {
    setSalaryDetail(data);
    setOpenModal({ ...defaultOpenModal, [modalType]: true });
  };

  const handleRefetchData = () => {
    refetch();
  };

  const handleCloseModal = () => {
    setOpenModal(defaultOpenModal);
    setSalaryDetail(null);
  };

  const handleFilterChange = useCallback((newFilter: SalaryQueryParams) => {
    setFilter(newFilter);
  }, []);

  return (
    <>
      <PageMeta
        title='Tính lương nhân viên'
        description='Tính lương nhân viên'
      />
      <div>
        <div className='flex flex-wrap items-center justify-between'>
          <PageBreadcrumb pageTitle='Tính lương nhân viên' />
          <Button
            onClick={() => {
              setOpenModal(prev => ({ ...prev, upsert: true }));
            }}
            className='mb-6'
          >
            Tính lương
          </Button>
        </div>
        <Filter handleFilterChange={handleFilterChange} />
        <div>
          <SalaryTable
            salaries={salaryData?.data || []}
            handleEditSalary={handleEditSalary}
          />
          <div className='flex justify-end'>
            {!isEmpty(salaryData?.data) && (
              <Pagination
                page={salaryData?.pagination?.page as number}
                pageLength={salaryData?.pagination?.pageSize as number}
                totalRecords={salaryData?.pagination?.count as number}
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
      <SalaryFormModal
        isOpen={openModal.upsert}
        handleRefetchData={handleRefetchData}
        closeModal={handleCloseModal}
      />
      <ChangeStatusModal
        isOpen={openModal.changeStatus}
        salaryDetail={salaryDetail}
        handleRefetchData={handleRefetchData}
        closeModal={handleCloseModal}
      />
      {openModal.detail && (
        <SalaryDetailModal
          isOpen={openModal.detail}
          salaryDetail={salaryDetail as ISalaryRecord}
          closeModal={handleCloseModal}
        />
      )}
      <SendPayslipModal
        isOpen={openModal.send}
        salaryDetail={salaryDetail}
        handleRefetchData={handleRefetchData}
        closeModal={handleCloseModal}
      />
      {openModal.note && (
        <PayslipFeedbackModal
          isOpen={openModal.note}
          salaryDetail={salaryDetail as ISalaryRecord}
          closeModal={handleCloseModal}
        />
      )}
    </>
  );
}
