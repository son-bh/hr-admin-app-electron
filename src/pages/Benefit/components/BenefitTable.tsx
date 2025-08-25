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
import { IBenefit, PERMISSIONS } from '@/types';
import { ModalType } from '@/shared/constants';
import { formatVND } from '@/shared/utils/helpers';
import { LuPencil } from 'react-icons/lu';
import { USER_ROLE } from '@/configs';
import AuthorizationWrapper from '@/components/common/AuthorizationWrapper';

interface IUserListProps {
  benefits: Array<IBenefit>;
  handleEditBenefit: (data: IBenefit, modalType: string) => void;
}

export default function BenefitTable({
  benefits,
  handleEditBenefit,
}: IUserListProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const columnHelper = createColumnHelper<IBenefit>();

  const columns = useMemo<ColumnDef<IBenefit, any>[]>(
    () => [
      columnHelper.accessor('name', {
        header: () => 'Tên',
        cell: info => (
          <div className='w-[200px] whitespace-normal break-words'>
            {info.getValue()}
          </div>
        ),
      }),
      columnHelper.accessor('role', {
        header: () => 'Chức vụ',
        cell: info => (
          <div>
            {USER_ROLE[info.getValue() as keyof typeof USER_ROLE] || '--'}
          </div>
        ),
      }),
      columnHelper.accessor('teamId', {
        header: () => 'Bộ phận',
        cell: info => (
          <div>{info.getValue()?.name || info.row.original?.teamId}</div>
        ),
      }),
      columnHelper.accessor('benefits.baseSalary', {
        header: () => 'Lương cơ bản',
        cell: info => <div>{formatVND(info.getValue()) || '--'}</div>,
      }),
      columnHelper.accessor('benefits.paidLeaveDays', {
        header: () => 'Số ngày nghỉ phép',
        cell: info => <div>{info.getValue() || '--'}</div>,
      }),
      columnHelper.accessor('note', {
        header: () => 'Ghi chú',
        cell: info => (
          <div
            onClick={() => {
              if (info.getValue()) {
                handleEditBenefit(info?.row.original, ModalType.Note);
              }
            }}
            className='w-[200px] whitespace-normal break-words overflow-hidden line-clamp-4'
          >
            {info.getValue() || '--'}
          </div>
        ),
      }),
      columnHelper.accessor('_id', {
        header: 'Thao tác',
        cell: info => (
          <div className='flex items-center gap-2'>
            <AuthorizationWrapper allowedRoles={PERMISSIONS.UPDATE_BENEFIT}>
              <button
                className='rounded text-gray-500 hover:text-blue-400'
                onClick={() => {
                  handleEditBenefit(info?.row.original, ModalType.Upsert);
                }}
              >
                <LuPencil className='w-4 h-4' />
              </button>
            </AuthorizationWrapper>
            <AuthorizationWrapper allowedRoles={PERMISSIONS.DELETE_BENEFIT}>
              <button
                className='rounded text-gray-500 hover:text-red-500'
                onClick={() => {
                  handleEditBenefit(info?.row.original, ModalType.Delete);
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

  const data = useMemo(() => benefits || [], [benefits]);

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
                colSpan={8}
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
