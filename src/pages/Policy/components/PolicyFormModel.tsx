import { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Button from '@/components/ui/button/Button';
import { Modal } from '@/components/ui/modal';
import { toast } from '@/components/toast';
import { ToastType } from '@/shared/constants/common';
import { IOtherReward, IPolicy } from '@/types';
import { ErrorForm } from '@/shared/constants/error';
import { InputController } from '@/components/form/controller';
import { BiX } from 'react-icons/bi';
import { useCreatePolicyMuttion } from '@/services/policy';
import MoneyInput from '@/components/form/controller/MoneyInputController';

interface IPolicyFormModalProps {
  policyDetail?: IPolicy | null;
  isOpen: boolean;
  closeModal: () => void;
  handleRefetchData: () => void;
}

type FormValues = {
  name: string;
  description: string;
  birthday: number;
  overtimeBonus: number;
  performanceBonus: number;
  late: number;
  earlyLeave: number;
  overBreak: number;
  other: Array<IOtherReward> | null;
  probationSalaryPercent: number;
  probationLeaveDays: number;
};

const defaultValues = {
  name: '',
  other: [],
};

const schema = yup.object().shape({
  name: yup.string().required(ErrorForm.Required),
  description: yup.string().required(ErrorForm.Required),
  birthday: yup
    .number()
    .min(1000, ErrorForm.MinMoney)
    .integer(ErrorForm.TypeOfInteger)
    .typeError(ErrorForm.TypeOfNumber)
    .required(ErrorForm.Required),
  overtimeBonus: yup
    .number()
    .min(1000, ErrorForm.MinMoney)
    .integer(ErrorForm.TypeOfInteger)
    .typeError(ErrorForm.TypeOfNumber)
    .required(ErrorForm.Required),
  performanceBonus: yup
    .number()
    .min(1000, ErrorForm.MinMoney)
    .integer(ErrorForm.TypeOfInteger)
    .typeError(ErrorForm.TypeOfNumber)
    .required(ErrorForm.Required),
  late: yup
    .number()
    .min(1000, ErrorForm.MinMoney)
    .integer(ErrorForm.TypeOfInteger)
    .typeError(ErrorForm.TypeOfNumber)
    .required(ErrorForm.Required),
  earlyLeave: yup
    .number()
    .min(1000, ErrorForm.MinMoney)
    .integer(ErrorForm.TypeOfInteger)
    .typeError(ErrorForm.TypeOfNumber)
    .required(ErrorForm.Required),
  overBreak: yup
    .number()
    .min(1000, ErrorForm.MinMoney)
    .integer(ErrorForm.TypeOfInteger)
    .typeError(ErrorForm.TypeOfNumber)
    .required(ErrorForm.Required),
  probationLeaveDays: yup
    .number()
    .min(0, ErrorForm.MinZero)
    .integer(ErrorForm.TypeOfInteger)
    .typeError(ErrorForm.TypeOfNumber)
    .required(ErrorForm.Required),
  probationSalaryPercent: yup
    .number()
    .min(0, ErrorForm.MinZero)
    .max(100, ErrorForm.MaxPercent)
    .integer(ErrorForm.TypeOfInteger)
    .typeError(ErrorForm.TypeOfNumber)
    .required(ErrorForm.Required),
  other: yup
    .array()
    .of(
      yup.object({
        name: yup.string().required(ErrorForm.Required).trim(),
        amount: yup
          .number()
          .min(1000, ErrorForm.MinMoney)
          .integer(ErrorForm.TypeOfInteger)
          .typeError(ErrorForm.TypeOfNumber)
          .required(ErrorForm.Required),
      })
    )
    .notRequired() // không bắt buộc phải có
    .nullable()
    .default([]),
});

export default function PolicyFormModal({
  policyDetail,
  isOpen,
  closeModal,
  handleRefetchData,
}: IPolicyFormModalProps) {
  const createPolicyMutation = useCreatePolicyMuttion();

  const { control, reset, handleSubmit } = useForm<FormValues>({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { fields, append, remove } = useFieldArray<FormValues>({
    control: control,
    name: 'other',
  });

  useEffect(() => {
    if (policyDetail && isOpen) {
      reset({
        name: policyDetail?.name,
        description: policyDetail?.description,
        birthday: policyDetail?.rewards?.birthday,
        overtimeBonus: policyDetail?.rewards?.overtimeBonus,
        performanceBonus: policyDetail?.rewards?.performanceBonus,
        other: policyDetail?.rewards?.other,
        earlyLeave: policyDetail?.penalties?.earlyLeave,
        late: policyDetail?.penalties?.late,
        overBreak: policyDetail?.penalties?.overBreak,
        probationSalaryPercent: policyDetail?.probationSalaryPercent,
        probationLeaveDays: policyDetail?.probationLeaveDays,
      });
    }
  }, [policyDetail, isOpen]);

  const onSubmit = (values: FormValues) => {
    const dataSubmit = {
      //   id: '68999afe13fe85849d225540',
      name: values?.name,
      description: values?.description,
      rewards: {
        birthday: values.birthday,
        overtimeBonus: values.overtimeBonus,
        performanceBonus: values.performanceBonus,
        other: values.other,
      },
      penalties: {
        earlyLeave: values.earlyLeave,
        late: values.late,
        overBreak: values.overBreak,
      },
      probationSalaryPercent: values.probationSalaryPercent,
      probationLeaveDays: values.probationLeaveDays,
    };

    createPolicyMutation.mutate(dataSubmit, {
      onSuccess: () => {
        toast(ToastType.Success, 'Chỉnh sửa chính sách thành công');
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
          {policyDetail ? 'Chỉnh sửa chính sách' : 'Cài đặt chính sách'}
        </h4>
      }
      footerContent={
        <div className='flex items-center gap-3 px-2 mt-6 lg:justify-end'>
          <Button size='sm' variant='outline' onClick={handleCloseModal}>
            Đóng
          </Button>
          <Button
            size='sm'
            isLoading={createPolicyMutation.isPending}
            onClick={handleSubmit(onSubmit)}
          >
            Lưu
          </Button>
        </div>
      }
      isOpen={isOpen}
      onClose={handleCloseModal}
      className='max-w-[700px] m-4'
      isBackdropClose={false}
    >
      <div className='lg:p-4'>
        <form className='flex flex-col'>
          <div className='space-y-4'>
            <InputController
              control={control}
              name='name'
              label='Tên chính sách'
              required
            />

            <InputController
              control={control}
              name='description'
              label='Mô tả chính sách'
              required
            />
            <div>
              <span className='font-bold'>👨‍💻 Thử việc</span>
              <div className='space-y-4 rounded-2xl border-[1px] p-4'>
                <InputController
                  control={control}
                  name='probationSalaryPercent'
                  label='Tỷ lệ lương chính thức'
                  required
                />
                <InputController
                  control={control}
                  name='probationLeaveDays'
                  label='Số ngày phép'
                  required
                />
              </div>
            </div>
            <div>
              <span className='font-bold'>🎁 Thưởng</span>
              <div className='space-y-4 rounded-2xl border-[1px] p-4'>
                <MoneyInput
                  name='birthday'
                  control={control}
                  label='Sinh nhật'
                  required
                />
                <MoneyInput
                  control={control}
                  name='overtimeBonus'
                  label='Lương tăng ca'
                  required
                />
                <MoneyInput
                  control={control}
                  name='performanceBonus'
                  label='Hiệu suất'
                  required
                />
                {fields && (
                  <>
                    {fields.map((field, indexField) => (
                      <div
                        key={field.id}
                        className='relative border-dashed border-[1px] rounded-xl p-3 mb-3'
                      >
                        <div className='text-sm text-green-700 font-bold mb-2'>
                          Khác {indexField + 1}
                        </div>
                        <div className='grid grid-cols-1 md:grid-cols-1 gap-3 items-center'>
                          <div className='flex flex-col gap-3'>
                            <InputController
                              control={control}
                              name={`other.[${indexField}].name`}
                              label='Tên phần thưởng'
                              placeholder='Nhập tên phần thưởng'
                              labelClassName='text-sm'
                              containerClassName='mb-3 w-full'
                              required
                            />
                            <MoneyInput
                              control={control}
                              name={`other.[${indexField}].amount`}
                              label='Tiền thưởng'
                              placeholder='Nhập tiền thưởng'
                              labelClassName='text-sm'
                              containerClassName='mb-3 w-full'
                              required
                            />
                          </div>
                          <button
                            className='absolute top-2 right-2 rounded-2xl border-2 border-red-700'
                            onClick={() => {
                              remove(indexField);
                            }}
                          >
                            <BiX className='h-6 w-6 text-red-500' />
                          </button>
                        </div>
                      </div>
                    ))}
                    <div className='flex items-end'>
                      <Button
                        type='button'
                        className='!min-h-[34px] !h-[34px] !px-[10px] bg-green-700'
                        onClick={() => {
                          append({
                            name: '',
                            amount: 0,
                          });
                        }}
                      >
                        Thêm
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div>
              <span className='font-bold'>⚠️ Phạt</span>
              <div className='space-y-4 rounded-2xl border-[1px] p-4'>
                <MoneyInput
                  control={control}
                  name='late'
                  label='Đi trễ'
                  required
                />
                <MoneyInput
                  control={control}
                  name='earlyLeave'
                  label='Về sớm'
                  required
                />
                <MoneyInput
                  control={control}
                  name='overBreak'
                  label='Vượt thời gian nghỉ'
                  required
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
}
