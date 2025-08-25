import { useDeleteTeamMutation } from '../../../services';
import { ToastType } from '../../../shared/constants/common';
import { ITeam } from '../../../types';
import { toast } from '../../../components/toast';
import ConfirmDeleteModal from '../../../components/ui/modal/ConfirmDeleteModal';

interface IDeleteTeamModalProps {
  teamDetail?: ITeam | null;
  isOpen: boolean;
  closeModal: () => void;
  handleRefetchData: () => void;
}

export default function DeleteTeamModal({
  teamDetail,
  isOpen,
  closeModal,
  handleRefetchData,
}: IDeleteTeamModalProps) {
  const deleteTeamMutation = useDeleteTeamMutation();

  const handleDeleteAdmin = () => {
    deleteTeamMutation.mutate(
      { teamId: teamDetail?._id as string },
      {
        onSuccess: () => {
          toast(ToastType.Success, 'Xoá bộ phận thành công');
          handleRefetchData();
          closeModal();
        },
      }
    );
  };

  return (
    <ConfirmDeleteModal
      isOpen={isOpen}
      isLoading={deleteTeamMutation.isPending}
      closeModal={closeModal}
      confirmDelete={handleDeleteAdmin}
    />
  );
}
