import { toast } from '@/components/toast';
import ConfirmStatusModal from '@/components/ui/modal/ConfirmStatusModal';
import { useChangeSalaryStatusMutation } from '@/services';
import { ToastType } from '@/shared/constants/common';
import { ISalaryRecord } from '@/types';

interface IChangeStatusModalProps {
  salaryDetail: ISalaryRecord | null;
  isOpen: boolean;
  closeModal: () => void;
  handleRefetchData: () => void;
}

export default function ChangeStatusModal({
  salaryDetail,
  isOpen,
  closeModal,
  handleRefetchData,
}: IChangeStatusModalProps) {
  const changeStatusMutation = useChangeSalaryStatusMutation();

  const handleDeleteCategory = () => {
    changeStatusMutation.mutate(
      {
        monthlyPayrollId: salaryDetail?._id as string,
        status: salaryDetail?.status as string,
      },
      {
        onSuccess: () => {
          toast(ToastType.Success, 'Thay đổi trạng thái thành công');
          handleRefetchData();
          closeModal();
        },
      }
    );
  };

  return (
    <ConfirmStatusModal
      isOpen={isOpen}
      isLoading={changeStatusMutation.isPending}
      closeModal={closeModal}
      confirmChange={handleDeleteCategory}
    />
  );
}
