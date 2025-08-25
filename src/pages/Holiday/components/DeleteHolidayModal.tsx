import { useDeleteHolidayMutation } from '@/services';
import { ToastType } from '@/shared/constants/common';
import { IHoliday } from '@/types';
import { toast } from '@/components/toast';
import ConfirmDeleteModal from '@/components/ui/modal/ConfirmDeleteModal';

interface Props {
  holidayDetail?: IHoliday | null;
  isOpen: boolean;
  closeModal: () => void;
  handleRefetchData: () => void;
}

export default function DeleteHolidayModal({
  holidayDetail,
  isOpen,
  closeModal,
  handleRefetchData,
}: Props) {
  const deleteHolidayMutation = useDeleteHolidayMutation();

  const handleDeleteAdmin = () => {
    deleteHolidayMutation.mutate(
      { id: holidayDetail?._id as string },
      {
        onSuccess: () => {
          toast(ToastType.Success, 'Xoá ngày nghỉ thành công');
          handleRefetchData();
          closeModal();
        },
      }
    );
  };

  return (
    <ConfirmDeleteModal
      isOpen={isOpen}
      isLoading={deleteHolidayMutation.isPending}
      closeModal={closeModal}
      confirmDelete={handleDeleteAdmin}
    />
  );
}
