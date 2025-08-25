import { useCallback, useState } from 'react';
import isEmpty from 'lodash/isEmpty';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import Pagination from '@/components/pagination/Pagination';
import { IQueryParams, PERMISSIONS } from '@/types';

import PageMeta from '@/components/common/PageMeta';

import { useQueryGetDevices } from '@/services/devices';
import DevicesTable from './components/DevicesTable';
import { IDevices } from '@/types/IDevices';
import Button from '@/components/ui/button/Button';
import AddDevicesModal from './components/AddDevicesModal';
import DetailDevicesModal from './components/FormDetail';
import Filter from './components/Fillter';
import AuthorizationWrapper from '@/components/common/AuthorizationWrapper';

type UserQueryParams = IQueryParams & {
  searchKeyword?: string;
  device?: string;
};

const defaultFilter = { pageIndex: 0, pageSize: 10 };
const defaultOpenModal = {
  add: false,
  delete: false,
  detail: false,
};

export default function DevicesManager() {
  const [filter, setFilter] = useState<UserQueryParams>(defaultFilter);
  const [deviceDetail, setDeviceDetail] = useState<IDevices | null>(null);
  const [openModal, setOpenModal] = useState<{
    add: boolean;
    delete: boolean;
    detail: boolean;
  }>(defaultOpenModal);
  const { data: devicesData, refetch } = useQueryGetDevices(filter);

  const handleDevices = (data: IDevices, modalType: string) => {
    setDeviceDetail(data);
    setOpenModal({ ...defaultOpenModal, [modalType]: true });
  };

  const handleRefetchData = () => {
    refetch();
  };

  const handleCloseModal = () => {
    setOpenModal(defaultOpenModal);
    setDeviceDetail(null);
  };
  const handleFilterChange = useCallback((newFilter: UserQueryParams) => {
    setFilter(newFilter);
  }, []);
  return (
    <>
      <PageMeta title='Quản lý thiết bị' description='Quản lý thiết bị' />
      <div>
        <div className='flex flex-wrap items-center justify-between'>
          <PageBreadcrumb pageTitle='Quản lý thiết bị' />
          <AuthorizationWrapper
            allowedRoles={PERMISSIONS.CREATE_EMPLOYEE_MATERIAL}
          >
            <Button
              onClick={() => {
                setDeviceDetail(null);
                setOpenModal(prev => ({ ...prev, add: true }));
              }}
              className='mb-6'
            >
              Bàn giao thiết bị
            </Button>
          </AuthorizationWrapper>
        </div>
        <Filter handleFilterChange={handleFilterChange} />
        <div>
          <DevicesTable
            devices={devicesData?.data || []}
            handleEditDevice={handleDevices}
          />
          <div className='flex xl:justify-end justify-center'>
            {!isEmpty(devicesData?.data) && (
              <Pagination
                page={devicesData?.pagination?.page as number}
                pageLength={devicesData?.pagination?.pageSize as number}
                totalRecords={devicesData?.pagination?.count as number}
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
      <AddDevicesModal
        isOpen={openModal.add}
        handleRefetchData={handleRefetchData}
        closeModal={handleCloseModal}
      />
      {deviceDetail && (
        <DetailDevicesModal
          handleRefetchData={handleRefetchData}
          isOpen={openModal.detail}
          material={deviceDetail}
          closeModal={handleCloseModal}
        />
      )}
    </>
  );
}
