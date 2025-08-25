import { useState } from 'react';
import isEmpty from 'lodash/isEmpty';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import Button from '@/components/ui/button/Button';
import Pagination from '@/components/pagination/Pagination';
import { IQueryParams, IShift, PERMISSIONS } from '@/types';
import { useQueryGetShifts } from '@/services';
import PageMeta from '@/components/common/PageMeta';
import ShiftTable from './components/ShiftTable';
import ShiftFormModal from './components/ShiftFormModal';
import DeleteShiftModal from './components/DeleteShiftModal';
import AuthorizationWrapper from '@/components/common/AuthorizationWrapper';

const defaultFilter = { pageIndex: 0, pageSize: 50 };
const defaultOpenModal = {
  upsert: false,
  delete: false,
  reset: false,
  changeStatus: false,
  detail: false,
};

export default function ShiftList() {
  const [filter, setFilter] = useState<IQueryParams>(defaultFilter);
  const [shiftDetail, setShiftDetail] = useState<IShift | null>(null);
  const [openModal, setOpenModal] = useState<{
    upsert: boolean;
    delete: boolean;
  }>(defaultOpenModal);

  const { data: shiftData, refetch } = useQueryGetShifts(filter);

  const handleEditShift = (data: IShift, modalType: string) => {
    setShiftDetail(data);
    setOpenModal({ ...defaultOpenModal, [modalType]: true });
  };

  const handleRefetchData = () => {
    refetch();
  };

  const handleCloseModal = () => {
    setOpenModal(defaultOpenModal);
    setShiftDetail(null);
  };

  return (
    <>
      <PageMeta title='Quản lý ca' description='Quản lý ca' />
      <div>
        <div className='flex items-center justify-between'>
          <PageBreadcrumb pageTitle='Quản lý ca' />
          <AuthorizationWrapper allowedRoles={PERMISSIONS.CREATE_SHIFF}>
            <Button
              onClick={() => {
                setOpenModal(prev => ({ ...prev, upsert: true }));
              }}
              className='mb-6'
            >
              Thêm ca
            </Button>
          </AuthorizationWrapper>
        </div>
        <div>
          <ShiftTable
            shifts={shiftData?.data || []}
            handleEditShift={handleEditShift}
          />
          <div className='flex justify-end'>
            {!isEmpty(shiftData?.data) && (
              <Pagination
                page={shiftData?.pagination?.page as number}
                pageLength={shiftData?.pagination?.pageSize as number}
                totalRecords={shiftData?.pagination?.count as number}
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
      <ShiftFormModal
        isOpen={openModal.upsert}
        shiftDetail={shiftDetail}
        handleRefetchData={handleRefetchData}
        closeModal={handleCloseModal}
      />
      <DeleteShiftModal
        isOpen={openModal.delete}
        shiftDetail={shiftDetail}
        handleRefetchData={handleRefetchData}
        closeModal={handleCloseModal}
      />
    </>
  );
}
