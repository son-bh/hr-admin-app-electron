import {
  DatePickerController,
  TextAreaController,
} from '@/components/form/controller';
import Button from '@/components/ui/button/Button';
import { Modal } from '@/components/ui/modal';
import { IOverTime, ISchedule, IShiftScheduleEmployee } from '@/types';
import { addDays, format, isAfter } from 'date-fns';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { ErrorForm } from '@/shared/constants';
import { useSetOverTimeMutation } from '@/services';
import { useEffect } from 'react';

interface IOverTimeModalProps {
  scheduleDetail?: (ISchedule & { employee: IShiftScheduleEmployee }) | null;
  isOpen: boolean;
  closeModal: () => void;
  handleSetOverTime: ({
    overTimeDetail,
  }: {
    overTimeDetail: IOverTime;
  }) => void;
}

const schema = yup.object().shape({
  overTimeStart: yup.string().required(ErrorForm.Required),
  overTimeEnd: yup
    .string()
    .required(ErrorForm.Required)
    .test(
      'isEndTimeLessThanStartTime',
      () => 'Giờ kết thúc phải lớn hơn giờ bắt đầu',
      (value, testContext) => {
        return isAfter(value, testContext.parent.overTimeStart);
      }
    ),
  noteForOvertime: yup.string(),
});

type FormValues = {
  overTimeStart: string | Date | null;
  overTimeEnd: string | Date | null;
  noteForOvertime: string;
};

const defaultValues = {
  overTimeStart: null,
  overTimeEnd: null,
};

export default function OverTimeModal({
  isOpen,
  scheduleDetail,
  closeModal,
  handleSetOverTime,
}: IOverTimeModalProps) {
  const { control, watch, handleSubmit, reset } = useForm<FormValues>({
    defaultValues,
    resolver: yupResolver(schema as yup.ObjectSchema<FormValues>),
  });
  const watchOverTimeStart = watch('overTimeStart');

  useEffect(() => {
    if (scheduleDetail?.overTimeStart && scheduleDetail?.overTimeEnd) {
      reset({
        overTimeStart: scheduleDetail?.overTimeStart,
        overTimeEnd: scheduleDetail?.overTimeEnd,
      });
      return;
    }

    if (scheduleDetail?.date) {
      reset({
        overTimeStart: new Date(scheduleDetail?.date).toString(),
        overTimeEnd: new Date(scheduleDetail?.date).toString(),
      });
    }
  }, [
    scheduleDetail?.date,
    scheduleDetail?.overTimeStart,
    scheduleDetail?.overTimeEnd,
    reset,
  ]);

  const setOverTimeMutation = useSetOverTimeMutation();

  const onSubmit = (values: FormValues) => {
    setOverTimeMutation.mutate(
      {
        scheduleId: scheduleDetail?.scheduleId as string,
        overTimeStart: format(values.overTimeStart!, 'yyyy-MM-dd HH:mm'),
        overTimeEnd: format(values.overTimeEnd!, 'yyyy-MM-dd HH:mm'),
        noteForOvertime: values?.noteForOvertime,
      },
      {
        onSuccess: () => {
          handleSetOverTime({ overTimeDetail: values as IOverTime });
          closeModal();
        },
      }
    );
  };

  return (
    <Modal
      isBackdropClose={false}
      title={
        <h4 className='text-2xl sm:text-xl font-bold text-white'>
          Thêm giờ tăng ca
        </h4>
      }
      footerContent={
        <div className='flex items-center gap-3 px-2 mt-6 justify-end'>
          <div className='flex items-center gap-3 px-2 mt-6 justify-end'>
            <Button size='sm' variant='outline' onClick={closeModal}>
              Đóng
            </Button>
            <Button
              size='sm'
              isLoading={setOverTimeMutation.isPending}
              onClick={handleSubmit(onSubmit)}
            >
              Lưu
            </Button>
          </div>
        </div>
      }
      isOpen={isOpen}
      onClose={closeModal}
      className='max-w-[600px]'
    >
      <div className='lg:p-4'>
        <form className='space-y-3'>
          <DatePickerController
            control={control}
            name='overTimeStart'
            label='Giờ bắt đầu'
            required
            dateFormat='Y-m-d H:i'
            options={{
              minDate: scheduleDetail?.date,
              maxDate: scheduleDetail?.date,
              enableTime: true,
              time_24hr: true,
            }}
          />
          <DatePickerController
            control={control}
            name='overTimeEnd'
            label='Giờ kết thúc'
            dateFormat='Y-m-d H:i'
            required
            options={{
              minDate: scheduleDetail?.date,
              maxDate: addDays(new Date(watchOverTimeStart as string), 1),
              enableTime: true,
              time_24hr: true,
            }}
          />
          <TextAreaController
            control={control}
            name='noteForOvertime'
            label='Ghi chú'
            placeholder='Nhập ghi chú'
          />
        </form>
      </div>
    </Modal>
  );
}
