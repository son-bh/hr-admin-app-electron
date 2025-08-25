import { IDevices, Material } from '@/types/IDevices';
import { Modal } from '@/components/ui/modal';
import Button from '@/components/ui/button/Button';
import { ToastType } from '@/shared/constants';
import { formatDate } from 'date-fns';
import { FaTrash } from 'react-icons/fa';
import { useDeleteMaterialsMutation } from '@/services/devices';
import { toast } from '@/components/toast';
import ConfirmDeleteModal from '@/components/ui/modal/ConfirmDeleteModal';
import { useEffect, useState } from 'react';
import { DEVICES } from '@/configs/devices';
import { LuPencil } from 'react-icons/lu';
import AddDevicesModal from './AddDevicesModal';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import AuthorizationWrapper from '@/components/common/AuthorizationWrapper';
import { PERMISSIONS } from '@/types';

interface IDetailDevicesModalProps {
  material: IDevices;
  isOpen: boolean;
  closeModal: () => void;
  handleRefetchData: () => void;
}

export default function DetailDevicesModal({
  material: initialMaterial,
  isOpen,
  closeModal,
  handleRefetchData,
}: IDetailDevicesModalProps) {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedMaterialId, setSelectedMaterialId] = useState<string | null>(
    null
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<Material | null>(null);
  const [material, setMaterial] = useState<IDevices>(initialMaterial);

  useEffect(() => {
    setMaterial(initialMaterial);
  }, [initialMaterial]);

  const deleteDevicesMutation = useDeleteMaterialsMutation();
  const handleDeleteDevice = () => {
    if (selectedMaterialId) {
      deleteDevicesMutation.mutate(
        { materialId: selectedMaterialId },
        {
          onSuccess: () => {
            toast(ToastType.Success, 'Xoá thiết bị thành công');
            handleRefetchData();
            setIsConfirmModalOpen(false);
            closeModal();
          },
          onError: () => {
            toast(ToastType.Error, 'Xoá thiết bị thất bại');
          },
        }
      );
    }
  };

  const openConfirmModal = (materialId: string) => {
    setSelectedMaterialId(materialId);
    setIsConfirmModalOpen(true);
  };

  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false);
    setSelectedMaterialId(null);
  };

  const openEditModal = (device: Material) => {
    setSelectedDevice(device);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedDevice(null);
  };

  return (
    <>
      <Modal
        title={
          <h4 className='text-2xl sm:text-xl font-bold text-white'>
            Chỉnh sửa thiết bị
          </h4>
        }
        footerContent={
          <div className='flex items-center gap-3 px-2 mt-6 justify-end'>
            <Button size='sm' variant='outline' onClick={closeModal}>
              Đóng
            </Button>
          </div>
        }
        isOpen={isOpen}
        onClose={closeModal}
        className='max-w-[1000px] m-4'
        isScroll={false}
      >
        <div className='overflow-x-auto max-w-full overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]'>
          <Table>
            <TableHeader className='border-b border-gray-100 dark:border-white/[0.05]'>
              <TableRow>
                <TableCell
                  isHeader
                  className='px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400  no-wrap'
                >
                  Thiết bị
                </TableCell>
                <TableCell
                  isHeader
                  className='px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 truncate'
                >
                  Ngày bàn giao
                </TableCell>
                <TableCell
                  isHeader
                  className='px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 truncate'
                >
                  Ghi chú
                </TableCell>
                <TableCell
                  isHeader
                  className='px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 truncate'
                >
                  Người bàn giao
                </TableCell>
                <TableCell
                  isHeader
                  className='px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 truncate'
                >
                  Thao tác
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className='p-6 space-y-1 max-h-[60vh] overflow-y-auto custom-scrollbar'>
              {material.materials.map((item, key) => (
                <TableRow key={key} className='list-disc'>
                  <TableCell className='px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 truncate'>
                    {DEVICES[item.device as keyof typeof DEVICES]}
                  </TableCell>
                  <TableCell className='px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 truncate'>
                    {formatDate(item.createdAt as string, 'dd/MM/yyyy')}
                  </TableCell>
                  <TableCell className='px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 truncate'>
                    {item.note}
                  </TableCell>
                  {
                    <TableCell className='px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 truncate'>
                      {' '}
                      {item?.actionBy?.username || '--'}
                    </TableCell>
                  }
                  <TableCell className='px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400'>
                    <div className='flex gap-1'>
                      <AuthorizationWrapper
                        allowedRoles={PERMISSIONS.DELETE_EMPLOYEE_MATERIAL}
                      >
                        <button
                          className='text-red-500 rounded hover:bg-gray-400 mr-2'
                          onClick={e => {
                            e.preventDefault();
                            openConfirmModal(item._id as string);
                          }}
                        >
                          <FaTrash color='bg-red-400' />
                        </button>
                      </AuthorizationWrapper>
                      <button
                        className='text-gray-200-500 rounded hover:bg-gray-400'
                        onClick={e => {
                          e.preventDefault();
                          openEditModal(item);
                        }}
                      >
                        <LuPencil />
                      </button>
                    </div>
                  </TableCell>
                  {/* <div className='bg-gray-50 px-5 not-last:border-t border-gray-200'></div> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Modal>
      <ConfirmDeleteModal
        isOpen={isConfirmModalOpen}
        isLoading={deleteDevicesMutation.isPending}
        closeModal={closeConfirmModal}
        confirmDelete={handleDeleteDevice}
      />
      <AddDevicesModal
        isOpen={isEditModalOpen}
        materialData={selectedDevice ?? undefined}
        handleRefetchData={handleRefetchData}
        closeModal={closeEditModal}
        setMaterial={setMaterial}
      />
    </>
  );
}
