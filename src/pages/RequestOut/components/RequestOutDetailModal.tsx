import { format } from 'date-fns';
import { Modal } from '../../../components/ui/modal';
import Button from '../../../components/ui/button/Button';
import classNames from 'classnames';
import {
  RequestOutCategoryLabel,
  StatusColor,
  StatusLabel,
} from '../../../shared/constants/common';
import { vi } from 'date-fns/locale';
import { IRequestOut } from '@/types/IRequestOut';

interface Props {
  detail?: IRequestOut | null;
  isOpen: boolean;
  closeModal: () => void;
}

export default function RequestOutDetailModal({
  detail,
  isOpen,
  closeModal,
}: Props) {
  const InfoRow = ({
    label,
    value,
    isStatus = false,
    statusValue,
  }: {
    label: string;
    value: React.ReactNode;
    isStatus?: boolean;
    statusValue?: string;
  }) => (
    <div className='flex flex-col sm:flex-row sm:items-center gap-2 py-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0'>
      <div className='sm:w-1/3 font-medium text-gray-700 dark:text-gray-300'>
        {label}
      </div>
      <div className='sm:w-2/3 text-gray-900 dark:text-white'>
        {isStatus && statusValue ? (
          <Button
            variant='outline'
            size='sm'
            className={classNames(
              '!w-[120px] !p-0 !text-center cursor-default hover:opacity-90 transition-opacity',
              StatusColor[statusValue]
            )}
          >
            {StatusLabel[statusValue]}
          </Button>
        ) : (
          <span className='break-words'>{value || '—'}</span>
        )}
      </div>
    </div>
  );

  return (
    <Modal
      title={
        <>
          <h4 className='text-2xl sm:text-xl font-bold text-white mb-1'>
            Đơn xin{' '}
            {RequestOutCategoryLabel[
              detail?.type as keyof typeof RequestOutCategoryLabel
            ] || ''}
          </h4>
          <p className='text-blue-100 text-sm'>
            Chi tiết thông tin đơn xin{' '}
            {RequestOutCategoryLabel[
              detail?.type as keyof typeof RequestOutCategoryLabel
            ] || ''}
          </p>
        </>
      }
      footerContent={
        <div className='px-6 py-4 border-t border-gray-200 dark:border-gray-700'>
          <div className='flex items-center justify-end gap-3'>
            <Button
              size='sm'
              variant='outline'
              onClick={closeModal}
              className='px-6 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200'
            >
              Đóng
            </Button>
          </div>
        </div>
      }
      isOpen={isOpen}
      onClose={closeModal}
      className='max-w-[700px] m-4'
    >
      <div className='lg:p-4'>
        <InfoRow
          label='👨‍💼 Nhân viên'
          value={
            detail?.employee ? (
              <span className='font-semibold text-gray-800 dark:text-gray-200 leading-relaxed'>
                {detail.employee.username}
                {detail.employee.email && `-${detail.employee.email}`}
              </span>
            ) : (
              '—'
            )
          }
        />
        <InfoRow
          label='📅 Ngày nghỉ'
          value={
            detail?.schedule?.date ? (
              <span className='font-semibold text-blue-600 dark:text-blue-400'>
                <span className='w-2 h-2 bg-green-500 rounded-full'></span>
                {format(new Date(detail.schedule.date), 'EEEE, dd/MM/yyyy', {
                  locale: vi,
                })}
              </span>
            ) : (
              '—'
            )
          }
        />

        <InfoRow
          label='⏰ Ca làm việc'
          value={
            detail?.schedule?.shift ? (
              <span className='inline-flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm font-medium'>
                <span className='w-2 h-2 bg-green-500 rounded-full'></span>
                {detail.schedule.shift.startTime} -{' '}
                {detail.schedule.shift.endTime}
              </span>
            ) : (
              '—'
            )
          }
        />
        <InfoRow
          label='🕒 Giờ dự tính chấm công'
          value={
            detail?.from ? (
              <span className='inline-flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm font-medium'>
                <span className='w-2 h-2 bg-green-500 rounded-full'></span>
                {format(new Date(detail.from), 'HH:mm')}
              </span>
            ) : (
              '—'
            )
          }
        />

        <InfoRow
          label='💬 Lý do'
          value={
            detail?.reason ? (
              <span className='text-gray-800 dark:text-gray-200 leading-relaxed'>
                {detail.reason}
              </span>
            ) : (
              '—'
            )
          }
        />

        <InfoRow
          label='📝 Trạng thái'
          value={null}
          isStatus={true}
          statusValue={detail?.status}
        />

        <InfoRow
          label='👨‍💼 Người duyệt'
          value={
            detail?.approvedBy ? (
              <span className='inline-flex items-center gap-2 px-3 py-1 bg-green-50 dark:bg-green-900/20 rounded-full text-sm font-medium text-green-700 dark:text-green-400'>
                <span className='w-2 h-2 bg-green-500 rounded-full'></span>
                {detail.approvedBy.username || detail.approvedBy.email}
              </span>
            ) : (
              <span className='text-gray-500 italic'>Chưa có</span>
            )
          }
        />

        <InfoRow
          label='📅 Ngày tạo'
          value={
            detail?.createdAt ? (
              <span className='text-sm text-gray-600 dark:text-gray-400'>
                {format(new Date(detail.createdAt), "dd/MM/yyyy 'lúc' HH:mm")}
              </span>
            ) : (
              '—'
            )
          }
        />

        <InfoRow
          label='✅ Ngày duyệt'
          value={
            detail?.updatedAt && detail?.approvedBy ? (
              <span className='text-sm text-gray-600 dark:text-gray-400'>
                {format(new Date(detail.updatedAt), "dd/MM/yyyy 'lúc' HH:mm")}
              </span>
            ) : (
              <span className='text-gray-500 italic'>Chưa duyệt</span>
            )
          }
        />

        <InfoRow
          label='📄 Ghi chú'
          value={
            detail?.note ? (
              <div className='bg-gray-50 dark:bg-gray-800 rounded-lg p-3'>
                <p className='text-gray-700 dark:text-gray-300 leading-relaxed'>
                  {detail.note}
                </p>
              </div>
            ) : (
              <span className='text-gray-500 italic'>Không có ghi chú</span>
            )
          }
        />
      </div>
    </Modal>
  );
}
