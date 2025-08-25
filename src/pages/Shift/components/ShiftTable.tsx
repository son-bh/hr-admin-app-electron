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
import { FaTrash } from 'react-icons/fa';
import { LuPencil } from 'react-icons/lu';

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { IShift, PERMISSIONS } from '@/types';
import { ModalType } from '@/shared/constants';
import AuthorizationWrapper from '@/components/common/AuthorizationWrapper';

interface IShiftTableProps {
  shifts: Array<IShift>;
  handleEditShift: (data: IShift, modalType: string) => void;
}

export default function ShiftTable({
  shifts,
  handleEditShift,
}: IShiftTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const columnHelper = createColumnHelper<IShift>();

  const columns = useMemo<ColumnDef<IShift, any>[]>(
    () => [
      columnHelper.accessor('name', {
        header: () => 'Tên ca',
        cell: info => <div>{info.getValue()}</div>,
      }),
      columnHelper.accessor('startTime', {
        header: () => 'Giờ bắt đầu',
        cell: info => <div>{info.getValue() || '--'}</div>,
      }),
      columnHelper.accessor('endTime', {
        header: () => 'Giờ kết thúc',
        cell: info => <div>{info.getValue()}</div>,
      }),
      columnHelper.accessor('startBreakTime', {
        header: () => 'Giờ bắt đầu nghỉ',
        cell: info => <div>{info.getValue()}</div>,
      }),
      columnHelper.accessor('endTimeOff', {
        header: () => 'Giờ kết thúc nghỉ',
        cell: info => <div>{info.getValue()}</div>,
      }),
      columnHelper.accessor('_id', {
        header: 'Thao tác',
        cell: info => (
          <div className='flex items-center gap-2'>
            <AuthorizationWrapper allowedRoles={PERMISSIONS.UPDATE_SHIFF}>
              <button
                className='rounded text-gray-500 hover:text-blue-400'
                onClick={() => {
                  handleEditShift(info?.row.original, ModalType.Upsert);
                }}
              >
                <LuPencil className='w-4 h-4' />
              </button>
            </AuthorizationWrapper>
            <AuthorizationWrapper allowedRoles={PERMISSIONS.DELETE_SHIFF}>
              <button
                className='rounded text-gray-500 hover:text-red-500'
                onClick={() => {
                  handleEditShift(info?.row.original, ModalType.Delete);
                }}
              >
                <FaTrash color='bg-red-400' />
              </button>
            </AuthorizationWrapper>
          </div>
        ),
      }),
    ],
    []
  );

  const data = useMemo(() => shifts || [], [shifts]);

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
              {headerGroup.headers.map((header, _) => {
                return (
                  <TableCell
                    key={header.id}
                    isHeader
                    className='truncate px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400'
                    // style={{
                    //   padding: '8px',
                    //   position: columnIndex === 0 ? 'sticky' : 'static',
                    //   left: columnIndex === 0 ? 0 : undefined,
                    //   zIndex: columnIndex === 0 ? 2 : 1,
                    // }}
                  >
                    {header.isPlaceholder ? null : (
                      <div
                      // className={classNames({
                      //   "cursor-pointer": header.column.getCanSort(),
                      // })}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </div>
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map(row => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell, _) => (
                  <TableCell
                    key={cell.id}
                    className='truncate px-5 py-3 text-gray-700 text-theme-sm dark:text-gray-300'
                    // style={{
                    //   background: 'white',
                    //   position: cellIndex === 0 ? 'sticky' : 'static',
                    //   left: cellIndex === 0 ? 0 : undefined,
                    //   zIndex: cellIndex === 0 ? 1 : 0,
                    // }}
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
                colSpan={7}
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
