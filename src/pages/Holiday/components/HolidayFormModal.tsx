import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Button from '@/components/ui/button/Button';
import { Modal } from '@/components/ui/modal';
import { toast } from '@/components/toast';
import { ToastType } from '@/shared/constants/common';
import { IHoliday } from '@/types';
import { useCreateHolidayMutation, useUpdateHolidayMutation } from '@/services';
import { ErrorForm } from '@/shared/constants/error';
import { removeEmptyStrings } from '@/shared/utils/helpers';
import {
  DatePickerController,
  InputController,
} from '@/components/form/controller';

interface Props {
  holidayDetail?: IHoliday | null;
  isOpen: boolean;
  closeModal: () => void;
  handleRefetchData: () => void;
}

type FormValues = {
  name: string;
  date: string;
  description: string;
};

const defaultValues = {
  name: '',
  date: '',
  description: '',
};

const schemaBase = yup.object().shape({
  name: yup.string().required(ErrorForm.Required),
  date: yup.string().required(ErrorForm.Required),
  description: yup.string().required(ErrorForm.Required),
});

export default function UserForm({
  holidayDetail,
  isOpen,
  closeModal,
  handleRefetchData,
}: Props) {
  const createHolidayMutation = useCreateHolidayMutation();
  const updateHolidayMutation = useUpdateHolidayMutation();
  const { control, reset, handleSubmit } = useForm<FormValues>({
    defaultValues,
    resolver: yupResolver(schemaBase),
  });

  useEffect(() => {
    if (holidayDetail) {
      reset({
        name: holidayDetail.name,
        date: holidayDetail.date,
        description: holidayDetail.description,
      });
    }
  }, [holidayDetail, reset]);

  const onSubmit = (values: FormValues) => {
    const cleanedValues = removeEmptyStrings(values);

    const dataSubmit = {
      ...cleanedValues,
      name: values.name,
      date: values?.date,
      description: values?.description,
    };

    if (holidayDetail) {
      updateHolidayMutation.mutate(
        {
          ...dataSubmit,
          holidayId: holidayDetail._id,
        },
        {
          onSuccess: () => {
            toast(ToastType.Success, 'Cập nhật ngày nghỉ thành công');
            handleRefetchData();
            handleCloseModal();
          },
        }
      );
      return;
    }

    createHolidayMutation.mutate(dataSubmit, {
      onSuccess: () => {
        toast(ToastType.Success, 'Thêm ngày nghỉ thành công');
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
        <h4 className='text-2xl sm:text-xl font-bold text-white mb-1'>
          {holidayDetail ? 'Chỉnh sửa ngày lễ' : 'Thêm ngày lễ'}
        </h4>
      }
      footerContent={
        <div className='flex items-center w-full gap-3 lg:px-4 mt-6 justify-end'>
          <Button size='sm' variant='outline' onClick={handleCloseModal}>
            Đóng
          </Button>
          <Button
            size='sm'
            isLoading={createHolidayMutation.isPending}
            onClick={handleSubmit(onSubmit)}
          >
            Lưu
          </Button>
        </div>
      }
      isOpen={isOpen}
      onClose={handleCloseModal}
      className='max-w-[700px] m-4'
    >
      <div className='lg:p-4'>
        <form className='flex flex-col'>
          <div className='space-y-4'>
            <InputController
              control={control}
              name='name'
              label='Ngày lễ'
              required
            />
            <InputController
              control={control}
              name='description'
              label='Nội dung'
              required
            />
            <DatePickerController
              control={control}
              name='date'
              label='Thời gian'
              required
              disabled={!!holidayDetail}
            />
          </div>
        </form>
      </div>
    </Modal>
  );
}
