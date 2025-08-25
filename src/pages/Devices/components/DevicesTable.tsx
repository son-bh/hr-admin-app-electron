/* eslint-disable @typescript-eslint/no-explicit-any */

import { useMemo, useState } from 'react';
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  createColumnHelper,
  ColumnDef,
  SortingState,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { IDevices, Material } from '@/types/IDevices';
import { ModalType } from '@/shared/constants';
import { USER_ROLE } from '@/configs';
import { DEVICES } from '@/configs/devices';
import { MdOutlineRemoveRedEye } from 'react-icons/md';

interface IDevicesListProps {
  devices: Array<IDevices>;
  handleEditDevice: (data: IDevices, modalType: string) => void;
}

export default function DevicesTable({
  devices,
  handleEditDevice,
}: IDevicesListProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const columnHelper = createColumnHelper<IDevices>();
  const columns = useMemo<ColumnDef<IDevices, any>[]>(
    () => [
      columnHelper.accessor('employee.username', {
        header: () => 'Tên',
        cell: info => <div>{info.getValue() || '--'}</div>,
      }),
      columnHelper.accessor('employee.role', {
        header: () => 'Chức vụ',
        cell: info => (
          <div>
            {USER_ROLE[info.getValue() as keyof typeof USER_ROLE] || '--'}
          </div>
        ),
      }),
      columnHelper.accessor(row => row.employee?.team, {
        id: 'employee.team',
        header: () => 'Bộ phận',
        cell: info => <div>{info.getValue() || '--'}</div>,
      }),
      columnHelper.accessor('materials', {
        header: () => 'Thiết bị',
        cell: info => (
          <div className='flex gap-5'>
            <div className='flex flex-col gap-2'>
              {info.getValue().map((item: Material, index: number) => (
                <div key={index} className='flex items-center gap-3'>
                  <div>{`${DEVICES[item.device as keyof typeof DEVICES]} |`}</div>
                  <div>{`${item.code}`}</div>
                </div>
              ))}
            </div>
            <button
              className='rounded text-gray-500 hover:text-blue-400'
              onClick={() => {
                handleEditDevice(info?.row.original, ModalType.Detail);
              }}
            >
              {' '}
              <MdOutlineRemoveRedEye className='w-4 h-4' />
            </button>
          </div>
        ),
      }),
    ],
    []
  );

  const data = useMemo(() => devices || [], [devices]);

  const table = useReactTable({
    columns,
    data,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: false,
  });

  return (
    <div className='overflow-x-auto max-w-full overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]'>
      <Table>
        <TableHeader className='border-b border-gray-100 dark:border-white/[0.05]'>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <TableCell
                  key={header.id}
                  isHeader
                  className='truncate px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400'
                >
                  {header.isPlaceholder ? null : (
                    <div>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </div>
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map(row => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <TableCell
                    key={cell.id}
                    className='truncate px-5 py-3 text-gray-700 text-theme-sm dark:text-gray-300'
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <td
                className='text-sm px-5 py-3 text-center text-gray-500 dark:text-gray-400'
                colSpan={4}
              >
                Không có dữ liệu
              </td>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
