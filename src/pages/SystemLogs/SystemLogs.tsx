import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import PageMeta from '@/components/common/PageMeta';
import { useCallback, useState } from 'react';
import { IQueryParams, ISystemLogs } from '@/types';
import isEmpty from 'lodash/isEmpty';
import Pagination from '@/components/pagination/Pagination';
import Filter from './components/Filter';
import SystemLogsTable from './components/SystemLogsTable';
import { useQueryGetListSystemLogs } from '@/services';
import SystemLogsDetailModal from './components/SystemLogsDetailModal';

type RequestOffQueryParams = IQueryParams & {
  startDate?: string;
  endDate?: string;
};

const defaultFilter = {
  startDate: undefined,
  endDate: undefined,
  pageSize: 20,
};
const defaultOpenModal = {
  upsert: false,
  delete: false,
  reset: false,
  changeStatus: false,
  detail: false,
};
export default function RequestOff() {
  const [filter, setFilter] = useState<RequestOffQueryParams>(defaultFilter);
  const { data: systemLogsData } = useQueryGetListSystemLogs(filter);
  const [detail, setDetail] = useState<ISystemLogs | null>(null);
  const [openModal, setOpenModal] = useState<{
    changeStatus: boolean;
    detail: boolean;
  }>(defaultOpenModal);
  const handleFilterChange = useCallback((newFilter: RequestOffQueryParams) => {
    setFilter(newFilter);
  }, []);
  const handleAction = (data: ISystemLogs, modalType: string) => {
    setDetail(data);
    setOpenModal({ ...defaultOpenModal, [modalType]: true });
  };
  const handleCloseModal = () => {
    setOpenModal(defaultOpenModal);
    setDetail(null);
  };
  return (
    <>
      <PageMeta title='Quản lý hoạt động' description='Quản lý hoạt động' />
      <div>
        <div className='flex flex-wrap items-center justify-between'>
          <PageBreadcrumb pageTitle='Quản lý hoạt động' />
        </div>
        <Filter handleFilterChange={handleFilterChange} />
        <div>
          <SystemLogsTable
            SystemLogsData={systemLogsData?.data || []}
            handleAction={handleAction}
          />
          <div className='flex justify-end'>
            {!isEmpty(systemLogsData?.data) && (
              <Pagination
                page={systemLogsData?.pagination?.page as number}
                pageLength={systemLogsData?.pagination?.pageSize as number}
                totalRecords={systemLogsData?.pagination?.count as number}
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
      <SystemLogsDetailModal
        isOpen={openModal.detail}
        detail={detail}
        closeModal={handleCloseModal}
      />
    </>
  );
}
