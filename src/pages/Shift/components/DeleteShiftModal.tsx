import { useDeleteShiftMutation } from '@/services';
import { ToastType } from '@/shared/constants/common';
import { IShift } from '@/types';
import { toast } from '@/components/toast';
import ConfirmDeleteModal from '@/components/ui/modal/ConfirmDeleteModal';

interface IDeleteShiftModalProps {
  shiftDetail?: IShift | null;
  isOpen: boolean;
  closeModal: () => void;
  handleRefetchData: () => void;
}

export default function DeleteShiftModal({
  shiftDetail,
  isOpen,
  closeModal,
  handleRefetchData,
}: IDeleteShiftModalProps) {
  const deleteShiftMutation = useDeleteShiftMutation();

  const handleDeleteAdmin = () => {
    deleteShiftMutation.mutate(
      { shiftId: shiftDetail?._id as string },
      {
        onSuccess: () => {
          toast(ToastType.Success, 'Xoá ca thành công');
          handleRefetchData();
          closeModal();
        },
      }
    );
  };

  return (
    <ConfirmDeleteModal
      isOpen={isOpen}
      isLoading={deleteShiftMutation.isPending}
      closeModal={closeModal}
      confirmDelete={handleDeleteAdmin}
    />
  );
}
