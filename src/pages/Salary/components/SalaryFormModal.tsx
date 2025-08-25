import { FormProvider, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { format } from 'date-fns';
import Button from '@/components/ui/button/Button';
import { Modal } from '@/components/ui/modal';
import { toast } from '@/components/toast';
import { ToastType } from '@/shared/constants/common';
import { IOptionSelect } from '@/types';
import { useCalculateSalaryAllInMonthMutation } from '@/services';
import { ErrorForm } from '@/shared/constants/error';
import MonthPickerController from '@/components/form/controller/MonthPickerController';
import EmployeeSelect from './EmployeeSelect';
import { CheckboxController } from '@/components/form/controller';

interface ISalaryFormModalProps {
  isOpen: boolean;
  closeModal: () => void;
  handleRefetchData: () => void;
}

const defaultValues = {
  employeeId: undefined,
  month: '',
  isAll: false,
};

const schema = yup.object().shape({
  month: yup.string().required(ErrorForm.Required),
  isAll: yup.boolean().default(false),
  employeeId: yup
    .mixed<Array<IOptionSelect>>()
    .nullable()
    .when('isAll', {
      is: false,
      then: s => s.required(ErrorForm.Required),
      otherwise: s => s.notRequired(),
    }),
});

type FormValues = yup.InferType<typeof schema>;

export default function SalaryFormModal({
  isOpen,
  closeModal,
  handleRefetchData,
}: ISalaryFormModalProps) {
  const calculateSalaryAllInMonthMutation =
    useCalculateSalaryAllInMonthMutation();

  const methods = useForm<FormValues>({
    defaultValues,
    resolver: yupResolver(schema as yup.ObjectSchema<FormValues>),
  });
  const { control, handleSubmit, reset, watch } = methods;
  const watchIsAll = watch('isAll');

  const onSubmit = (values: FormValues) => {
    const dataSubmit = {
      ...(!values?.isAll && {
        employeeIds: values?.employeeId?.map(
          item => item.value
        ) as unknown as Array<string>,
      }),
      month: format(values.month, 'MM'),
      year: format(values.month, 'yyyy'),
    };

    calculateSalaryAllInMonthMutation.mutate(dataSubmit, {
      onSuccess: () => {
        toast(ToastType.Success, 'Tính lương thành công');
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
          Tính lương cho nhân viên
        </h4>
      }
      footerContent={
        <div className='flex items-center gap-3 justify-end mt-4'>
          <Button size='sm' variant='outline' onClick={handleCloseModal}>
            Đóng
          </Button>
          <Button
            size='sm'
            isLoading={calculateSalaryAllInMonthMutation.isPending}
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
        <FormProvider {...methods}>
          <form className='flex flex-col'>
            <div className='space-y-4'>
              <MonthPickerController
                control={control}
                name='month'
                label='Tháng'
                required
              />
              <CheckboxController
                control={control}
                name='isAll'
                label='Tất cả nhân viên'
              />
              {!watchIsAll && <EmployeeSelect />}
            </div>
          </form>
        </FormProvider>
      </div>
    </Modal>
  );
}
