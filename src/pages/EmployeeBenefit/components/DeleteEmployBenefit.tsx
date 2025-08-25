import { ToastType } from '@/shared/constants/common';
import { IEmployBenefit } from '@/types';
import { toast } from '@/components/toast';
import ConfirmDeleteModal from '@/components/ui/modal/ConfirmDeleteModal';
import { useDeleteEmployeeBenefitMutation } from '@/services/employeeBenefit';

interface IDeleteEmployeeBenefitModalProps {
  employeeBenefitDetail?: IEmployBenefit | null;
  isOpen: boolean;
  closeModal: () => void;
  handleRefetchData: () => void;
}

export default function DeleteEmployeeBenefitModal({
  employeeBenefitDetail,
  isOpen,
  closeModal,
  handleRefetchData,
}: IDeleteEmployeeBenefitModalProps) {
  const DeleteEmployeeBenefitModalMutation = useDeleteEmployeeBenefitMutation();

  const handleDeleteEmployeeBenefit = () => {
    DeleteEmployeeBenefitModalMutation.mutate(
      { benefitId: employeeBenefitDetail?._id as string },
      {
        onSuccess: () => {
          toast(ToastType.Success, 'Xoá Lương nhân viên thành công');
          handleRefetchData();
          closeModal();
        },
      }
    );
  };

  return (
    <ConfirmDeleteModal
      isOpen={isOpen}
      isLoading={DeleteEmployeeBenefitModalMutation.isPending}
      closeModal={closeModal}
      confirmDelete={handleDeleteEmployeeBenefit}
    />
  );
}
