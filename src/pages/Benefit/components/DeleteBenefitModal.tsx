import { useDeleteBenefitMutation } from '@/services';
import { ToastType } from '@/shared/constants/common';
import { IBenefit } from '@/types';
import { toast } from '@/components/toast';
import ConfirmDeleteModal from '@/components/ui/modal/ConfirmDeleteModal';

interface IDeleteBenefitModalProps {
  benefitDetail?: IBenefit | null;
  isOpen: boolean;
  closeModal: () => void;
  handleRefetchData: () => void;
}

export default function DeleteBenefitModal({
  benefitDetail,
  isOpen,
  closeModal,
  handleRefetchData,
}: IDeleteBenefitModalProps) {
  const DeleteBenefitModalMutation = useDeleteBenefitMutation();

  const handleDeleteAdmin = () => {
    DeleteBenefitModalMutation.mutate(
      { benefitId: benefitDetail?._id as string },
      {
        onSuccess: () => {
          toast(ToastType.Success, 'Xoá Lương thành công');
          handleRefetchData();
          closeModal();
        },
      }
    );
  };

  return (
    <ConfirmDeleteModal
      isOpen={isOpen}
      isLoading={DeleteBenefitModalMutation.isPending}
      closeModal={closeModal}
      confirmDelete={handleDeleteAdmin}
    />
  );
}
