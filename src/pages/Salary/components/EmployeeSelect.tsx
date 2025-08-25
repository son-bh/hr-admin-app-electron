import debounce from 'lodash/debounce';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { GroupBase, OptionsOrGroups } from 'react-select';
import { AsyncSelectController } from '@/components/form/controller';
import { useGetUsersMutation } from '@/services';
import { IOptionSelect } from '@/types';

import { mappingEmployeeOptions } from '@/shared/utils/shift';

const DefaultFilter = { pageIndex: 0, pageSize: 20 };

const EmployeeSelect = () => {
  const [employeeOptions, setEmployeeOptions] = useState<Array<IOptionSelect>>(
    []
  );

  const { control } = useFormContext();

  const getEmployeeMutation = useGetUsersMutation();

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

  return (
    <div className='space-y-4'>
      <AsyncSelectController
        name='employeeId'
        control={control}
        label='Nhân viên'
        loadOptions={loadOptions}
        placeholder='Chọn nhân viên'
        options={employeeOptions}
        required
        isMulti={true}
        // onChange={handleSelectedEmployee}
      />
    </div>
  );
};

export default EmployeeSelect;
