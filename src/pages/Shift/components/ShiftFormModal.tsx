import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { formatDate, isAfter, isBefore } from 'date-fns';
import Button from '@/components/ui/button/Button';
import { Modal } from '@/components/ui/modal';
import { toast } from '@/components/toast';
import { ToastType } from '@/shared/constants/common';
import { IShift } from '@/types';
import { useCreateShiftMutation, useUpdateShiftMutation } from '@/services';
import { ErrorForm } from '@/shared/constants/error';
import {
  TimePickerController,
  InputController,
} from '@/components/form/controller';

interface IShiftFormModalProps {
  shiftDetail?: IShift | null;
  isOpen: boolean;
  closeModal: () => void;
  handleRefetchData: () => void;
}

type FormValues = {
  name: string;
  startTime: string;
  endTime: string;
  startBreakTime: string;
  endTimeOff: string;
};

const defaultValues = {
  name: '',
  startTime: '',
  endTime: '',
  startBreakTime: '',
  endTimeOff: '',
};

const schema = yup.object().shape({
  name: yup.string().required(ErrorForm.Required),
  startTime: yup
    .string()
    .required(ErrorForm.Required)
    .test(
      'isStartTimeThanEndTime',
      () => 'Giờ vào ca phải nhỏ hơn giờ ra ca',
      (value, testContext) => {
        return isBefore(value, testContext.parent.endTime);
      }
    ),
  endTime: yup
    .string()
    .required(ErrorForm.Required)
    .test(
      'isEndTimeLessThanStartTime',
      () => 'Giờ vào ra ca phải nhỏ hơn giờ vào ca',
      (value, testContext) => {
        return isAfter(value, testContext.parent.startTime);
      }
    ),
  startBreakTime: yup
    .string()
    .required(ErrorForm.Required)
    .test(
      'isStartBreakTimeAndStartTimeValid',
      () => 'Giờ nghỉ ca phải lớn giờ vào ca',
      (value, testContext) => {
        return isAfter(value, testContext.parent.startTime);
      }
    )
    .test(
      'isStartBreakTimeAndEndTimeValid',
      () => 'Giờ nghỉ ca phải nhỏ hơn giờ ra ca',
      (value, testContext) => {
        return isBefore(value, testContext.parent.endTime);
      }
    )
    .test(
      'isStartBreakTimeAndEndTImeOffValid',
      () => 'Giờ nghỉ ca phải nhỏ hơn giờ kết thúc nghỉ cả',
      (value, testContext) => {
        return isBefore(value, testContext.parent.endTimeOff);
      }
    ),
  endTimeOff: yup
    .string()
    .required(ErrorForm.Required)
    .test(
      'isStartBreakTimeAndStartTimeValid',
      () => 'Giờ nghỉ ca phải lớn giờ vào ca',
      (value, testContext) => {
        return isAfter(value, testContext.parent.startTime);
      }
    )
    .test(
      'isStartBreakTimeAndEndTimeValid',
      () => 'Giờ nghỉ ca phải nhỏ hơn giờ ra ca',
      (value, testContext) => {
        return isBefore(value, testContext.parent.endTime);
      }
    )
    .test(
      'isStartBreakTimeAndEndTImeOffValid',
      () => 'Giờ nghỉ ca phải lớn hơn giờ nghỉ cả',
      (value, testContext) => {
        return isAfter(value, testContext.parent.startBreakTime);
      }
    ),
});

const formatTimeToDate = (time: string) => {
  const currentDate = formatDate(new Date(), 'yyyy-MM-dd');

  return new Date(`${currentDate} ${time}`).toString();
};

export default function ShiftFormModal({
  shiftDetail,
  isOpen,
  closeModal,
  handleRefetchData,
}: IShiftFormModalProps) {
  const createShiftMutation = useCreateShiftMutation();
  const updateShiftMutation = useUpdateShiftMutation();

  const { control, reset, handleSubmit } = useForm<FormValues>({
    defaultValues,
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (shiftDetail) {
      reset({
        name: shiftDetail.name,
        startTime: formatTimeToDate(shiftDetail.startTime),
        endTime: formatTimeToDate(shiftDetail.endTime),
        startBreakTime: formatTimeToDate(shiftDetail.startBreakTime),
        endTimeOff: formatTimeToDate(shiftDetail.endTimeOff),
      });
    }
  }, [shiftDetail, reset]);

  const onSubmit = (values: FormValues) => {
    const dataSubmit = {
      ...values,
      startTime: formatDate(values.startTime, 'HH:mm'),
      endTime: formatDate(values.endTime, 'HH:mm'),
      startBreakTime: formatDate(values.startBreakTime, 'HH:mm'),
      endTimeOff: formatDate(values.endTimeOff, 'HH:mm'),
    };

    if (shiftDetail?._id) {
      updateShiftMutation.mutate(
        { ...dataSubmit, shiftId: shiftDetail?._id as string },
        {
          onSuccess: () => {
            toast(ToastType.Success, 'Cập nhật ca thành công');
            handleRefetchData();
            closeModal();
          },
        }
      );
      return;
    }

    createShiftMutation.mutate(dataSubmit, {
      onSuccess: () => {
        toast(ToastType.Success, 'Thêm ca thành công');
        handleRefetchData();
        handleCloseModal();
      },
    });
  };

  const handleCloseModal = () => {
    reset(defaultValues);
    closeModal();
  };

  return (
    <Modal
      title={
        <h4 className='text-2xl sm:text-xl font-bold text-white'>
          {shiftDetail ? 'Chỉnh sửa ca' : 'Thêm ca'}
        </h4>
      }
      footerContent={
        <div className='flex items-center gap-3 px-2 mt-6 lg:justify-end'>
          <Button size='sm' variant='outline' onClick={handleCloseModal}>
            Đóng
          </Button>
          <Button
            size='sm'
            isLoading={
              createShiftMutation.isPending || updateShiftMutation.isPending
            }
            onClick={handleSubmit(onSubmit)}
          >
            Lưu
          </Button>
        </div>
      }
      isOpen={isOpen}
      onClose={handleCloseModal}
      className='max-w-[700px] m-4'
      isScroll={false}
    >
      <div className='lg:p-4'>
        <form className='flex flex-col'>
          <div className='space-y-4'>
            <InputController
              control={control}
              name='name'
              label='Tên ca'
              required
            />
            <TimePickerController
              control={control}
              required
              name='startTime'
              label='Giờ vào ca'
              time24hr
            />
            <TimePickerController
              control={control}
              required
              name='endTime'
              label='Giờ ra ca'
              time24hr
            />
            <TimePickerController
              control={control}
              required
              name='startBreakTime'
              label='Giờ bắt đầu nghỉ ca'
              time24hr
            />
            <TimePickerController
              control={control}
              required
              name='endTimeOff'
              label='Giờ kết thúc nghỉ ca'
              time24hr
            />
          </div>
        </form>
      </div>
    </Modal>
  );
}
