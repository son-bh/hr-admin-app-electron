import { useState, useRef } from 'react';
import flatpickr from 'flatpickr';
import { format, parse } from 'date-fns';
import { IQueryParams } from '@/types';
import Button from '@/components/ui/button/Button';
import DatePicker from '@/components/form/DatePicker';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';

type FilterQueryParams = IQueryParams & {
  startDate?: string;
  endDate?: string;
  searchKeyword?: string;
};

interface IFilterProps {
  handleFilterChange: (
    newFilter: IQueryParams & {
      searchKeyword?: string;
      startDate?: string;
      endDate?: string;
    }
  ) => void;
}

const defaultFilter: FilterQueryParams = {
  startDate: undefined,
  endDate: undefined,
  searchKeyword: undefined,
};

export default function Filter({ handleFilterChange }: IFilterProps) {
  const [filter, setFilter] = useState<FilterQueryParams>(defaultFilter);

  const startDatePickerRef = useRef<flatpickr.Instance | null>(null);
  const endDatePickerRef = useRef<flatpickr.Instance | null>(null);

  const handleReset = () => {
    setFilter(defaultFilter);

    if (startDatePickerRef.current) {
      startDatePickerRef.current.clear();
    }
    if (endDatePickerRef.current) {
      endDatePickerRef.current.clear();
    }

    handleFilterChange(defaultFilter);
  };

  return (
    <div className='mb-5 md:flex items-end gap-2 flex-wrap space-y-2 md:space-y-0'>
      <div>
        <Label>Từ khoá</Label>
        <Input
          name='searchKeyword'
          placeholder='Nhập từ khoá'
          value={filter.searchKeyword || ''}
          className='!bg-white'
          onChange={e => {
            setFilter(prev => ({
              ...prev,
              [e.target.name]: e.target.value,
            }));
          }}
        />
      </div>

      <DatePicker
        ref={startDatePickerRef}
        id='Start_date-picker'
        label='Ngày bắt đầu'
        placeholder='Chọn ngày bắt đầu'
        defaultDate={filter.startDate}
        dateFormat='d/m/Y'
        onChange={(_, currentDateString) => {
          setFilter(prev => ({
            ...prev,
            startDate: currentDateString,
            endDate: undefined,
          }));
          if (endDatePickerRef.current) {
            endDatePickerRef.current.clear();
          }
        }}
      />

      <DatePicker
        ref={endDatePickerRef}
        id='End_date-picker'
        label='Ngày kết thúc'
        placeholder='Chọn ngày kết thúc'
        defaultDate={filter.endDate}
        dateFormat='d/m/Y'
        options={{
          minDate: filter.startDate,
        }}
        onChange={(_, currentDateString) => {
          setFilter(prev => ({
            ...prev,
            endDate: currentDateString,
          }));
        }}
      />

      <div className='flex items-end gap-2'>
        <Button size='sm' className='h-11 w-1/2' onClick={handleReset}>
          Cài lại
        </Button>
        <Button
          size='sm'
          className='h-11 w-1/2'
          onClick={() => {
            handleFilterChange({
              ...filter,
              startDate: filter.startDate
                ? format(
                    parse(filter.startDate, 'dd/MM/yyyy', new Date()),
                    'yyyy-MM-dd'
                  )
                : undefined,
              endDate: filter.endDate
                ? format(
                    parse(filter.endDate as string, 'dd/MM/yyyy', new Date()),
                    'yyyy-MM-dd'
                  )
                : undefined,
              searchKeyword: filter.searchKeyword,
            });
          }}
        >
          Tìm kiếm
        </Button>
      </div>
    </div>
  );
}
