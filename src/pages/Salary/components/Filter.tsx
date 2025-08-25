import { useState } from 'react';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import { IOptionSelect, IQueryParams } from '@/types';
import Button from '@/components/ui/button/Button';
import MonthPicker from '@/components/form/MonthPicker';
import { format } from 'date-fns';
import flatpickr from 'flatpickr';
import { Instance } from 'flatpickr/dist/types/instance';
import RSelect from '@/components/form/form-elements/RSelect';
import { SalaryStatusOption, SendStatusOption } from '@/shared/constants';

type FilterQueryParams = IQueryParams & {
  searchKeyword?: string;
  month?: string | Date;
  status?: IOptionSelect | null;
  isSentToEmployee?: IOptionSelect | null;
};

interface IFilterProps {
  handleFilterChange: (
    newFilter: IQueryParams & {
      searchKeyword?: string;
      month?: string;
      year?: string;
      status?: string;
      isSentToEmployee?: string;
    }
  ) => void;
}

const defaultFilter = {
  pageIndex: 0,
  pageSize: 50,
  month: undefined,
  status: null,
  isSentToEmployee: null,
};

export default function Filter({ handleFilterChange }: IFilterProps) {
  const [filter, setFilter] = useState<FilterQueryParams>(defaultFilter);

  return (
    <div className='mb-6 xl:flex items-end gap-2 flex-wrap'>
      <div className='mb-2 xl:mb-0'>
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

      <div className='mb-6 xl:mb-0'>
        <MonthPicker
          id='month_picker'
          label='Tháng'
          placeholder='Chọn tháng'
          defaultDate={filter.month}
          onChange={(selectedDates, _) => {
            setFilter(prev => ({
              ...prev,
              month: selectedDates[0],
            }));
          }}
        />
      </div>

      <div className='mb-6 xl:mb-0'>
        <Label>Trạng thái</Label>
        <RSelect
          value={filter.status}
          options={SalaryStatusOption}
          placeholder='--Chọn trạng thái--'
          onChange={newValue => {
            setFilter(prev => ({
              ...prev,
              status: newValue as unknown as IOptionSelect,
            }));
          }}
          selectClassName='min-w-[150px]'
        />
      </div>

      <div className='mb-6 xl:mb-0'>
        <Label>Trạng thái gửi</Label>
        <RSelect
          value={filter.isSentToEmployee}
          options={SendStatusOption}
          placeholder='--Chọn trạng thái gửi--'
          onChange={newValue => {
            setFilter(prev => ({
              ...prev,
              isSentToEmployee: newValue as unknown as IOptionSelect,
            }));
          }}
          selectClassName='min-w-[150px]'
        />
      </div>

      <div className='flex gap-5 xl:gap-3'>
        <Button
          size='sm'
          onClick={() => {
            const fp = flatpickr('#month_picker');

            (fp as Instance).clear();
            setFilter(defaultFilter);
            handleFilterChange({ pageIndex: 0, pageSize: 50 });
          }}
        >
          Cài lại
        </Button>
        <Button
          size='sm'
          onClick={() => {
            handleFilterChange({
              ...filter,
              month: filter.month ? format(filter.month, 'MM') : '',
              year: filter.month ? format(filter.month, 'yyyy') : '',
              status: filter?.status?.value,
              isSentToEmployee: filter?.isSentToEmployee?.value,
            });
          }}
        >
          Tìm kiếm
        </Button>
      </div>
    </div>
  );
}
