import { useEffect, useState } from 'react';
import flatpickr from 'flatpickr';
import { addDays, format, isSameMonth, parse, startOfMonth } from 'date-fns';
import { GroupBase, OptionsOrGroups } from 'react-select';
import debounce from 'lodash/debounce';
import { IOptionSelect, IQueryParams } from '@/types';
import Button from '@/components/ui/button/Button';
import DatePicker from '@/components/form/DatePicker';
import { Instance } from 'flatpickr/dist/types/instance';
import { getCurrentWeek, mappingEmployeeOptions } from '@/shared/utils/shift';
import { useGetUsersMutation, useQueryGetTeams } from '@/services';
import Label from '@/components/form/Label';
import { AsyncSelect } from '@/components/form/AsyncSelect';
import { mappingOptionSelect } from '@/shared/utils/mapping';
import RSelect from '@/components/form/form-elements/RSelect';
import { parseDate } from '@/shared/utils/helpers';

type FilterQueryParams = IQueryParams & {
  startDate: string;
  endDate?: string;
};

interface IFilterProps {
  handleFilterChange: (
    newFilter: IQueryParams & {
      startDate: string;
      endDate?: string;
      userIds?: Array<string>;
      teamIds?: Array<string>;
    }
  ) => void;
}

const defaultFilter = {
  startDate: format(getCurrentWeek().startDate, 'dd/MM/yyyy'),
  endDate: format(getCurrentWeek().endDate, 'dd/MM/yyyy'),
};

export default function Filter({ handleFilterChange }: IFilterProps) {
  const [filter, setFilter] = useState<FilterQueryParams>(defaultFilter);
  const [employeeOptions, setEmployeeOptions] = useState<Array<IOptionSelect>>(
    []
  );
  const [selectedEmployee, setSelectedEmployee] = useState<
    Array<IOptionSelect>
  >([]);
  const [teamOptions, setTeamOptions] = useState<Array<IOptionSelect>>([]);
  const [selectedTeam, setSelectedTeam] = useState<Array<IOptionSelect>>([]);

  const getEmployeeMutation = useGetUsersMutation();
  const { data: teamsData } = useQueryGetTeams();

  const handleGetInitialEmployee = (teams?: string) => {
    getEmployeeMutation.mutate(
      { pageIndex: 0, pageSize: 20, teams },
      {
        onSuccess: data => {
          setEmployeeOptions(mappingEmployeeOptions(data?.data) || []);
        },
        onError: () => {
          setEmployeeOptions([]);
        },
      }
    );
  };

  const loadOptions = async (
    inputValue: string
  ): Promise<OptionsOrGroups<IOptionSelect, GroupBase<IOptionSelect>>> => {
    return new Promise(resolve => {
      onInputChange(inputValue, resolve);
    });
  };

  const onInputChange = debounce(async (inputValue, callback) => {
    const teams = selectedTeam?.map(item => item.value).join(',');

    getEmployeeMutation.mutateAsync(
      { pageIndex: 0, pageSize: 20, searchKeyword: inputValue, teams },
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
    const teams = selectedTeam?.map(item => item.value).join(',');

    handleGetInitialEmployee(teams);
  }, [selectedTeam]);

  useEffect(() => {
    setTeamOptions(mappingOptionSelect(teamsData?.data || []));
  }, [teamsData?.data]);

  return (
    <div className='mb-5 md:flex items-end gap-2 flex-wrap space-y-2 md:space-y-0'>
      <DatePicker
        id='Start_date-picker'
        label='Ngày bắt đầu'
        placeholder='Chọn ngày bắt đầu'
        defaultDate={parse(filter.startDate, 'dd/MM/yyyy', new Date())}
        dateFormat='d/m/Y'
        onChange={(_, currentDateString) => {
          setFilter(prev => ({
            ...prev,
            startDate: currentDateString,
            endDate: undefined,
          }));
          const fp = flatpickr('#End_date-picker');

          (fp as Instance).clear();
        }}
      />
      <DatePicker
        id='End_date-picker'
        label='Ngày kết thúc'
        placeholder='Chọn ngày kết thúc'
        defaultDate={filter.endDate ? parseDate(filter.endDate) : undefined}
        dateFormat='d/m/Y'
        options={{
          minDate: filter.startDate,
          maxDate: addDays(parseDate(filter.startDate), 31),
        }}
        onChange={(_, currentDateString) => {
          const start = parseDate(filter.startDate);
          const currentEnd = parseDate(currentDateString);

          const isMonthValid = isSameMonth(start, currentEnd);

          setFilter(prev => ({
            ...prev,
            endDate: currentDateString,
            ...(!isMonthValid && {
              startDate: format(startOfMonth(currentEnd), 'dd/MM/yyyy'),
            }),
          }));
        }}
      />
      <div>
        <Label>Bộ phận</Label>
        <RSelect
          isMulti
          className='min-w-[250px]'
          onChange={newValue =>
            setSelectedTeam(newValue as Array<IOptionSelect>)
          }
          value={selectedTeam}
          options={teamOptions}
          placeholder='Chọn bộ phận'
          isClearable={true}
          isSearchable={true}
        />
      </div>
      <div>
        <Label>Nhân sự</Label>
        <AsyncSelect
          isMulti
          className='min-w-[250px]'
          loadOptions={loadOptions}
          onChange={newValue =>
            setSelectedEmployee(newValue as Array<IOptionSelect>)
          }
          value={selectedEmployee}
          options={employeeOptions}
          placeholder='Chọn nhân sự'
          isClearable={true}
          isSearchable={true}
          cacheOptions
        />
      </div>
      <div className='flex gap-2'>
        <Button
          size='sm'
          onClick={() => {
            setFilter(defaultFilter);
            setSelectedEmployee([]);
            setSelectedTeam([]);
            handleFilterChange({
              startDate: format(getCurrentWeek().startDate, 'yyyy-MM-dd'),
              endDate: format(getCurrentWeek().endDate, 'yyyy-MM-dd'),
              userIds: [],
              teamIds: [],
            });
          }}
        >
          Cài lại
        </Button>
        <Button
          size='sm'
          onClick={() => {
            handleFilterChange({
              ...filter,
              startDate: format(
                parse(filter.startDate, 'dd/MM/yyyy', new Date()),
                'yyyy-MM-dd'
              ),
              ...(filter.endDate && {
                endDate: format(
                  parse(filter.endDate as string, 'dd/MM/yyyy', new Date()),
                  'yyyy-MM-dd'
                ),
              }),
              userIds: selectedEmployee.map(item => item.value),
              teamIds: selectedTeam.map(item => item.value),
            });
          }}
        >
          Tìm kiếm
        </Button>
      </div>
    </div>
  );
}
