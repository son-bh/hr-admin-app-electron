import { useDeleteShiftEmployeeMutation } from '@/services';
import { ToastType } from '@/shared/constants/common';
import { IShift } from '@/types';
import { toast } from '@/components/toast';
import ConfirmDeleteModal from '@/components/ui/modal/ConfirmDeleteModal';

interface IDeleteShiftEmployeeModalProps {
  shiftDetail?: IShift | null;
  isOpen: boolean;
  shiftDate?: string;
  username?: string;
  closeModal: () => void;
  handleDeleteSuccess: (
    shift: IShift,
    shiftDate: string,
    username: string
  ) => void;
}

export default function DeleteShiftEmployeeModal({
  shiftDetail,
  isOpen,
  shiftDate,
  username,
  closeModal,
  handleDeleteSuccess,
}: IDeleteShiftEmployeeModalProps) {
  const deleteShiftMutation = useDeleteShiftEmployeeMutation();

  const handleDeleteShift = () => {
    deleteShiftMutation.mutate(
      { scheduleId: shiftDetail?.scheduleId as string },
      {
        onSuccess: () => {
          toast(ToastType.Success, 'Xoá ca làm việc thành công');
          handleDeleteSuccess(
            shiftDetail as IShift,
            shiftDate as string,
            username as string
          );
          closeModal();
        },
      }
    );
  };

  return (
    <ConfirmDeleteModal
      isOpen={isOpen}
      isLoading={deleteShiftMutation.isPending}
      content='Bạn có thực sự muốn xóa ca làm việc này không? Quá trình này không thể hoàn tác.'
      closeModal={closeModal}
      confirmDelete={handleDeleteShift}
    />
  );
}
