import { format, setDefaultOptions } from 'date-fns';
import { vi } from 'date-fns/locale';
import classNames from 'classnames';
import { memo } from 'react';
import isEqual from 'lodash/isEqual';
import { ScrollSync, ScrollSyncPane } from 'react-scroll-sync';
import { ISchedule, IShiftSchedule, IShiftScheduleEmployee } from '@/types';
import isEmpty from 'lodash/isEmpty';
import { USER_ROLE } from '@/configs';
import { formatVND } from '@/shared/utils/helpers';
import ShiftContent from './ShiftContent';

setDefaultOptions({ locale: vi });

interface IEmployeeShiftScheduleProps {
  dateRange: Array<string | Date>;
  employeeShiftSchedule: Array<IShiftSchedule>;
  isScheduleLoading?: boolean;
  isShowTime?: boolean;
  handleEditShift?: (
    shiftData: ISchedule & {
      employee: IShiftScheduleEmployee;
    }
  ) => void;
}

const Loading = () => {
  return (
    <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30'>
      <div className='w-12 h-12 text-gray-200 animate-spin stroke-brand-500 dark:text-gray-800'>
        <svg
          width='48'
          height='48'
          viewBox='0 0 48 48'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <circle
            cx='24'
            cy='24'
            r='22'
            stroke='currentColor'
            strokeWidth='4'
          ></circle>
          <mask id='path-2-inside-1_3755_26214' fill='white'>
            <path d='M46.0051 24C47.1068 24 48.0086 23.1053 47.9172 22.0073C47.5452 17.5426 45.9291 13.2565 43.2335 9.64482C40.139 5.4986 35.7874 2.4634 30.8274 0.991599C25.8674 -0.480201 20.5646 -0.309788 15.7094 1.47744C11.4802 3.03423 7.78776 5.74518 5.04079 9.28438C4.36525 10.1547 4.63305 11.3965 5.55649 11.9975C6.47993 12.5984 7.70826 12.3295 8.39813 11.4705C10.6656 8.64692 13.6659 6.48122 17.0877 5.22166C21.1357 3.73155 25.557 3.58947 29.6924 4.81659C33.8278 6.04371 37.456 8.57434 40.0361 12.0313C42.217 14.9533 43.5504 18.405 43.9108 22.0083C44.0205 23.1046 44.9033 24 46.0051 24Z'></path>
          </mask>
          <path
            d='M46.0051 24C47.1068 24 48.0086 23.1053 47.9172 22.0073C47.5452 17.5426 45.9291 13.2565 43.2335 9.64482C40.139 5.4986 35.7874 2.4634 30.8274 0.991599C25.8674 -0.480201 20.5646 -0.309788 15.7094 1.47744C11.4802 3.03423 7.78776 5.74518 5.04079 9.28438C4.36525 10.1547 4.63305 11.3965 5.55649 11.9975C6.47993 12.5984 7.70826 12.3295 8.39813 11.4705C10.6656 8.64692 13.6659 6.48122 17.0877 5.22166C21.1357 3.73155 25.557 3.58947 29.6924 4.81659C33.8278 6.04371 37.456 8.57434 40.0361 12.0313C42.217 14.9533 43.5504 18.405 43.9108 22.0083C44.0205 23.1046 44.9033 24 46.0051 24Z'
            stroke='currentStroke'
            strokeWidth='8'
            mask='url(#path-2-inside-1_3755_26214)'
          ></path>
        </svg>
      </div>
    </div>
  );
};

