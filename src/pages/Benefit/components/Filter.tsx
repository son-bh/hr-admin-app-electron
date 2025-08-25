import { useState } from 'react';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import RSelect from '@/components/form/form-elements/RSelect';
import {
  IOptionSelect,
  IOptionSelectValueBoolean,
  IQueryParams,
} from '@/types';
import { RoleOptions } from '@/shared/constants';
import Button from '@/components/ui/button/Button';

type FilterQueryParams = IQueryParams & {
  searchKeyword?: string;
  roles?: Array<IOptionSelect>;
  teamIds?: Array<IOptionSelect>;
  isOfficial?: IOptionSelectValueBoolean | null;
};

interface IFilterProps {
  teamOptions: Array<IOptionSelect>;
  handleFilterChange: (
    newFilter: IQueryParams & {
      searchKeyword?: string;
      roles?: string[];
      teamIds?: string[];
    }
  ) => void;
}

const defaultFilter = {
  pageIndex: 0,
  pageSize: 50,
  roles: [],
  teamIds: [],
};

export default function Filter({
  teamOptions,
  handleFilterChange,
}: IFilterProps) {
  const [filter, setFilter] = useState<FilterQueryParams>(defaultFilter);

  return (
    <div className='mb-5 xl:flex items-end gap-2 flex-wrap'>
      <div className='max-xl:pb-2'>
        <Label>Từ khoá</Label>
        <Input
          name='searchKeyword'
          placeholder='Nhập từ khoá'
          value={filter.searchKeyword || ''}
          className=' !bg-white'
          onChange={e => {
            setFilter(prev => ({
              ...prev,
              [e.target.name]: e.target.value,
            }));
          }}
        />
      </div>
      <div className='max-xl:pb-2'>
        <Label>Chức vụ</Label>
        <RSelect
          isMulti
          value={filter.roles}
          options={RoleOptions}
          placeholder='--Chọn chức vụ--'
          onChange={newValue => {
            setFilter(prev => ({
              ...prev,
              roles: newValue as Array<IOptionSelect>,
            }));
          }}
          selectClassName='min-w-[190px]'
        />
      </div>
      <div className='max-xl:pb-2'>
        <Label>Bộ phận</Label>
        <RSelect
          isMulti
          value={filter.teamIds}
          options={teamOptions}
          placeholder='--Chọn bộ phận--'
          onChange={newValue => {
            setFilter(prev => ({
              ...prev,
              teamIds: newValue as Array<IOptionSelect>,
            }));
          }}
          selectClassName='min-w-[190px]'
        />
      </div>
      <div className='flex items-end gap-2'>
        <Button
          size='sm'
          className='h-11 whitespace-nowrap'
          onClick={() => {
            setFilter(defaultFilter);
            handleFilterChange({ pageIndex: 0, pageSize: 50 });
          }}
        >
          Cài lại
        </Button>
        <Button
          size='sm'
          className='h-11 w-full'
          onClick={() => {
            handleFilterChange({
              ...filter,
              roles: filter.roles?.map(item => item.value),
              teamIds: filter.teamIds?.map(item => item.value),
            });
          }}
        >
          Tìm kiếm
        </Button>
      </div>
    </div>
  );
}
