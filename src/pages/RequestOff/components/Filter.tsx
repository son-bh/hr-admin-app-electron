import { useRef, useState } from 'react';
import flatpickr from 'flatpickr';
import { format, parse } from 'date-fns';
import { IOptionSelect, IQueryParams } from '@/types';
import Button from '@/components/ui/button/Button';
import Label from '@/components/form/Label';
import RSelect from '@/components/form/form-elements/RSelect';
import Input from '@/components/form/input/InputField';
import { RequestOffCategoryOption, StatusOption } from '@/shared/constants';
import DatePicker from '@/components/form/DatePicker';

type FilterQueryParams = IQueryParams & {
  startDate?: string;
  endDate?: string;
  searchKeyword?: string;
  status?: IOptionSelect;
  typeOff?: IOptionSelect;
};

interface IFilterProps {
  handleFilterChange: (
    newFilter: IQueryParams & {
      searchKeyword?: string;
      status?: string;
      typeOff?: string;
      startDate?: string;
      endDate?: string;
    }
  ) => void;
}

const defaultFilter = {
  startDate: undefined,
  endDate: undefined,
  searchKeyword: undefined,
  status: undefined,
  typeOff: undefined,
};

export default function Filter({ handleFilterChange }: IFilterProps) {
  const [filter, setFilter] = useState<FilterQueryParams>(defaultFilter);
  const [resetKey, setResetKey] = useState(0);
  const startDatePickerRef = useRef<flatpickr.Instance | null>(null);
  const endDatePickerRef = useRef<flatpickr.Instance | null>(null);

  const handleReset = () => {
    setFilter(defaultFilter);

    setResetKey(prev => prev + 1);

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
          key={`search-${resetKey}`}
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
      <div>
        <Label>Loại nghỉ </Label>
        <RSelect
          key={`typeoff-${resetKey}`}
          value={filter.typeOff}
          options={RequestOffCategoryOption}
          label='loại nghỉ '
          onChange={newValue => {
            setFilter(prev => ({
              ...prev,
              typeOff: newValue as unknown as IOptionSelect,
            }));
          }}
          selectClassName='min-w-[190px]'
        />
      </div>
      <div>
        <Label>Trạng thái</Label>
        <RSelect
          key={`status-${resetKey}`}
          value={filter.status}
          options={StatusOption}
          label='trạng thái'
          onChange={newValue => {
            setFilter(prev => ({
              ...prev,
              status: newValue as unknown as IOptionSelect,
            }));
          }}
          selectClassName='min-w-[190px]'
        />
      </div>
      <DatePicker
        key={`start-date-${resetKey}`}
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
        key={`end-date-${resetKey}`}
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
          className='h-11 w-1/2 truncate'
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
              status: filter.status?.value,
              typeOff: filter.typeOff?.value,
            });
          }}
        >
          Tìm kiếm
        </Button>
      </div>
    </div>
  );
}
