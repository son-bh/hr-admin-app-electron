import Button from '@/components/ui/button/Button';
import { Modal } from '@/components/ui/modal';
import {
  IOptionSelect,
  IOverTime,
  IRequestOff,
  ISchedule,
  IShift,
  IShiftScheduleEmployee,
} from '@/types';
import { format } from 'date-fns';
import { GoXCircle } from 'react-icons/go';
import DeleteShiftEmployeeModal from './DeleteShiftEmployeeModal';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { FaPlus, FaCheck } from 'react-icons/fa6';
import {
  useAllocationShiftEmployeeMutation,
  useQueryGetShifts,
} from '@/services';
import { mappingShiftOptions } from '@/shared/utils/shift';
import RSelect from '@/components/form/form-elements/RSelect';
import {
  MdClose,
  MdLogin,
  MdLogout,
  MdFreeBreakfast,
  MdWarning,
  MdOutlineError,
} from 'react-icons/md';
import {
  RequestOffCategoryLabel,
  Status,
  StatusColor,
  StatusLabel,
  StatusRequestBgColor,
  ToastType,
} from '@/shared/constants';
import { toast } from '@/components/toast';
import { isEmpty } from 'lodash';
import classNames from 'classnames';
import Tooltip from '@/components/ui/tooltips';
import { checkIsPastDay, formatVND } from '@/shared/utils/helpers';
import OverTime from '../OvertTime';

interface IShiftDetailModalProps {
  scheduleDetail?: (ISchedule & { employee: IShiftScheduleEmployee }) | null;
  isOpen: boolean;
  closeModal: () => void;
  handleDeleteSuccess: (
    shift: IShift,
    shiftDate: string,
    username: string
  ) => void;
  handleUpdateSuccess: (
    shift: IShift,
    shiftDate: string,
    username: string
  ) => void;
  handleSetOverTimeSuccess: (
    overTimeDetail: IOverTime,
    shiftDate: string,
    username: string
  ) => void;
}

const TimeContent = ({
  label,
  content,
  icon,
  classNameContainer,
}: {
  label: string;
  content: string;
  icon: ReactNode;
  classNameContainer?: string;
}) => {
  return (
    <div
      className={classNames(
        'flex flex-col items-center px-1 py-2 rounded-md gap-2 bg-blue-50 text-blue-500',
        classNameContainer
      )}
    >
      {icon}
      <div className='flex flex-col items-center gap-1'>
        <span>{label}</span>
        <span className='text-[13px] md:text-sm font-medium'>{content}</span>
      </div>
    </div>
  );
};

