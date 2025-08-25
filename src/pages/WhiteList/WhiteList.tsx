import { useCallback, useState } from 'react';
import isEmpty from 'lodash/isEmpty';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import Button from '@/components/ui/button/Button';
import Pagination from '@/components/pagination/Pagination';
import { IQueryParams, IWhiteList, PERMISSIONS } from '@/types';
import { useQueryGetWhiteLists } from '@/services';
import PageMeta from '@/components/common/PageMeta';
import WhiteListTable from './components/WhiteListTable';
import WhiteListFormModal from './components/WhiteListFormModal';
import DeleteWhiteListModal from './components/DeleteWhiteListModal';
import Filter from './components/Filter';
import AuthorizationWrapper from '@/components/common/AuthorizationWrapper';

const defaultFilter = { pageIndex: 0, pageSize: 50 };
const defaultOpenModal = {
  upsert: false,
  delete: false,
  reset: false,
  changeStatus: false,
  detail: false,
};

type WhiteListQueryParams = IQueryParams & {
  startDate?: string;
  endDate?: string;
};

export default function ShiftList() {
  const [filter, setFilter] = useState<WhiteListQueryParams>(defaultFilter);
  const [whiteListDetail, setWhiteListDetail] = useState<IWhiteList | null>(
    null
  );

  const [openModal, setOpenModal] = useState<{
    upsert: boolean;
    delete: boolean;
  }>(defaultOpenModal);

  const { data: whiteListData, refetch } = useQueryGetWhiteLists(filter);

  const handleActionWhiteList = (data: IWhiteList, modalType: string) => {
    setWhiteListDetail(data);
    setOpenModal({ ...defaultOpenModal, [modalType]: true });
  };
  const handleFilterChange = useCallback((newFilter: WhiteListQueryParams) => {
    setFilter(newFilter);
  }, []);
  const handleRefetchData = () => {
    refetch();
  };

  const handleCloseModal = () => {
    setOpenModal(defaultOpenModal);
  };

  return (
    <>
      <PageMeta title='Quản lý IP' description='Quản lý IP' />
      <div>
        <div className='flex flex-wrap items-center justify-between'>
          <PageBreadcrumb pageTitle='Quản lý IP' />
          <AuthorizationWrapper allowedRoles={PERMISSIONS.CREATE_IP}>
            <Button
              size='sm'
              onClick={() => {
                setOpenModal(prev => ({ ...prev, upsert: true }));
              }}
            >
              Tạo IP
            </Button>
          </AuthorizationWrapper>
        </div>
        <Filter handleFilterChange={handleFilterChange} />
        <div>
          <WhiteListTable
            whiteList={whiteListData?.data || []}
            handleActionWhiteList={handleActionWhiteList}
          />
          <div className='flex justify-end'>
            {!isEmpty(whiteListData?.data) && (
              <Pagination
                page={whiteListData?.pagination?.page as number}
                pageLength={whiteListData?.pagination?.pageSize as number}
                totalRecords={whiteListData?.pagination?.count as number}
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

      <WhiteListFormModal
        isOpen={openModal.upsert}
        handleRefetchData={handleRefetchData}
        closeModal={handleCloseModal}
      />
      <DeleteWhiteListModal
        isOpen={openModal.delete}
        whiteListDetail={whiteListDetail}
        handleRefetchData={handleRefetchData}
        closeModal={handleCloseModal}
      />
    </>
  );
}
