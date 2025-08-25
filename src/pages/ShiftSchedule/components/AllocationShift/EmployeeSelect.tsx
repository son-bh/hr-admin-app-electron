import {
  eachDayOfInterval,
  format,
  isAfter,
  isSameMonth,
  startOfMonth,
} from 'date-fns';
import last from 'lodash/last';
import debounce from 'lodash/debounce';
import isEmpty from 'lodash/isEmpty';
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useFormContext } from 'react-hook-form';
import { GroupBase, OptionsOrGroups } from 'react-select';
import { AsyncSelectController } from '@/components/form/controller';
import {
  useGetShiftScheduleByEmployeeMutation,
  useGetUsersMutation,
} from '@/services';
import { mappingEmployeeShiftSchedule } from '@/shared/utils/mapping';
import { IOptionSelect, IShiftSchedule, IShiftScheduleExists } from '@/types';

import {
  findEmployeeNotExists,
  mappingEmployeeOptions,
  mappingShiftScheduleExists,
  mergeShiftScheduleEmployee,
} from '@/shared/utils/shift';
import ShiftRangeDate from './ShiftRangeDate';
import EmployeeShiftSchedule from '../EmployeeShift/EmployeeShiftSchedule';

const DefaultFilter = { pageIndex: 0, pageSize: 20 };

export interface EmployeeSelectRef {
  handleDuplicateShiftSchedule: (
    schedulesConflicts: Array<IShiftScheduleExists>
  ) => void;
}

const EmployeeSelect = forwardRef<EmployeeSelectRef>((_, ref) => {
  const employeeSelectRef = useRef<HTMLDivElement>(null);

  const [employeeOptions, setEmployeeOptions] = useState<Array<IOptionSelect>>(
    []
  );
  const [selectedEmployee, setSelectedEmployee] = useState<
    Array<IOptionSelect>
  >([]);
  const [employeeShiftSchedule, setEmployeeShiftSchedule] = useState<
    Array<IShiftSchedule>
  >([]);
  const [isScheduleLoading, setScheduleLoading] = useState<boolean>(false);

  const { control, watch, setValue } = useFormContext();
  const watchStartDate = watch('startDate');
  const watchEndDate = watch('endDate');

  const dateRange = useMemo(() => {
    if (watchStartDate && watchEndDate) {
      return eachDayOfInterval({
        start: watchStartDate,
        end: watchEndDate,
      });
    }

    return [];
  }, [watchStartDate, watchEndDate]);

  const getEmployeeMutation = useGetUsersMutation();
  const getShiftScheduleEmployee = useGetShiftScheduleByEmployeeMutation();

  const handleGetInitialEmployee = () => {
    getEmployeeMutation.mutate(DefaultFilter, {
      onSuccess: data => {
        setEmployeeOptions(mappingEmployeeOptions(data?.data) || []);
      },
      onError: () => {
        setEmployeeOptions([]);
      },
    });
  };

  const loadOptions = async (
    inputValue: string
  ): Promise<OptionsOrGroups<IOptionSelect, GroupBase<IOptionSelect>>> => {
    return new Promise(resolve => {
      onInputChange(inputValue, resolve);
    });
  };

  const onInputChange = debounce(async (inputValue, callback) => {
    getEmployeeMutation.mutateAsync(
      { ...DefaultFilter, searchKeyword: inputValue },
      {
        onSuccess: data => {
          const employees = mappingEmployeeOptions(data?.data) || [];

          setEmployeeOptions(employees);
          callback(employees);
        },
        onError: () => {
          setEmployeeOptions([]);
          callback([]);
        },
      }
    );
  }, 300);

  useEffect(() => {
    handleGetInitialEmployee();
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      handleDuplicateShiftSchedule: (
        schedulesConflicts: Array<IShiftScheduleExists>
      ) => {
        if (!isEmpty(schedulesConflicts)) {
          setEmployeeShiftSchedule(
            mappingShiftScheduleExists(
              employeeShiftSchedule,
              schedulesConflicts
            )
          );
          return;
        }
      },
    }),
    [employeeShiftSchedule]
  );

  const handleGetShiftScheduleEmployee = (
    userIds: Array<string>,
    startDate: Date,
    endDate: Date,
    range: Array<string>
  ) => {
    setScheduleLoading(true);
    getShiftScheduleEmployee.mutate(
      {
        userIds,
        startDate: format(startDate, 'yyyy-MM-dd'),
        endDate: format(endDate, 'yyyy-MM-dd'),
      },
      {
        onSuccess: res => {
          const schedulesRes = res?.data;
          const employeeShiftSchedule = [...schedulesRes].map(item => {
            const schedulesEmploy = mergeShiftScheduleEmployee(
              item.schedules || []
            );

            const schedulesInRage = mappingEmployeeShiftSchedule(
              schedulesEmploy,
              range
            );

            return {
              employee: item.employee,
              schedules: schedulesInRage,
            };
          });

          setEmployeeShiftSchedule(employeeShiftSchedule);
          setScheduleLoading(false);
        },
      }
    );
  };

  const handleSelectedEmployee = (value: Array<IOptionSelect>) => {
    if (isEmpty(value)) {
      setSelectedEmployee([]);
      setEmployeeShiftSchedule([]);
      return;
    }

    if (selectedEmployee.length > value.length) {
      const employeeNotExistsInNew = findEmployeeNotExists(
        selectedEmployee,
        value
      );
      const newShiftSchedule = [...employeeShiftSchedule].filter(
        item => item.employee._id !== employeeNotExistsInNew[0].value
      );

      setEmployeeShiftSchedule(newShiftSchedule);
      setSelectedEmployee(value);
      return;
    }

    const newEmployee = last(value);

    handleGetShiftScheduleEmployee(
      [
        ...selectedEmployee.map(item => item.value),
        newEmployee?.value as string,
      ],
      watchStartDate,
      watchEndDate,
      dateRange
    );

    setSelectedEmployee(value);
  };

  const handleChangeEndDate = (dates: Date[]) => {
    let startDate = watchStartDate;
    const isRangeDateValid = isAfter(dates[0], watchStartDate);
    const isMonthValid = isSameMonth(dates[0], watchStartDate);

    if (!isMonthValid) {
      startDate = startOfMonth(dates[0]);
      setValue('startDate', startDate);
    }

    if (!isEmpty(selectedEmployee) && isRangeDateValid) {
      const dateRange = eachDayOfInterval({
        start: startDate,
        end: dates[0],
      });
      const userIds = selectedEmployee.map(item => item.value);

      handleGetShiftScheduleEmployee(userIds, startDate, dates[0], dateRange);
    }
  };

  return (
    <div ref={employeeSelectRef} className='space-y-4'>
      <ShiftRangeDate onChangeEndDate={handleChangeEndDate} />
      <AsyncSelectController
        name='userIds'
        control={control}
        label='Nhân sự'
        loadOptions={loadOptions}
        isMulti={true}
        placeholder='Chọn nhân sự'
        options={employeeOptions}
        required
        onChange={handleSelectedEmployee}
        disabled={!watchStartDate || !watchEndDate || isScheduleLoading}
      />
      {!isEmpty(employeeShiftSchedule) && (
        <EmployeeShiftSchedule
          isScheduleLoading={isScheduleLoading}
          dateRange={dateRange}
          employeeShiftSchedule={employeeShiftSchedule}
        />
      )}
    </div>
  );
});

export default EmployeeSelect;