const RequestOffDetail = ({
  requestOffDetail,
}: {
  requestOffDetail: IRequestOff;
}) => {
  return (
    <div className='text-sm !text-black text-start h-1/2 pl-4 my-3'>
      <div className='flex items-center gap-3'>
        <div className='font-medium'>Xin nghỉ</div>
        <div className='space-y-2 bg-error-50 text-error-600 min-w-[160px] px-3 py-2 text-[13px] font-medium drop-shadow-4xl mt-2 rounded-lg'>
          <p>
            Phép: {requestOffDetail?.typeOff} -{' '}
            {RequestOffCategoryLabel[requestOffDetail?.typeOff]}
          </p>
          <p className='line-clamp-1'>Lý do: {requestOffDetail?.reason}</p>
          <p>
            Trạng thái:{' '}
            <span
              className={classNames(
                'p-1 rounded-md',
                StatusColor[requestOffDetail?.status],
                StatusRequestBgColor[requestOffDetail?.status]
              )}
            >
              {StatusLabel[requestOffDetail?.status]}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default function ShiftDetailModal({
  scheduleDetail,
  isOpen,
  closeModal,
  handleDeleteSuccess,
  handleUpdateSuccess,
  handleSetOverTimeSuccess,
}: IShiftDetailModalProps) {
  const [isShowUpdateShift, setIsShowUpdateShift] = useState<boolean>(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState<boolean>(false);
  const [shiftDetail, setShiftDetail] = useState<IShift | null>(null);
  const [shiftOptions, setShiftOptions] = useState<Array<IOptionSelect>>([]);
  const [selectedShift, setSelectedShift] = useState<IOptionSelect | null>(
    null
  );
  const [error, setError] = useState<string>('');

  const { data: shiftData } = useQueryGetShifts();
  const allocationShiftEmployeeMutation = useAllocationShiftEmployeeMutation();

  const isPastDay = useMemo(
    () => checkIsPastDay(scheduleDetail?.date as string),
    [scheduleDetail?.date]
  );
  const isDayNoSchedule = useMemo(
    () => !isPastDay && isEmpty(scheduleDetail?.shift),
    [isPastDay, scheduleDetail?.shift]
  );

  useEffect(() => {
    const shiftOptionsTmp = mappingShiftOptions(shiftData?.data || []);
    const shiftOptionsValid = shiftOptionsTmp.filter(
      shiftItem =>
        !scheduleDetail?.shift.find(item => item._id === shiftItem.value)
    );

    setShiftOptions(shiftOptionsValid);
  }, [shiftData?.data, scheduleDetail?.shift]);

  const handleUpdateShift = () => {
    setError('');

    allocationShiftEmployeeMutation.mutate(
      {
        day: scheduleDetail?.date,
        userIds: [scheduleDetail?.employee._id as string],
        shiftIds: [selectedShift?.value as string],
        type: 'DAY',
      },
      {
        onSuccess: res => {
          const dataRes = res?.data;
          const conflicts = res?.conflicts;

          if (!isEmpty(conflicts)) {
            setError('Trùng ca. Vui lòng kiểm tra lại.');
            return;
          }

          const shiftOptionDetail = shiftData?.data?.find(
            item => selectedShift?.value === item._id
          );

          const newShiftDetail = {
            ...shiftOptionDetail,
            _id: dataRes[0]?.shift,
            scheduleId: dataRes[0]?._id,
          };

          handleUpdateSuccess(
            newShiftDetail as IShift,
            scheduleDetail?.date as string,
            scheduleDetail?.employee.username as string
          );
          setIsShowUpdateShift(false);
          setSelectedShift(null);
          toast(ToastType.Success, 'Thêm ca làm việc thành công');
        },
      }
    );
  };

  const handleCloseModal = () => {
    closeModal();
    setIsShowUpdateShift(false);
    setSelectedShift(null);
  };

  const handleSetOverTime = ({
    overTimeDetail,
  }: {
    overTimeDetail: IOverTime;
  }) => {
    handleSetOverTimeSuccess(
      overTimeDetail,
      scheduleDetail?.date as string,
      scheduleDetail?.employee.username as string
    );
  };

  return (
    <>
      <Modal
        title={
          <h4 className='text-2xl sm:text-xl font-bold text-white'>
            Lịch làm việc ngày:{' '}
            {scheduleDetail?.date && format(scheduleDetail?.date, 'dd/MM/yyyy')}
          </h4>
        }
        footerContent={
          <div className='flex items-center gap-3 px-2 mt-6 justify-end'>
            <div className='flex items-center gap-3 px-2 mt-6 justify-end'>
              <Button size='sm' variant='outline' onClick={handleCloseModal}>
                Đóng
              </Button>
            </div>
          </div>
        }
        isOpen={isOpen}
        onClose={handleCloseModal}
        className='max-w-[600px] m-4'
      >
        <div className='lg:p-4'>
          <div className='text-sm space-y-3'>
            <div className='text-base font-medium'>
              Nhân viên:{' '}
              {scheduleDetail?.employee.fullname ||
                scheduleDetail?.employee.username}
            </div>
            <div className='space-y-3'>
              {scheduleDetail?.shift?.map((item, index) => (
                <div key={index} className='relative gap-3'>
                  <div>
                    <div className='mb-2 font-medium'>Tên: {item.name}</div>
                    <div className='grid grid-cols-3 gap-3'>
                      <TimeContent
                        classNameContainer='bg-blue-50 text-blue-500'
                        icon={<MdLogin className='w-7 h-7' />}
                        label='Giờ vào ca:'
                        content={item.startTime}
                      />
                      <TimeContent
                        classNameContainer='bg-warning-50 text-warning-500'
                        icon={<MdFreeBreakfast className='w-7 h-7' />}
                        label='Nghỉ giữa giờ'
                        content={`${item.startBreakTime} - ${item.endTimeOff}`}
                      />
                      <TimeContent
                        classNameContainer='bg-gray-700 text-white'
                        icon={<MdLogout className='w-7 h-7' />}
                        label='Giờ ra ca:'
                        content={item.endTime}
                      />
                    </div>
                    <div className='flex items-start gap-6 mt-2'>
                      <div>
                        {!isEmpty(item?.requestOff) && (
                          <RequestOffDetail
                            requestOffDetail={item.requestOff}
                          />
                        )}
                        {item?.requestOff?.status !== Status.APPROVED && (
                          <div className='flex gap-3'>
                            <div className='font-medium min-w-[60px]'>
                              Thực tế:
                            </div>
                            <div className='flex items-center gap-1 text-gray-400 font-semibold'>
                              <div className='flex items-center gap-1'>
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
                                {item.noteForCheckIn && (
                                  <Tooltip message={item.noteForCheckIn}>
                                    <MdWarning className='w-4 h-4 text-error-500' />
                                  </Tooltip>
                                )}
                              </div>
                              <span>|</span>
                              <div className='flex items-center gap-1'>
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
                                {item.noteForCheckOut && (
                                  <Tooltip message={item.noteForCheckOut}>
                                    <MdWarning className='w-4 h-4 text-error-500' />
                                  </Tooltip>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                        <div className='flex gap-3 mt-2'>
                          <div className='font-medium min-w-[60px]'>Lương:</div>
                          <div className='flex items-center gap-1 text-gray-700 font-semibold'>
                            {formatVND(item?.baseSalaryInDay || 0)}
                          </div>
                        </div>
                      </div>
                      {!isEmpty(item?.clientToken?.duplicateToken) && (
                        <div className='h-[16px]'>
                          <Tooltip
                            message={
                              <div>
                                <span>Điểm danh hộ:</span>

                                {item?.clientToken?.duplicateToken?.map(
                                  (item, index) => (
                                    <div key={index}>
                                      {item.employeeReference} -{' '}
                                      {item.tokenType}
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
                  </div>
                  {!isPastDay &&
                    !item.checkInTime &&
                    item.requestOff?.status !== Status.APPROVED && (
                      <button
                        className='absolute right-0 top-0'
                        onClick={() => {
                          setShiftDetail(item);
                          setIsOpenDeleteModal(true);
                        }}
                      >
                        <GoXCircle className='w-4 h-5 text-error-500' />
                      </button>
                    )}
                </div>
              ))}
            </div>
            <div>
              {isDayNoSchedule &&
                (!isShowUpdateShift ? (
                  <div className='mt-3'>
                    <button
                      className='flex items-center justify-center text-xs text-blue-500 gap-1 p-2 border border-blue-500 rounded-md'
                      onClick={() => {
                        setIsShowUpdateShift(true);
                      }}
                    >
                      <FaPlus className='w-3 h-3' />
                      <span>Thêm ca</span>
                    </button>
                  </div>
                ) : (
                  <div className='flex items-center gap-2 mt-3'>
                    <RSelect
                      className='min-w-[250px] flex-1'
                      onChange={newValue =>
                        setSelectedShift(newValue as IOptionSelect)
                      }
                      value={selectedShift}
                      options={shiftOptions}
                      placeholder='Chọn ca'
                      isClearable={true}
                      isSearchable={true}
                    />
                    <div className='flex gap-2'>
                      <button
                        className='text-success-400'
                        onClick={handleUpdateShift}
                      >
                        <FaCheck className='w-5 h-5' />
                      </button>
                      <button
                        className='text-error-500'
                        onClick={() => {
                          setSelectedShift(null);
                          setIsShowUpdateShift(false);
                          setError('');
                        }}
                      >
                        <MdClose className='w-5 h-5' />
                      </button>
                    </div>
                  </div>
                ))}
              {error && (
                <p className='mt-1.5 text-xs text-error-500'>{error}</p>
              )}
            </div>
            {!isEmpty(scheduleDetail?.shift) && (
              <OverTime
                isPastDay={isPastDay}
                scheduleDetail={scheduleDetail}
                handleSetOverTime={handleSetOverTime}
              />
            )}
          </div>
        </div>
      </Modal>
      <DeleteShiftEmployeeModal
        isOpen={isOpenDeleteModal}
        shiftDetail={shiftDetail}
        shiftDate={scheduleDetail?.date}
        username={scheduleDetail?.employee.username}
        handleDeleteSuccess={handleDeleteSuccess}
        closeModal={() => {
          setIsOpenDeleteModal(false);
        }}
      />
    </>
  );
}
