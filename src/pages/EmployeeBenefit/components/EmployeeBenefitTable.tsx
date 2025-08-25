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

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { IEmployBenefit } from '@/types';
import { ModalType } from '@/shared/constants';
import { formatVND } from '@/shared/utils/helpers';
import { LuPencil } from 'react-icons/lu';
import { USER_ROLE } from '@/configs';
import { formatDate } from 'date-fns';

interface IUserListProps {
  employeeBenefits: Array<IEmployBenefit>;
  handleEditEmployeeBenefit: (data: IEmployBenefit, modalType: string) => void;
}

export default function EmployeeBenefitTable({
  employeeBenefits,
  handleEditEmployeeBenefit,
}: IUserListProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const columnHelper = createColumnHelper<IEmployBenefit>();

  const columns = useMemo<ColumnDef<IEmployBenefit, any>[]>(
    () => [
      // columnHelper.accessor('employeeId', {
      //   header: () => 'Tên',
      //   cell: info => (
      //     <div>
      //       {info.getValue()?.fullname || info.getValue()?.username || '--'}
      //     </div>
      //   ),
      // }),
      columnHelper.accessor('employeeId', {
        header: 'Tên',
        cell: info => (
          <div className='flex items-center gap-2'>
            <button
              className={`rounded text-gray-500 hover:text-blue-400 ${info.getValue()?.fullname || info.getValue()?.username ? 'underline' : ''}`}
              onClick={() => {
                handleEditEmployeeBenefit(info?.row.original, ModalType.Block);
              }}
            >
              {info.getValue()?.fullname || info.getValue()?.username || '--'}
            </button>
          </div>
        ),
      }),
      columnHelper.accessor('employeeId.role', {
        header: () => 'Chức vụ',
        cell: info => (
          <div>
            {USER_ROLE[info.getValue() as keyof typeof USER_ROLE] || '--'}
          </div>
        ),
      }),
      columnHelper.accessor('teamId.name', {
        header: () => 'Bộ phận',
        cell: info => <div>{info.getValue() || info.row.original?.teamId}</div>,
      }),
      columnHelper.accessor('benefits.baseSalary', {
        header: () => 'Lương cơ bản',
        cell: info => <div>{formatVND(info.getValue()) || '--'}</div>,
      }),
      columnHelper.accessor('benefits.paidLeaveDays', {
        header: () => 'Ngày phép',
        cell: info => <div>{info.getValue() || '--'}</div>,
      }),
      columnHelper.accessor('isOfficial', {
        header: () => 'Tình trạng nhân viên',
        cell: info => <div>{info.getValue() ? 'Chính thức' : 'Thử việc'}</div>,
      }),
      columnHelper.accessor('actionBy', {
        header: () => 'Người tạo',
        cell: info => <div>{info.getValue()?.username || '--'}</div>,
      }),
      columnHelper.accessor('createdAt', {
        header: () => 'Ngày tạo',
        cell: info => (
          <div>{formatDate(info.getValue(), 'dd/MM/yyyy') || '--'}</div>
        ),
      }),
      columnHelper.accessor('updatedAt', {
        header: () => 'Ngày cập nhật',
        cell: info => (
          <div>{formatDate(info.getValue(), 'dd/MM/yyyy') || '--'}</div>
        ),
      }),
      columnHelper.accessor('_id', {
        header: 'Thao tác',
        cell: info => (
          <div className='flex items-center gap-2'>
            <button
              className='rounded text-gray-500 hover:text-blue-400'
              onClick={() => {
                handleEditEmployeeBenefit(info?.row.original, ModalType.Block);
              }}
            >
              <LuPencil className='w-4 h-4' />
            </button>

            <button
              className='rounded text-gray-500 hover:text-red-500'
              onClick={() => {
                handleEditEmployeeBenefit(info?.row.original, ModalType.Delete);
              }}
            >
              <FaTrash color='bg-red-400' />
            </button>
          </div>
        ),
      }),
    ],
    []
  );

  const data = useMemo(() => employeeBenefits || [], [employeeBenefits]);

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
                colSpan={10}
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
