import {
  InputController,
  TextAreaController,
} from '@/components/form/controller';
import Button from '../../../components/ui/button/Button';
import { Modal } from '../../../components/ui/modal';
import { useUpdateEmployeeBenefitMutation } from '@/services/employeeBenefit';
import { ToastType } from '@/shared/constants';
import { toast } from '@/components/toast';
import { IEmployBenefit } from '@/types';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import MoneyInput from '@/components/form/controller/MoneyInputController';

interface IEditEmployeeFormProps {
  employeeBenefit: IEmployBenefit | null;
  isOpen: boolean;
  closeModal: () => void;
  handleRefetchData: () => void;
}

type FormValues = {
  baseSalary: number;
  paidLeaveDays: number;
  note?: string;
};

const schemaBase = yup.object().shape({
  baseSalary: yup
    .number()
    .typeError('Phải là số')
    .integer('Phải là số nguyên')
    .positive('Phải lớn hơn 0')
    .required('Bắt buộc nhập'),

  paidLeaveDays: yup
    .number()
    .typeError('Phải là số')
    .integer('Phải là số nguyên')
    .min(0, 'Không được âm')
    .required('Bắt buộc nhập'),
});

const defaultValues = {
  baseSalary: undefined,
  paidLeaveDays: undefined,
  note: '',
};

export default function EditEmployBenefit({
  isOpen,
  employeeBenefit,
  closeModal,
  handleRefetchData,
}: IEditEmployeeFormProps) {
  const updateEmployeeBenefitMutation = useUpdateEmployeeBenefitMutation();
  const { control, reset, handleSubmit } = useForm<FormValues>({
    defaultValues,
    resolver: yupResolver(schemaBase),
  });

  useEffect(() => {
    if (employeeBenefit) {
      reset({
        baseSalary: employeeBenefit.benefits.baseSalary,
        paidLeaveDays: employeeBenefit.benefits.paidLeaveDays,
      });
    }
  }, [employeeBenefit, reset]);

  const handleCloseModal = () => {
    // reset(defaultValues);
    closeModal();
  };

  const onSubmit = (values: FormValues) => {
    const dataSubmit = {
      benefits: {
        baseSalary: Number(values.baseSalary),
        paidLeaveDays: Number(values.paidLeaveDays),
      },
      note: values.note,
    };

    if (employeeBenefit?._id) {
      updateEmployeeBenefitMutation.mutate(
        { ...dataSubmit, employeeBenefitId: employeeBenefit?._id },
        {
          onSuccess: () => {
            toast(ToastType.Success, 'Cập nhật lương cho nhân viên thành công');
            handleRefetchData();
            closeModal();
          },
        }
      );
      return;
    }
  };

  return (
    <Modal
      title={
        <h4 className='text-2xl sm:text-xl font-bold text-white'>
          {`Cập nhật lương cho nhân viên: ${employeeBenefit?.employeeId?.fullname || employeeBenefit?.employeeId?.username || ''}`}
        </h4>
      }
      footerContent={
        <div className='flex items-center gap-3 px-2 mt-6 justify-end'>
          <Button size='sm' variant='outline' onClick={handleCloseModal}>
            Đóng
          </Button>
          <Button
            size='sm'
            isLoading={updateEmployeeBenefitMutation.isPending}
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
            <MoneyInput
              control={control}
              name='baseSalary'
              label='Lương cơ bản'
              required
            />
            <InputController
              control={control}
              name='paidLeaveDays'
              label='Ngày phép'
              required
            />
            <TextAreaController
              placeholder='Nhập ghi chú'
              control={control}
              name='note'
              label='Ghi chú'
            />
          </div>
        </form>
      </div>
    </Modal>
  );
}
