import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import PageMeta from '@/components/common/PageMeta';
import { useCallback, useState } from 'react';
import { IQueryParams, IRequestOff } from '@/types';
import { useQueryGetListRequestOff } from '@/services';
import isEmpty from 'lodash/isEmpty';
import Pagination from '@/components/pagination/Pagination';
import RequestOffTable from './components/RequestOffTable';
import ChangeStatusRequestModal from './components/ChangeStatusRequestModal';
import Filter from './components/Filter';
import RequestOffDetailModal from './components/RequestOffDetailModal';

type RequestOffQueryParams = IQueryParams & {
  startDate?: string;
  endDate?: string;
};

const defaultFilter = {
  startDate: undefined,
  endDate: undefined,
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
  const { data: requestOffData, refetch } = useQueryGetListRequestOff(filter);
  const [detail, setDetail] = useState<IRequestOff | null>(null);
  const [openModal, setOpenModal] = useState<{
    changeStatus: boolean;
    detail: boolean;
  }>(defaultOpenModal);
  const handleFilterChange = useCallback((newFilter: RequestOffQueryParams) => {
    setFilter(newFilter);
  }, []);
  const handleAction = (data: IRequestOff, modalType: string) => {
    setDetail(data);
    setOpenModal({ ...defaultOpenModal, [modalType]: true });
  };
  const handleCloseModal = () => {
    setOpenModal(defaultOpenModal);
    setDetail(null);
  };
  return (
    <>
      <PageMeta title='Quản lý nghỉ phép' description='Quản lý nghỉ phép' />
      <div>
        <div className='flex flex-wrap items-center justify-between'>
          <PageBreadcrumb pageTitle='Quản lý nghỉ phép' />
        </div>
        <Filter handleFilterChange={handleFilterChange} />
        <div>
          <RequestOffTable
            requestData={requestOffData?.data || []}
            handleAction={handleAction}
          />
          <div className='flex justify-end'>
            {!isEmpty(requestOffData?.data) && (
              <Pagination
                page={requestOffData?.pagination?.page as number}
                pageLength={requestOffData?.pagination?.pageSize as number}
                totalRecords={requestOffData?.pagination?.count as number}
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
      <ChangeStatusRequestModal
        isOpen={openModal.changeStatus}
        detail={detail}
        handleRefetchData={() => refetch()}
        closeModal={handleCloseModal}
      />
      <RequestOffDetailModal
        isOpen={openModal.detail}
        detail={detail}
        closeModal={handleCloseModal}
      />
    </>
  );
}
