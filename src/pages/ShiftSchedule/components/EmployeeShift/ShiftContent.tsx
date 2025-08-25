import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import { memo } from 'react';
import { ICheckTime, IClientToken, IShift } from '@/types';
import classNames from 'classnames';
import {
  StatusColor,
  StatusLabel,
  StatusRequestBgColor,
} from '@/shared/constants';
import Tooltip from '@/components/ui/tooltips';
import { format } from 'date-fns';
import { MdOutlineError } from 'react-icons/md';

type ShiftContentType = IShift & ICheckTime & { clientToken: IClientToken };

interface IShiftContentProps {
  duplicateSchedule: Array<IShift>;
  shiftDetail: Array<ShiftContentType> | ShiftContentType;
  isShowTime?: boolean;
  itemIndex: number;
  itemTotal: number;
}

const ShiftContent = ({
  duplicateSchedule,
  shiftDetail,
  isShowTime = false,
  itemIndex,
  itemTotal,
}: IShiftContentProps) => {
  if (!isEmpty(duplicateSchedule)) {
    return (
      <div className='absolute w-full h-full left-0 top-0 flex flex-col items-center justify-center'>
        {Array.isArray(duplicateSchedule) &&
          duplicateSchedule.map(item => (
            <div key={item.name}>Trùng: {item.name}</div>
          ))}
      </div>
    );
  }

  return (
    <div className='flex flex-col items-center gap-1.5'>
      {Array.isArray(shiftDetail) && !isEmpty(shiftDetail)
        ? shiftDetail.map(item => (
            <div key={item.name} className='flex items-center gap-2 w-full'>
              <div className='min-w-[50px] whitespace-nowrap'>{item.name}</div>

              <div className='flex-1'>
                {item?.requestOff &&
                Object.keys(item?.requestOff).length > 0 ? (
                  <div
                    className={classNames(
                      // getStatusBorderColor(status),
                      StatusColor[item?.requestOff?.status],
                      StatusRequestBgColor[item?.requestOff?.status],
                      `text-xs !text-black w-full text-center h-1/2 first:border-b p-1 border rounded-lg`
                    )}
                  >
                    <Tooltip
                      message={item?.requestOff?.reason}
                      position='bottom'
                      subChildren={
                        <div className='space-y-2 bg-[#1E2634] min-w-[160px] px-3 py-2 text-xs font-medium drop-shadow-4xl text-white mt-2 rounded-lg'>
                          <p className='line-clamp-1'>
                            Lý do: {item?.requestOff?.reason}
                          </p>
                          <p>
                            Trạng thái:{' '}
                            <span>{StatusLabel[item?.requestOff?.status]}</span>
                          </p>
                        </div>
                      }
                    >
                      Xin nghỉ
                    </Tooltip>
                  </div>
                ) : (
                  <div className='flex items-center justify-center'>
                    {isShowTime && (
                      <div className='flex items-center gap-1 text-gray-400'>
                        <span
                          className={classNames({
                            'text-success-500': item?.checkInTime,
                            '!text-error-500': item.lateMinutes,
                          })}
                        >
                          {item?.checkInTime
                            ? format(item.checkInTime, 'HH:mm')
                            : '--:--'}
                        </span>
                        <span>|</span>
                        <span
                          className={classNames({
                            'text-success-500': item.checkOutTime,
                            '!text-error-500': item.earlyMinutes,
                          })}
                        >
                          {item?.checkOutTime
                            ? format(item.checkOutTime, 'HH:mm')
                            : '--:--'}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
              {!isEmpty(item?.clientToken?.duplicateToken) && (
                <div>
                  <Tooltip
                    position={itemIndex + 1 === itemTotal ? 'left' : 'right'}
                    message={
                      <div>
                        <span>Điểm danh hộ:</span>

                        {item?.clientToken?.duplicateToken?.map(
                          (item, index) => (
                            <div key={index}>
                              {item.employeeReference} - {item.tokenType}
                            </div>
                          )
                        )}
                      </div>
                    }
                  >
                    <MdOutlineError className='w-4 h-4 text-error-500' />
                  </Tooltip>
                </div>
              )}
            </div>
          ))
        : 'Trống ca'}
    </div>
  );
};

export default memo(ShiftContent, isEqual);
