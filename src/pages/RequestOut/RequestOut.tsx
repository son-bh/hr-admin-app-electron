import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import PageMeta from '@/components/common/PageMeta';
import { useCallback, useState } from 'react';
import { IQueryParams } from '@/types';
import isEmpty from 'lodash/isEmpty';
import Pagination from '@/components/pagination/Pagination';
import ChangeStatusRequestModal from './components/ChangeStatusRequestModal';
import Filter from './components/Filter';
import RequestOutDetailModal from './components/RequestOutDetailModal';
import RequestOutTable from './components/RequestOutTable';
import { useQueryGetListRequestOut } from '@/services/RequestOut';
import { IRequestOut } from '@/types/IRequestOut';

type RequestOutQueryParams = IQueryParams & {
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
export default function RequestOut() {
  const [filter, setFilter] = useState<RequestOutQueryParams>(defaultFilter);
  const { data: requestOutData, refetch } = useQueryGetListRequestOut(filter);
  const [detail, setDetail] = useState<IRequestOut | null>(null);
  const [openModal, setOpenModal] = useState<{
    changeStatus: boolean;
    detail: boolean;
  }>(defaultOpenModal);
  const handleFilterChange = useCallback((newFilter: RequestOutQueryParams) => {
    setFilter(newFilter);
  }, []);
  const handleAction = (data: IRequestOut, modalType: string) => {
    setDetail(data);
    setOpenModal({ ...defaultOpenModal, [modalType]: true });
  };
  const handleCloseModal = () => {
    setOpenModal(defaultOpenModal);
    setDetail(null);
  };
  return (
    <>
      <PageMeta
        title='Quản lý xin về sớm, vào trễ'
        description='Quản lý xin về sớm, vào trễ'
      />
      <div>
        <div className='flex flex-wrap items-center justify-between'>
          <PageBreadcrumb pageTitle='Quản lý xin về sớm, vào trễ' />
        </div>
        <Filter handleFilterChange={handleFilterChange} />
        <div>
          <RequestOutTable
            requestData={requestOutData?.data || []}
            handleAction={handleAction}
          />
          <div className='flex justify-end'>
            {!isEmpty(requestOutData?.data) && (
              <Pagination
                page={requestOutData?.pagination?.page as number}
                pageLength={requestOutData?.pagination?.pageSize as number}
                totalRecords={requestOutData?.pagination?.count as number}
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
      <RequestOutDetailModal
        isOpen={openModal.detail}
        detail={detail}
        closeModal={handleCloseModal}
      />
    </>
  );
}
