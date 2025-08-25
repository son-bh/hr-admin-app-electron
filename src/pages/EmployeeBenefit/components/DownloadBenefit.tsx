import { toast } from '@/components/toast';
import Button from '@/components/ui/button/Button';
import { Modal } from '@/components/ui/modal';
import { useExportEmployeeBenefitTemplateMutation } from '@/services/employeeBenefit';
import { ToastType } from '@/shared/constants';
import { downloadFile } from '@/shared/utils/helpers';
import { FaCircleInfo } from 'react-icons/fa6';

interface IDownloadProps {
  isOpen: boolean;
  closeModal: () => void;
}

export default function DowloadFileBenefit({
  isOpen,
  closeModal,
}: IDownloadProps) {
  const exportMutation = useExportEmployeeBenefitTemplateMutation();
  const handleExportTemplate = async () => {
    exportMutation.mutate(undefined, {
      onSuccess: response => {
        downloadFile(response, 'EmployeeBenefit');
        toast(ToastType.Success, 'Tải bảng lương nhân viên thành công');
        closeModal();
      },
    });
  };
  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      className='max-w-[500px] m-4'
      isBackdropClose={false}
    >
      <div className='relative w-full p-4 bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11'>
        <div className='flex items-center justify-center mb-4'>
          <FaCircleInfo className='text-blue-500' size={64} />
        </div>
        <div className='flex items-center justify-center'>
          <h4 className='mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90'>
            {'Tải mẫu lương'}
          </h4>
        </div>
        <div className='flex items-center gap-3 px-2 mt-6 justify-center'>
          <Button size='sm' variant='outline' onClick={closeModal}>
            Đóng
          </Button>
          <Button
            size='sm'
            // isLoading={createEmployeeBenefitMutation.isPending}
            onClick={handleExportTemplate}
          >
            Tải
          </Button>
        </div>
      </div>
    </Modal>
  );
}
