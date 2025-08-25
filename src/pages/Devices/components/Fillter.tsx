import { useState } from 'react';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import RSelect from '@/components/form/form-elements/RSelect';
import { IOptionSelect, IQueryParams } from '@/types';
import { DevicesOptions } from '@/shared/constants';
import Button from '@/components/ui/button/Button';

type FilterQueryParams = IQueryParams & {
  searchKeyword?: string;
  device?: Array<IOptionSelect>;
};

interface IFilterProps {
  handleFilterChange: (
    newFilter: IQueryParams & {
      searchKeyword?: string;
      device?: string;
    }
  ) => void;
}

const defaultFilter = { pageIndex: 0, pageSize: 10, device: [] };

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
      <div className='mb-2 xl:mb-0'>
        <Label>Thiết bị</Label>
        <RSelect
          isMulti
          value={filter.device}
          options={DevicesOptions}
          placeholder='--Chọn thiết bị--'
          onChange={newValue => {
            setFilter(prev => ({
              ...prev,
              device: newValue as Array<IOptionSelect>,
            }));
          }}
          selectClassName='min-w-[190px]'
        />
      </div>
      <div className='flex gap-5 xl:gap-3'>
        <Button
          size='sm'
          onClick={() => {
            setFilter(defaultFilter);
            handleFilterChange({ pageIndex: 0, pageSize: 10 });
          }}
        >
          Cài lại
        </Button>
        <Button
          size='sm'
          onClick={() => {
            handleFilterChange({
              ...filter,
              device: filter?.device?.map(item => item.value).join(','),
            });
          }}
        >
          Tìm kiếm
        </Button>
      </div>
    </div>
  );
}
