import { format, formatDate } from 'date-fns';
import { memo, useMemo } from 'react';
import type { ISystemLogs } from '../../../types';
import { Modal } from '../../../components/ui/modal';
import Button from '../../../components/ui/button/Button';
import classNames from 'classnames';
import {
  ACTION_SYSTEM_LOG_LABEL,
  REF_TYPE,
  RequestOffCategoryLabel,
  RequestOutCategoryLabel,
  StatusColor,
  StatusLabel,
} from '../../../shared/constants/common';
import { ArrowRightIcon } from '@/icons';
import { USER_ROLE } from '@/configs';
import { formatVND } from '@/shared/utils/helpers';

interface Props {
  detail?: ISystemLogs | null;
  isOpen: boolean;
  closeModal: () => void;
}

const InfoRow = memo(
  ({
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
              '!w-[120px] !p-0 !text-center cursor-default border hover:opacity-90 transition-opacity',
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
  )
);

InfoRow.displayName = 'InfoRow';

const BenefitCards = memo(({ benefits }: { benefits: any }) => (
  <div className='space-y-3'>
    <div className='grid grid-cols-1 sm:grid-cols-3 gap-3'>
      <div className='bg-green-50 dark:bg-green-800/50 border border-green-200 dark:border-green-700 rounded-lg p-3'>
        <div className='flex items-center gap-2'>
          <span className='text-xs font-medium text-green-600 dark:text-green-400 tracking-wide'>
            Lương cơ bản
          </span>
        </div>
        <p className='text-lg font-semibold text-green-800 dark:text-green-200 mt-1'>
          {formatVND(benefits?.baseSalary)}
        </p>
      </div>
      <div className='bg-green-50 dark:bg-green-800/50 border border-green-200 dark:border-green-700 rounded-lg p-3'>
        <div className='flex items-center gap-2'>
          <span className='text-xs font-medium text-green-600 dark:text-green-400 tracking-wide'>
            Trợ cấp
          </span>
        </div>
        <p className='text-lg font-semibold text-green-800 dark:text-green-200 mt-1'>
          {formatVND(benefits?.allowance)}
        </p>
      </div>
      <div className='bg-green-50 dark:bg-green-800/50 border border-green-200 dark:border-green-700 rounded-lg p-3'>
        <div className='flex items-center gap-2'>
          <span className='text-xs font-medium text-green-600 dark:text-green-400 tracking-wide'>
            Tiền thưởng
          </span>
        </div>
        <p className='text-lg font-semibold text-green-800 dark:text-green-200 mt-1'>
          {formatVND(benefits?.bonus)}
        </p>
      </div>
    </div>
  </div>
));

BenefitCards.displayName = 'BenefitCards';

const PenaltyCards = memo(({ penalties }: { penalties: any }) => (
  <div className='space-y-3'>
    <div className='grid grid-cols-1 sm:grid-cols-3 gap-3'>
      <div className='bg-red-50 dark:bg-red-800/50 border border-red-200 dark:border-red-700 rounded-lg p-3'>
        <div className='flex items-center gap-2'>
          <span className='text-xs font-medium text-red-600 dark:text-red-400 tracking-wide'>
            Vào ca trễ
          </span>
        </div>
        <p className='text-lg font-semibold text-red-800 dark:text-red-200 mt-1'>
          {formatVND(penalties?.late)}
        </p>
      </div>
      <div className='bg-red-50 dark:bg-red-800/50 border border-red-200 dark:border-red-700 rounded-lg p-3'>
        <div className='flex items-center gap-2'>
          <span className='text-xs font-medium text-red-600 dark:text-red-400 tracking-wide'>
            Xuống ca sớm
          </span>
        </div>
        <p className='text-lg font-semibold text-red-800 dark:text-red-200 mt-1'>
          {formatVND(penalties?.earlyLeave)}
        </p>
      </div>
      <div className='bg-red-50 dark:bg-red-800/50 border border-red-200 dark:border-red-700 rounded-lg p-3'>
        <div className='flex items-center gap-2'>
          <span className='text-xs font-medium text-red-600 dark:text-red-400 tracking-wide'>
            Vào lại trễ
          </span>
        </div>
        <p className='text-lg font-semibold text-red-800 dark:text-red-200 mt-1'>
          {formatVND(penalties?.overBreak)}
        </p>
      </div>
    </div>
  </div>
));

PenaltyCards.displayName = 'PenaltyCards';

const RewardCards = memo(({ rewards }: { rewards: any }) => (
  <div className='space-y-3'>
    <div className='grid grid-cols-1 sm:grid-cols-3 gap-3'>
      <div className='bg-green-50 dark:bg-green-800/50 border border-green-200 dark:border-green-700 rounded-lg p-3'>
        <div className='flex items-center gap-2'>
          <span className='text-xs font-medium text-green-600 dark:text-green-400 tracking-wide'>
            Sinh nhật
          </span>
        </div>
        <p className='text-lg font-semibold text-green-800 dark:text-green-200 mt-1'>
          {formatVND(rewards?.birthday)}
        </p>
      </div>
      <div className='bg-green-50 dark:bg-green-800/50 border border-green-200 dark:border-green-700 rounded-lg p-3'>
        <div className='flex items-center gap-2'>
          <span className='text-xs font-medium text-green-600 dark:text-green-400 tracking-wide'>
            Tăng ca
          </span>
        </div>
        <p className='text-lg font-semibold text-green-800 dark:text-green-200 mt-1'>
          {formatVND(rewards?.overtimeBonus)}
        </p>
      </div>
      <div className='bg-green-50 dark:bg-green-800/50 border border-green-200 dark:border-green-700 rounded-lg p-3'>
        <div className='flex items-center gap-2'>
          <span className='text-xs font-medium text-green-600 dark:text-green-400 tracking-wide'>
            Hiệu suất
          </span>
        </div>
        <p className='text-lg font-semibold text-green-800 dark:text-green-200 mt-1'>
          {formatVND(rewards?.performanceBonus)}
        </p>
      </div>
    </div>
  </div>
));

RewardCards.displayName = 'RewardCards';

const useRefTypeContent = (detail: ISystemLogs | null | undefined) => {
  return useMemo(() => {
    if (!detail) return null;

    const commonEmployeeInfo = (employee: any) => (
      <InfoRow
        label='👨‍💼 Nhân viên'
        value={
          employee ? (
            <span className='text-gray-800 dark:text-gray-200 leading-relaxed'>
              {employee.username} - {employee.email}
            </span>
          ) : (
            '—'
          )
        }
      />
    );

    const statusChangeRow = (
      <InfoRow
        label='🔄 Trạng thái'
        value={
          <div className='flex items-center gap-1'>
            <span className={classNames(StatusColor[detail.previousValue])}>
              {StatusLabel[detail?.previousValue]}
            </span>
            <ArrowRightIcon color='#667085' />
            <span className={classNames(StatusColor[detail.newValue])}>
              {StatusLabel[detail?.newValue]}
            </span>
          </div>
        }
      />
    );

    switch (detail.refType) {
      case REF_TYPE.REQUEST_SCHEDULE:
        return (
          <>
            {commonEmployeeInfo(detail.refId?.employee)}
            <InfoRow
              label='📄 Yêu cầu'
              value={
                detail.refId ? (
                  <span className='text-gray-800 dark:text-gray-200 leading-relaxed'>
                    {RequestOutCategoryLabel[detail.refId.type]} -{' '}
                    {detail.refId.minutes} Phút
                  </span>
                ) : (
                  '—'
                )
              }
            />
            <InfoRow
              label='💬 Lý do'
              value={
                detail.refId?.reason ? (
                  <span className='text-gray-800 dark:text-gray-200 leading-relaxed'>
                    {detail.refId.reason}
                  </span>
                ) : (
                  '—'
                )
              }
            />
            <InfoRow
              label='📅 Ngày làm việc'
              value={
                detail.refId ? (
                  <span className='inline-flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm font-medium'>
                    <span className='w-2 h-2 bg-green-500 rounded-full'></span>
                    {formatDate(detail.refId?.schedule?.date, 'dd/MM/yyyy')}
                  </span>
                ) : (
                  '—'
                )
              }
            />
            {statusChangeRow}
          </>
        );

      case REF_TYPE.REQUEST_OFF:
        return (
          <>
            {commonEmployeeInfo(detail.refId?.employee)}
            <InfoRow
              label='📄 Loại nghỉ phép'
              value={
                detail.refId ? (
                  <span className='text-gray-800 dark:text-gray-200 leading-relaxed'>
                    {RequestOffCategoryLabel[detail.refId.typeOff]} (
                    {detail.refId.typeOff})
                  </span>
                ) : (
                  '—'
                )
              }
            />
            <InfoRow
              label='💬 Lý do'
              value={
                detail.refId?.reason ? (
                  <span className='text-gray-800 dark:text-gray-200 leading-relaxed'>
                    {detail.refId.reason}
                  </span>
                ) : (
                  '—'
                )
              }
            />
            <InfoRow
              label='📅 Ngày làm việc'
              value={
                detail.refId ? (
                  <span className='inline-flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm font-medium'>
                    <span className='w-2 h-2 bg-green-500 rounded-full'></span>
                    {formatDate(detail.refId?.schedule?.date, 'dd/MM/yyyy')}
                  </span>
                ) : (
                  '—'
                )
              }
            />
            {statusChangeRow}
          </>
        );

      case REF_TYPE.SCHEDULE:
        return (
          <>
            {commonEmployeeInfo(detail.refId?.employee)}
            <InfoRow
              label='📅 Ngày làm việc'
              value={
                detail.refId ? (
                  <span className='inline-flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm font-medium'>
                    <span className='w-2 h-2 bg-green-500 rounded-full'></span>
                    {formatDate(detail.refId?.date, 'dd/MM/yyyy')}
                  </span>
                ) : (
                  '—'
                )
              }
            />
            <InfoRow
              label='⏰ Ca làm việc'
              value={
                detail.refId?.shift ? (
                  <span className='inline-flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm font-medium'>
                    {detail.refId.shift.name}
                    <span className='w-2 h-2 bg-green-500 rounded-full'></span>
                    {detail.refId.shift.startTime} -{' '}
                    {detail.refId.shift.endTime}
                  </span>
                ) : (
                  '—'
                )
              }
            />
          </>
        );

      case REF_TYPE.TEAM:
        return (
          <InfoRow
            label='🏢 Tên phòng ban'
            value={
              detail.refId?.name ? (
                <span className='text-gray-800 dark:text-gray-200 leading-relaxed'>
                  {detail.refId.name}
                </span>
              ) : (
                '—'
              )
            }
          />
        );

      case REF_TYPE.SHIFT:
        return (
          <>
            <InfoRow
              label='⏰ Ca làm việc'
              value={
                detail.refId ? (
                  <span className='inline-flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm font-medium'>
                    {detail.refId?.name}
                    <span className='w-2 h-2 bg-green-500 rounded-full'></span>
                    {detail.refId?.startTime} - {detail.refId?.endTime}
                  </span>
                ) : (
                  '—'
                )
              }
            />
            <InfoRow
              label='⏰ Nghỉ giữa ca'
              value={
                detail.refId ? (
                  <span className='inline-flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm font-medium'>
                    <span className='w-2 h-2 bg-green-500 rounded-full'></span>
                    {detail.refId?.startBreakTime} - {detail.refId?.endTimeOff}
                  </span>
                ) : (
                  '—'
                )
              }
            />
          </>
        );

      case REF_TYPE.EMPLOYEE_MATERIAL:
        return (
          <>
            <InfoRow
              label='📄 Dụng cụ'
              value={
                detail.refId && (
                  <div className='bg-gray-50 dark:bg-gray-800 rounded-lg p-3 w-fit'>
                    <p className='text-gray-700 dark:text-gray-300 leading-relaxed'>
                      {detail.refId?.device} ({detail.refId?.code})
                    </p>
                  </div>
                )
              }
            />
            <InfoRow
              label='👨‍💼 Nhân viên'
              value={
                detail.refId?.employeeId && (
                  <p className='text-gray-700 font-semibold dark:text-gray-300 leading-relaxed'>
                    {detail.refId.employeeId.username}
                  </p>
                )
              }
            />
            <InfoRow
              label='📄 Ghi chú'
              value={
                detail.refId?.note ? (
                  <div className='bg-gray-50 dark:bg-gray-800 rounded-lg p-3 w-fit'>
                    <p className='text-gray-700 dark:text-gray-300 leading-relaxed'>
                      {detail.refId?.note}
                    </p>
                  </div>
                ) : (
                  <span className='text-gray-500 italic'>Không có ghi chú</span>
                )
              }
            />
          </>
        );

      case REF_TYPE.EMPLOYEE_BENEFIT:
        return (
          <>
            <InfoRow
              label='👨‍💼 Nhân viên'
              value={
                detail.refId && (
                  <p className='text-gray-700 font-semibold dark:text-gray-300 leading-relaxed'>
                    {detail.refId.employeeId?.username} (
                    {detail.refId.isOfficial ? 'chuyển chính' : 'thử việc'})
                  </p>
                )
              }
            />
            <InfoRow
              label='🎁 Phúc lợi'
              value={
                detail.refId?.benefits ? (
                  <BenefitCards benefits={detail.refId.benefits} />
                ) : (
                  <span className='text-gray-400 dark:text-gray-500 italic'>
                    —
                  </span>
                )
              }
            />
            <InfoRow
              label='📅 Ngày phép'
              value={
                detail.refId?.employeeId && (
                  <p className='text-gray-700 font-semibold dark:text-gray-300 leading-relaxed'>
                    {detail.refId?.benefits?.paidLeaveDays}
                  </p>
                )
              }
            />
            <InfoRow
              label='📋 BHXH'
              value={
                detail.refId?.employeeId && (
                  <p className='text-gray-700 font-semibold dark:text-gray-300 leading-relaxed'>
                    {detail.refId?.benefits?.hasInsurance ? 'Có' : 'Không'}
                  </p>
                )
              }
            />
          </>
        );

      case REF_TYPE.BENEFIT_TEMPLATE: {
        const benefitData = detail.refId || detail.note;
        return (
          <>
            <InfoRow
              label='📋 Tên chính sách'
              value={
                benefitData && (
                  <p className='text-gray-700 font-semibold dark:text-gray-300 leading-relaxed'>
                    {benefitData?.name}
                  </p>
                )
              }
            />
            <InfoRow
              label='🏢 Bộ phận'
              value={
                detail.note && (
                  <p className='text-gray-700 font-semibold dark:text-gray-300 leading-relaxed'>
                    {detail.note?.teamName}
                  </p>
                )
              }
            />
            <InfoRow
              label='👔 Chức vụ'
              value={
                benefitData && (
                  <p className='text-gray-700 font-semibold dark:text-gray-300 leading-relaxed'>
                    {benefitData?.role} (
                    {detail.refId?.isOfficial ? 'chuyển chính' : 'thử việc'})
                  </p>
                )
              }
            />
            <InfoRow
              label='🎁 Phúc lợi'
              value={
                benefitData?.benefits && (
                  <BenefitCards benefits={benefitData.benefits} />
                )
              }
            />
            <InfoRow
              label='📅 Ngày phép'
              value={
                benefitData?.benefits && (
                  <p className='text-gray-700 font-semibold dark:text-gray-300 leading-relaxed'>
                    {benefitData?.benefits?.paidLeaveDays}
                  </p>
                )
              }
            />
          </>
        );
      }

      case REF_TYPE.USER:
        return (
          <>
            <InfoRow
              label='👨‍💼 Nhân viên'
              value={
                detail.refId ? (
                  <span className='text-gray-800 font-medium dark:text-gray-200 leading-relaxed'>
                    {detail.refId.username} - {detail.refId.email}
                  </span>
                ) : (
                  '—'
                )
              }
            />
            <InfoRow
              label='📄Sinh nhật'
              value={
                detail.refId?.birthday ? (
                  <span className='text-sm text-gray-600 dark:text-gray-400'>
                    {detail.refId.birthday}
                  </span>
                ) : (
                  '—'
                )
              }
            />
            <InfoRow
              label='🎭 Chức vụ'
              value={
                detail.refId ? (
                  <span className='inline-flex items-center dark:bg-green-900/20 rounded-full text-sm font-medium'>
                    {USER_ROLE[detail.refId.role as keyof typeof USER_ROLE]}
                  </span>
                ) : (
                  <span className='text-gray-500 italic'>Chưa có</span>
                )
              }
            />
            <InfoRow
              label='📅 Nhận việc'
              value={
                detail.refId?.onboardAt ? (
                  <span className='text-sm text-gray-600 dark:text-gray-400'>
                    {format(new Date(detail.refId.onboardAt), 'dd/MM/yyyy')}
                  </span>
                ) : (
                  '—'
                )
              }
            />
          </>
        );

      case REF_TYPE.POLICY:
        return (
          <>
            <InfoRow
              label='👨‍💻 Thử việc'
              value={
                detail.refId?.rewards?.other ? (
                  <div className='space-y-3'>
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3'>
                      <div className='bg-orange-50 dark:bg-orange-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-3 hover:shadow-md transition-shadow duration-200'>
                        <div className='flex items-center gap-2 mb-1'>
                          <span className='text-xs font-medium text-orange-600 dark:text-orange-400 tracking-wide whitespace-nowrap'>
                            Tỷ lệ lương chính thức
                          </span>
                        </div>
                        <p className='text-lg font-semibold text-orange-800 dark:text-orange-200'>
                          {detail.refId?.probationSalaryPercent}%
                        </p>
                      </div>
                      <div className='bg-orange-50 dark:bg-orange-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-3 hover:shadow-md transition-shadow duration-200'>
                        <div className='flex items-center gap-2 mb-1'>
                          <span className='text-xs font-medium text-orange-600 dark:text-orange-400  tracking-wide'>
                            Số ngày phép
                          </span>
                        </div>
                        <p className='text-lg font-semibold text-orange-800 dark:text-orange-200'>
                          {detail.refId?.probationLeaveDays}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <span className='text-gray-400 dark:text-gray-500 italic'>
                    —
                  </span>
                )
              }
            />
            <InfoRow
              label='❌ Phạt'
              value={
                detail.refId?.penalties ? (
                  <PenaltyCards penalties={detail.refId.penalties} />
                ) : (
                  <span className='text-red-400 dark:text-red-500 italic'>
                    —
                  </span>
                )
              }
            />
            <InfoRow
              label='🎁 Thưởng'
              value={
                detail.refId?.rewards ? (
                  <RewardCards rewards={detail.refId.rewards} />
                ) : (
                  <span className='text-gray-400 dark:text-gray-500 italic'>
                    —
                  </span>
                )
              }
            />
            <InfoRow
              label='⚙️ Khác'
              value={
                detail.refId?.rewards?.other ? (
                  <div className='space-y-3'>
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3'>
                      {detail.refId.rewards.other.map(
                        (item: any, index: number) => (
                          <div
                            key={index}
                            className='bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-3 hover:shadow-md transition-shadow duration-200'
                          >
                            <div className='flex items-center gap-2 mb-1'>
                              <span className='text-xs font-medium text-gray-600 dark:text-gray-400 tracking-wide'>
                                {item.name}
                              </span>
                            </div>
                            <p className='text-lg font-semibold text-gray-800 dark:text-gray-200'>
                              {formatVND(item.amount)}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                ) : (
                  <span className='text-gray-400 dark:text-gray-500 italic'>
                    —
                  </span>
                )
              }
            />
          </>
        );

      default:
        return null;
    }
  }, [detail]);
};

const getActionTypeLabel = (actionType: string) => {
  return ACTION_SYSTEM_LOG_LABEL[actionType] || 'duyệt';
};

export default memo(function SystemLogsDetailModal({
  detail,
  isOpen,
  closeModal,
}: Props) {
  const refTypeContent = useRefTypeContent(detail);

  const triggeredByUser = useMemo(
    () => detail?.triggeredBy?.username || detail?.approvedBy?.email,
    [detail?.triggeredBy?.username, detail?.approvedBy?.email]
  );

  const actionTypeLabel = useMemo(
    () => getActionTypeLabel(detail?.actionType as string),
    [detail?.actionType]
  );

  return (
    <Modal
      title={
        <>
          <h4 className='text-2xl sm:text-xl font-bold text-white mb-1'>
            Hoạt động
          </h4>
          <p className='text-blue-100 text-sm'>Chi tiết hoạt động</p>
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
      className='max-w-[800px] m-4'
    >
      <div className='lg:p-4'>
        <InfoRow
          label='📋 Hành động'
          value={
            detail?.description ? (
              <span className='font-semibold text-gray-800 dark:text-gray-200 leading-relaxed'>
                {detail.description}
              </span>
            ) : (
              '—'
            )
          }
        />

        {refTypeContent}

        <InfoRow
          label={`✅ Người ${actionTypeLabel}`}
          value={
            triggeredByUser ? (
              <span className='inline-flex items-center gap-2 px-3 py-1 bg-green-50 dark:bg-green-900/20 rounded-full text-sm font-medium text-green-700 dark:text-green-400'>
                <span className='w-2 h-2 bg-green-500 rounded-full'></span>
                {triggeredByUser}
              </span>
            ) : (
              <span className='text-gray-500 italic'>Chưa có</span>
            )
          }
        />

        <InfoRow
          label='🎭 Chức vụ'
          value={
            detail?.triggeredBy ? (
              <span className='inline-flex items-center dark:bg-green-900/20 rounded-full text-sm font-medium'>
                {USER_ROLE[detail.triggeredBy.role as keyof typeof USER_ROLE]}
              </span>
            ) : (
              <span className='text-gray-500 italic'>Chưa có</span>
            )
          }
        />

        <InfoRow
          label='✅ Lúc'
          value={
            detail?.updatedAt ? (
              <span className='text-sm text-gray-600 dark:text-gray-400'>
                {format(new Date(detail.updatedAt), "dd/MM/yyyy 'lúc' HH:mm")}
              </span>
            ) : (
              <span className='text-gray-500 italic'>Chưa duyệt</span>
            )
          }
        />
      </div>
    </Modal>
  );
});