const EmployeeShiftSchedule = ({
  dateRange,
  employeeShiftSchedule,
  isScheduleLoading,
  isShowTime,
  handleEditShift,
}: IEmployeeShiftScheduleProps) => {
  return (
    <div className='mt-4 relative'>
      <ScrollSync enabled={!isScheduleLoading} vertical={false}>
        <div className='border border-gray-300 rounded-xl'>
          <ScrollSyncPane>
            <div className='text-sm flex items-center overflow-auto no-scrollbar border-b rounded-t-xl'>
              <div className='flex items-center font-bold min-w-[210px] xl:min-w-[250px] p-4 sticky left-0 bg-gray-50 h-[70px] border-r'>
                Nhân sự
              </div>

              {dateRange?.map((item, index) => (
                <div
                  key={index}
                  className='p-4 text-center min-w-[210px] bg-gray-50 h-[70px]'
                >
                  <div className='font-semibold'>{format(item, 'EEEE')}</div>
                  <div className='text-xs'>{format(item, 'dd/MM/yyyy')}</div>
                </div>
              ))}
            </div>
          </ScrollSyncPane>
          <ScrollSyncPane>
            <div className='text-sm flex overflow-hidden overflow-x-auto rounded-b-xl relative'>
              <div className='relative'>
                {employeeShiftSchedule.map((item, index) => (
                  <div className='flex items-stretch border-b' key={index}>
                    <div className='font-bold min-w-[210px] xl:min-w-[250px] py-2 sticky left-0 border-r z-10 bg-white flex flex-col justify-center'>
                      <div className='px-4'>
                        <div className='line-clamp-1'>
                          {item?.employee?.username || 'Nhân sự'}
                        </div>
                        {item?.employee?.fullname && (
                          <div className='font-medium text-gray-700 mt-0.5 line-clamp-1 max-w-[130px] md:max-w-[210px]'>
                            Tên: {item?.employee?.fullname}
                          </div>
                        )}
                        <div className='text-[13px] text-gray-600 font-normal mt-1.5'>
                          {USER_ROLE[item.employee.role]}
                          {item.employee?.team?.name
                            ? ` - ${item.employee?.team?.name}`
                            : ''}
                        </div>
                      </div>
                    </div>

                    <div className='flex items-center justify-center'>
                      {item.schedules?.map(
                        (scheduleItem, scheduleItemIndex) => (
                          <div
                            key={scheduleItemIndex}
                            className={classNames(
                              'p-2 min-w-[210px] cursor-pointer',
                              {
                                'h-full': scheduleItem.isHoliday,
                              }
                            )}
                            onClick={() => {
                              if (scheduleItem.isHoliday) return;

                              handleEditShift?.({
                                ...scheduleItem,
                                employee: item?.employee,
                              });
                            }}
                          >
                            {!scheduleItem.isHoliday && (
                              <div
                                className={classNames(
                                  'relative text-xs p-4 border border-dashed rounded-xl min-h-[50px] font-medium bg-white',
                                  {
                                    '!bg-blue-50 text-brand-500 border-0':
                                      !isEmpty(scheduleItem.shift),
                                    '!bg-error-50 !text-error-500 !border !border-error-500':
                                      !isEmpty(scheduleItem.duplicate),
                                  }
                                )}
                              >
                                <ShiftContent
                                  duplicateSchedule={
                                    scheduleItem?.duplicate || []
                                  }
                                  shiftDetail={scheduleItem?.shift}
                                  isShowTime={isShowTime}
                                  itemIndex={scheduleItemIndex}
                                  itemTotal={item.schedules?.length}
                                />
                                {scheduleItem.overTimeStart &&
                                  scheduleItem?.overTimeEnd && (
                                    <div className='flex items-center mt-2 gap-2 w-full'>
                                      <div className='min-w-[50px] whitespace-nowrap text-error-400'>
                                        Tăng ca:
                                      </div>
                                      <div className='flex-1 flex items-center justify-center'>
                                        <div className='flex items-center gap-1 text-gray-400'>
                                          <span>
                                            {scheduleItem?.overTimeStart
                                              ? format(
                                                  scheduleItem.overTimeStart,
                                                  'HH:mm'
                                                )
                                              : '--:--'}
                                          </span>
                                          <span>|</span>
                                          <span>
                                            {scheduleItem?.overTimeEnd
                                              ? format(
                                                  scheduleItem.overTimeEnd,
                                                  'HH:mm'
                                                )
                                              : '--:--'}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                {!isEmpty(scheduleItem?.shift) &&
                                  isShowTime && (
                                    <div className='mt-2'>
                                      Lương:&nbsp;
                                      {formatVND(
                                        scheduleItem?.shift?.[0]
                                          ?.baseSalaryInDay || 0
                                      )}
                                    </div>
                                  )}
                              </div>
                            )}
                            {scheduleItem.isHoliday && (
                              <div className='text-[13px] flex items-center justify-center bg-[repeating-linear-gradient(45deg,transparent,transparent_3px,rgba(0,0,0,0.1)_3px,rgba(0,0,0,0.1)_4px)] h-full rounded-xl bg-green-100 text-success-500 font-medium'>
                                Nghỉ: {scheduleItem.holiday?.name}
                              </div>
                            )}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                ))}
                {isScheduleLoading && (
                  <div className='absolute inset-0 z-40 bg-gray-400/20 w-full' />
                )}
              </div>
            </div>
          </ScrollSyncPane>
        </div>
      </ScrollSync>
      {isScheduleLoading && <Loading />}
    </div>
  );
};

export default memo(EmployeeShiftSchedule, isEqual);
