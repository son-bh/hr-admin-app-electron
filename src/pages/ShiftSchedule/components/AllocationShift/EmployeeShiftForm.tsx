import { FormProvider, useForm } from 'react-hook-form';
import { useEffect, useRef, useState } from 'react';
import { addDays, format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import isEmpty from 'lodash/isEmpty';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { SelectController } from '@/components/form/controller';
import EmployeeSelect, { EmployeeSelectRef } from './EmployeeSelect';
import {
  useAllocationShiftEmployeeMutation,
  useQueryGetShifts,
} from '@/services';
import { IOptionSelect } from '@/types';
import Button from '@/components/ui/button/Button';
import { ErrorForm } from '@/shared/constants';
import { mappingShiftOptions } from '@/shared/utils/shift';
import { PATH_NAME } from '@/configs';

type FormValues = {
  startDate: string | Date | null;
  endDate: string | Date | null;
  userIds: Array<IOptionSelect>;
  shiftIds: IOptionSelect;
};

const defaultValues = {
  startDate: addDays(new Date(), 1),
  endDate: null,
  userIds: undefined,
  shiftIds: undefined,
};

const schema = yup.object().shape({
  startDate: yup.string().nullable().required(ErrorForm.Required),
  // endDate: yup.string().nullable().required(ErrorForm.Required),
  userIds: yup.mixed<IOptionSelect>().nullable().required(ErrorForm.Required),
  shiftIds: yup.mixed<IOptionSelect>().nullable().required(ErrorForm.Required),
});

export default function EmployeeShiftForm() {
  const navigate = useNavigate();

  const employeeSelectRef = useRef<EmployeeSelectRef>(null);

  const [shiftOptions, setShiftOptions] = useState<Array<IOptionSelect>>([]);

  const methods = useForm<FormValues>({
    resolver: yupResolver(schema) as any,
    defaultValues,
  });
  const { control, handleSubmit, setValue } = methods;

  const { data: shiftData } = useQueryGetShifts();
  const allocationShiftEmployeeMutation = useAllocationShiftEmployeeMutation();

  useEffect(() => {
    setShiftOptions(mappingShiftOptions(shiftData?.data || []));
  }, [shiftData?.data]);

  useEffect(() => {
    setValue('startDate', addDays(new Date(), 1));
    setValue('endDate', addDays(new Date(), 1));
  }, []);

  const onSubmit = (values: FormValues) => {
    // console.log(values, "values")
    const payload = {
      startDate: format(values.startDate!, 'yyyy-MM-dd'),
      endDate: format(values.endDate!, 'yyyy-MM-dd'),
      userIds: values.userIds.map(item => item.value),
      // shiftIds: values.shiftIds.map(item => item.value),
      shiftIds: [values.shiftIds.value],
      type: 'RANGE',
    };
    // console.log(payload, "payload")
    allocationShiftEmployeeMutation.mutate(payload, {
      onSuccess: res => {
        const duplicationSchedule = res?.conflicts;

        if (!isEmpty(duplicationSchedule)) {
          employeeSelectRef.current?.handleDuplicateShiftSchedule(
            duplicationSchedule
          );

          return;
        }

        navigate(PATH_NAME.EMPLOYEE_SHIFT_SCHEDULE);
      },
    });
  };

  return (
    <div className='relative w-full p-4 bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-6'>
      <FormProvider {...methods}>
        <form className='space-y-4'>
          <EmployeeSelect ref={employeeSelectRef} />
          <SelectController
            // isMulti
            control={control}
            name='shiftIds'
            label='Ca'
            options={shiftOptions}
            required
          />
        </form>
      </FormProvider>
      <div className='flex items-center gap-3 px-2 mt-6 justify-end'>
        <Button
          size='sm'
          variant='outline'
          onClick={() => {
            navigate(-1);
          }}
        >
          Huỷ
        </Button>
        <Button
          size='sm'
          isLoading={allocationShiftEmployeeMutation.isPending}
          onClick={handleSubmit(onSubmit)}
        >
          Lưu
        </Button>
      </div>
    </div>
  );
}
