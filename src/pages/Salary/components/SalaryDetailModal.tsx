import Button from '@/components/ui/button/Button';
import { Modal } from '@/components/ui/modal';
import { formatVND } from '@/shared/utils/helpers';
import type { ISalaryRecord } from '@/types';

interface ISalaryDetailModalProps {
  isOpen: boolean;
  salaryDetail: ISalaryRecord;
  closeModal: () => void;
}

export default function SalaryDetailModal({
  isOpen,
  salaryDetail,
  closeModal,
}: ISalaryDetailModalProps) {
  return (
    <Modal
      title={
        <h4 className='text-2xl sm:text-xl font-bold text-white'>
          Chi tiết lương:&nbsp;
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
              Thưởng
            </span>
            <span className='w-1/2 text-sm font-medium text-gray-700 sm:w-3/4 dark:text-gray-400'>
              {formatVND(salaryDetail.bonus || 0)}
            </span>
          </li>
          {salaryDetail?.bonusDetails?.map((item, index) => (
            <li key={index} className='flex items-center gap-5 py-2.5'>
              <span className='pl-4 w-1/2 text-[13px] text-gray-500 sm:w-1/4 dark:text-gray-400'>
                {item.name}
              </span>
              <span className='w-1/2 text-sm font-medium text-gray-700 sm:w-3/4 dark:text-gray-400'>
                {formatVND(item.amount || 0)}
              </span>
            </li>
          ))}
          <li className='flex items-center gap-5 py-2.5'>
            <span className='w-1/2 text-sm text-gray-500 sm:w-1/4 dark:text-gray-400'>
              Phạt
            </span>
            <span className='w-1/2 text-sm font-medium text-gray-700 sm:w-3/4 dark:text-gray-400'>
              {formatVND(salaryDetail.penalty || 0)}
            </span>
          </li>
          {salaryDetail?.penaltyDetails?.map((item, index) => (
            <li key={index} className='flex items-center gap-5 py-2.5'>
              <span className='pl-4 w-1/2 text-[13px] text-gray-500 sm:w-1/4 dark:text-gray-400'>
                {item.name}
              </span>
              <span className='w-1/2 text-sm font-medium text-gray-700 sm:w-3/4 dark:text-gray-400'>
                {formatVND(item.amount || 0)}
              </span>
            </li>
          ))}
          <li className='flex items-center gap-5 py-2.5'>
            <span className='w-1/2 text-sm text-gray-500 sm:w-1/4 dark:text-gray-400'>
              Ngày nghỉ có phép
            </span>
            <span className='w-1/2 text-sm font-medium text-gray-700 sm:w-3/4 dark:text-gray-400'>
              {salaryDetail.paidLeaveDays || 0}
            </span>
          </li>
          <li className='flex items-center gap-5 py-2.5'>
            <span className='w-1/2 text-sm text-gray-500 sm:w-1/4 dark:text-gray-400'>
              Ngày nghỉ không phép
            </span>
            <span className='w-1/2 text-sm font-medium text-gray-700 sm:w-3/4 dark:text-gray-400'>
              {salaryDetail.unPaidLeaveDays || 0}
            </span>
          </li>
        </ul>
      </div>
    </Modal>
  );
}
