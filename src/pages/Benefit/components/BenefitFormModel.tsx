import { useForm } from 'react-hook-form';
import InputController from '../../../components/form/controller/InputController';
import SelectController from '../../../components/form/controller/SelectController';
import Button from '../../../components/ui/button/Button';
import { Modal } from '../../../components/ui/modal';
import {
  useCreateBenefitMutation,
  useUpdateBenefitMutation,
} from '../../../services';
import { ErrorForm, RoleOptions, ToastType } from '../../../shared/constants';
import { IBenefit, IOptionSelect } from '../../../types';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { toast } from '../../../components/toast';
import { TextAreaController } from '@/components/form/controller';
import MoneyInput from '@/components/form/controller/MoneyInputController';

interface ITeamFormProps {
  benefitDetail?: IBenefit | null;
  isOpen: boolean;
  teamOptions: Array<IOptionSelect>;
  closeModal: () => void;
  handleRefetchData: () => void;
}

type FormValues = {
  name: string;
  role: IOptionSelect;
  teamId: IOptionSelect;
  baseSalary: number;
  paidLeaveDays: number;
  note?: string;
  hasInsurance?: boolean;
  allowance?: number;
};

const schemaBase = yup.object().shape({
  name: yup.string().required(ErrorForm.Required),
  role: yup.mixed<IOptionSelect>().nullable().required(ErrorForm.Required),
  teamId: yup.mixed<IOptionSelect>().nullable().required(ErrorForm.Required),
  baseSalary: yup
    .number()
    .min(1000, ErrorForm.MinMoney)
    .integer(ErrorForm.TypeOfInteger)
    .typeError(ErrorForm.TypeOfNumber)
    .required(ErrorForm.Required),
  paidLeaveDays: yup
    .number()
    .min(0, ErrorForm.MinZero)
    .integer(ErrorForm.TypeOfInteger)
    .typeError(ErrorForm.TypeOfNumber)
    .required(ErrorForm.Required),
});
const defaultValues = {
  name: '',
  role: undefined,
  teamId: undefined,
  isOfficial: undefined,
  baseSalary: undefined,
  paidLeaveDays: undefined,
  note: '',
  bonus: 0,
};
export default function BenefitFormModel({
  benefitDetail,
  isOpen,
  teamOptions,
  closeModal,
  handleRefetchData,
}: ITeamFormProps) {
  const createBenefitMutation = useCreateBenefitMutation();
  const updateBenefitMutation = useUpdateBenefitMutation();
  const { control, reset, handleSubmit } = useForm<FormValues>({
    defaultValues,
    resolver: yupResolver(schemaBase),
  });

  useEffect(() => {
    if (benefitDetail) {
      reset({
        name: benefitDetail.name,
        role: RoleOptions.find(item => item.value === benefitDetail.role),
        teamId: {
          label: benefitDetail.teamId?.name,
          value: benefitDetail.teamId?._id,
        },
        baseSalary: benefitDetail.benefits?.baseSalary,
        paidLeaveDays: benefitDetail.benefits?.paidLeaveDays,
        note: benefitDetail.note,
      });
    } else {
      reset(defaultValues);
    }
  }, [benefitDetail, teamOptions]);

  const onSubmit = (values: FormValues) => {
    const dataSubmit = {
      name: values.name,
      role: values.role.value,
      teamId: values.teamId.value,
      benefits: {
        baseSalary: Number(values.baseSalary),
        paidLeaveDays: Number(values.paidLeaveDays),
      },
      note: values.note,
    };

    if (benefitDetail?._id) {
      updateBenefitMutation.mutate(
        { ...dataSubmit, benefitId: benefitDetail?._id },
        {
          onSuccess: () => {
            toast(ToastType.Success, 'Cập nhật chính sách lương thành công');
            handleRefetchData();
            closeModal();
          },
        }
      );
      return;
    }

    createBenefitMutation.mutate(dataSubmit, {
      onSuccess: () => {
        toast(ToastType.Success, 'Tạo chính sách lương thành công');
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
        <h4 className='sm:text-2xl text-xl font-bold text-white'>
          {benefitDetail ? 'Cập nhật chính sách lương' : 'Tạo chính sách lương'}
        </h4>
      }
      footerContent={
        <div className='flex items-center gap-3 px-2 mt-6 justify-end'>
          <Button size='sm' variant='outline' onClick={handleCloseModal}>
            Đóng
          </Button>
          <Button
            size='sm'
            isLoading={
              createBenefitMutation.isPending || updateBenefitMutation.isPending
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
    >
      <div className='lg:p-4'>
        <form className='flex flex-col'>
          <div className='space-y-4'>
            <InputController
              control={control}
              name='name'
              label='Tên chính sách lương'
              required
            />
            <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
              <SelectController
                control={control}
                name='role'
                label='Chức vụ'
                options={RoleOptions}
                required
                containerClassName='z-[1000]'
              />
              <SelectController
                control={control}
                name='teamId'
                label='Bộ phận'
                options={teamOptions}
                required
                containerClassName='z-[1000'
              />
            </div>
            <MoneyInput
              control={control}
              name='baseSalary'
              label='Lương cơ bản'
              required
            />
            <InputController
              control={control}
              name='paidLeaveDays'
              label='Số ngày nghỉ phép'
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
