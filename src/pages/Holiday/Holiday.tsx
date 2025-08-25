import { useCallback, useState } from 'react';
import isEmpty from 'lodash/isEmpty';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import Button from '@/components/ui/button/Button';
import Pagination from '@/components/pagination/Pagination';
import { IQueryParams, IHoliday, PERMISSIONS } from '@/types';
import { useQueryGetHolidayLists } from '@/services';
import PageMeta from '@/components/common/PageMeta';
import AuthorizationWrapper from '@/components/common/AuthorizationWrapper';
import Filter from './components/Filter';
import HolidayTable from './components/HolidayTable';
import DeleteHolidayModal from './components/DeleteHolidayModal';
import HolidayFormModal from './components/HolidayFormModal';

const defaultFilter = {
  pageIndex: 0,
  pageSize: 20,
};
const defaultOpenModal = {
  upsert: false,
  delete: false,
  reset: false,
  changeStatus: false,
  detail: false,
};

type QueryParams = IQueryParams & {
  searchKeyword?: string;
  year?: string;
  month?: string;
};

export default function ShiftList() {
  const [filter, setFilter] = useState<QueryParams>(defaultFilter);
  const [holidayDetail, setHolidayDetail] = useState<IHoliday | null>(null);
  const [openModal, setOpenModal] = useState<{
    upsert: boolean;
    delete: boolean;
  }>(defaultOpenModal);

  const { data: holidayListData, refetch } = useQueryGetHolidayLists(filter);

  const handleAction = (data: IHoliday, modalType: string) => {
    setHolidayDetail(data);
    setOpenModal({ ...defaultOpenModal, [modalType]: true });
  };
  const handleFilterChange = useCallback((newFilter: QueryParams) => {
    setFilter(newFilter);
  }, []);
  const handleRefetchData = () => {
    refetch();
  };

  const handleCloseModal = () => {
    setOpenModal(defaultOpenModal);
    setHolidayDetail(null);
  };

  return (
    <>
      <PageMeta title='Quản lý nghỉ lễ' description='Quản lý nghỉ lễ' />
      <div>
        <div className='flex flex-wrap items-center justify-between'>
          <PageBreadcrumb pageTitle='Quản lý nghỉ lễ' />
          <AuthorizationWrapper allowedRoles={PERMISSIONS.CREATE_IP}>
            <Button
              size='sm'
              onClick={() => {
                setOpenModal(prev => ({ ...prev, upsert: true }));
              }}
            >
              Tạo ngày nghỉ
            </Button>
          </AuthorizationWrapper>
        </div>
        <Filter handleFilterChange={handleFilterChange} />
        <div>
          <HolidayTable
            holidayList={holidayListData?.data || []}
            handleAction={handleAction}
          />
          <div className='flex justify-end'>
            {!isEmpty(holidayListData?.data) && (
              <Pagination
                page={holidayListData?.pagination?.page as number}
                pageLength={holidayListData?.pagination?.pageSize as number}
                totalRecords={holidayListData?.pagination?.count as number}
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

      <HolidayFormModal
        holidayDetail={holidayDetail}
        isOpen={openModal.upsert}
        handleRefetchData={handleRefetchData}
        closeModal={handleCloseModal}
      />
      <DeleteHolidayModal
        isOpen={openModal.delete}
        holidayDetail={holidayDetail}
        handleRefetchData={handleRefetchData}
        closeModal={handleCloseModal}
      />
    </>
  );
}
