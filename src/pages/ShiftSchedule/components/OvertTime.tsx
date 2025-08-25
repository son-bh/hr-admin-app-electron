import { useState } from 'react';
import OverTimeModal from './OverTimeModal';
import { IOverTime, ISchedule, IShiftScheduleEmployee } from '@/types';
import { FaPlus } from 'react-icons/fa';
import { format } from 'date-fns';
import { LuPencil } from 'react-icons/lu';

export default function OverTime({
  scheduleDetail,
  isPastDay,
  handleSetOverTime,
}: {
  isPastDay: boolean;
  scheduleDetail?: (ISchedule & { employee: IShiftScheduleEmployee }) | null;
  handleSetOverTime: ({
    overTimeDetail,
  }: {
    overTimeDetail: IOverTime;
  }) => void;
}) {
  const [isOpenOTModal, setIsOpenOTModal] = useState<boolean>(false);

  return (
    <>
      <div>
        {!isPastDay && !scheduleDetail?.overTimeStart && (
          <button
            className='flex items-center justify-center text-xs text-blue-500 gap-1 p-2 border border-blue-500 rounded-md'
            onClick={() => {
              setIsOpenOTModal(true);
            }}
          >
            <FaPlus className='w-3 h-3' />
            <span>Thêm giờ tăng ca</span>
          </button>
        )}
        {scheduleDetail?.overTimeStart && (
          <div className='flex items-start gap-4'>
            <div>
              <div className='flex gap-3'>
                <div className='font-medium min-w-[60px]'>Tăng ca:</div>

                <div className='flex items-center gap-1 text-gray-600 font-semibold'>
                  <div className='flex items-center gap-1'>
                    <span>
                      {scheduleDetail?.overTimeStart
                        ? format(scheduleDetail.overTimeStart, 'HH:mm')
                        : '--:--'}
                    </span>
                  </div>
                  <span>|</span>
                  <div className='flex items-center gap-1'>
                    <span>
                      {scheduleDetail?.overTimeEnd
                        ? format(scheduleDetail.overTimeEnd, 'HH:mm')
                        : '--:--'}
                    </span>
                  </div>
                </div>
              </div>
              {scheduleDetail?.noteForOvertime && (
                <div className='text-[13px] flex gap-1 mt-2 text-gray-600 pl-4'>
                  <div className='min-w-[60px]'>Ghi chú:</div>
                  <span>{scheduleDetail?.noteForOvertime}</span>
                </div>
              )}
            </div>
            <button
              className='rounded text-gray-500 hover:text-blue-400'
              onClick={() => {
                setIsOpenOTModal(true);
              }}
            >
              <LuPencil className='w-4 h-4' />
            </button>
          </div>
        )}
      </div>
      {isOpenOTModal && (
        <OverTimeModal
          isOpen={isOpenOTModal}
          scheduleDetail={scheduleDetail}
          handleSetOverTime={handleSetOverTime}
          closeModal={() => {
            setIsOpenOTModal(false);
          }}
        />
      )}
    </>
  );
}
