import { useDeleteWhiteListMutation } from '@/services';
import { ToastType } from '@/shared/constants/common';
import { IWhiteList } from '@/types';
import { toast } from '@/components/toast';
import ConfirmDeleteModal from '@/components/ui/modal/ConfirmDeleteModal';

interface Props {
  whiteListDetail?: IWhiteList | null;
  isOpen: boolean;
  closeModal: () => void;
  handleRefetchData: () => void;
}

export default function DeleteWhiteListModal({
  whiteListDetail,
  isOpen,
  closeModal,
  handleRefetchData,
}: Props) {
  const deleteWhiteListMutation = useDeleteWhiteListMutation();

  const handleDeleteAdmin = () => {
    deleteWhiteListMutation.mutate(
      { id: whiteListDetail?._id as string },
      {
        onSuccess: () => {
          toast(ToastType.Success, 'Xoá IP thành công');
          handleRefetchData();
          closeModal();
        },
      }
    );
  };

  return (
    <ConfirmDeleteModal
      isOpen={isOpen}
      isLoading={deleteWhiteListMutation.isPending}
      closeModal={closeModal}
      confirmDelete={handleDeleteAdmin}
    />
  );
}
