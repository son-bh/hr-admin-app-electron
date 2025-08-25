import { useSendPayslipMutation } from '@/services';
import { ToastType } from '@/shared/constants/common';
import { ISalaryRecord } from '@/types';
import { toast } from '@/components/toast';
import ConfirmStatusModal from '@/components/ui/modal/ConfirmStatusModal';

interface ISendPayslipModalProps {
  salaryDetail: ISalaryRecord | null;
  isOpen: boolean;
  closeModal: () => void;
  handleRefetchData: () => void;
}

export default function SendPayslipModal({
  salaryDetail,
  isOpen,
  closeModal,
  handleRefetchData,
}: ISendPayslipModalProps) {
  const sendPayslipMutation = useSendPayslipMutation();

  const sendPayslip = () => {
    sendPayslipMutation.mutate(
      { monthlyPayrollId: salaryDetail?._id as string },
      {
        onSuccess: () => {
          toast(ToastType.Success, 'Xoá nhân sự thành công');
          handleRefetchData();
          closeModal();
        },
      }
    );
  };

  return (
    <ConfirmStatusModal
      isOpen={isOpen}
      isLoading={sendPayslipMutation.isPending}
      title='Gửi bảng lương'
      description='Bạn có chắc chắn muốn gửi bảng lương cho nhân viên không?'
      textConfirmBtn='Gửi'
      closeModal={closeModal}
      confirmChange={sendPayslip}
    />
  );
}
