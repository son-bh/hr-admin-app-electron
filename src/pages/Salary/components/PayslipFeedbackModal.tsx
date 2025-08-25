import Button from '@/components/ui/button/Button';
import { Modal } from '@/components/ui/modal';
import type { ISalaryRecord } from '@/types';

interface IPayslipFeedbackModalProps {
  isOpen: boolean;
  salaryDetail: ISalaryRecord;
  closeModal: () => void;
}

export default function PayslipFeedbackModal({
  isOpen,
  salaryDetail,
  closeModal,
}: IPayslipFeedbackModalProps) {
  return (
    <Modal
      title={
        <h4 className='text-2xl sm:text-xl font-bold text-white'>
          Yêu cầu chỉnh sửa:&nbsp;
          {salaryDetail.employee.username || salaryDetail.employee.fullname}
          &nbsp;-&nbsp; Tháng {salaryDetail.month}/{salaryDetail.year}
        </h4>
      }
      footerContent={
        <div className='flex items-center gap-3 justify-end mt-4'>
          <Button size='sm' variant='outline' onClick={closeModal}>
            Đóng
          </Button>
        </div>
      }
      isOpen={isOpen}
      onClose={closeModal}
      className='max-w-[700px] m-4'
      isScroll={false}
    >
      <div className='lg:p-4'>
        <ul className='divide-y divide-gray-100 dark:divide-gray-800'>
          <li className='flex items-center gap-5 py-2.5'>
            <span className='w-1/2 text-sm text-gray-500 sm:w-1/4 dark:text-gray-400'>
              Lý do
            </span>
            <span className='w-1/2 text-sm font-medium text-gray-700 sm:w-3/4 dark:text-gray-400'>
              {salaryDetail.reason}
            </span>
          </li>
        </ul>
      </div>
    </Modal>
  );
}
