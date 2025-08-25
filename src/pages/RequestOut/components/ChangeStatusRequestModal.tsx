import { toast } from '@/components/toast';
import ConfirmStatusModal from '@/components/ui/modal/ConfirmStatusModal';
import { useChangeStatusRequestOutMutation } from '@/services/RequestOut';
import { ToastType } from '@/shared/constants/common';
import { IRequestOut } from '@/types/IRequestOut';

interface IChangeStatusModalProps {
  detail: IRequestOut | null;
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
  const changeStatusMutation = useChangeStatusRequestOutMutation();
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
