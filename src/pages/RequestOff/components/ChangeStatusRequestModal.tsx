import { toast } from '@/components/toast';
import ConfirmStatusModal from '@/components/ui/modal/ConfirmStatusModal';
import { useChangeStatusRequestOffMutation } from '@/services';
import { ToastType } from '@/shared/constants/common';
import { IRequestOff } from '@/types';

interface IChangeStatusModalProps {
  detail: IRequestOff | null;
  isOpen: boolean;
  closeModal: () => void;
  handleRefetchData: () => void;
}

export default function ChangeStatusRequestModal({
  detail,
  isOpen,
  closeModal,
  handleRefetchData,
}: IChangeStatusModalProps) {
  const changeStatusMutation = useChangeStatusRequestOffMutation();
  const handlechange = () => {
    changeStatusMutation.mutate(
      {
        requestId: detail?._id as string,
        data: {
          status: detail?.status as string,
        },
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
      confirmChange={handlechange}
    />
  );
}
