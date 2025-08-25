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
} from '../../../components/ui/table';
import { ITeam, PERMISSIONS } from '../../../types';
import { ModalType } from '../../../shared/constants';
import { formatDate } from 'date-fns';
import { LuPencil } from 'react-icons/lu';
import AuthorizationWrapper from '@/components/common/AuthorizationWrapper';

interface IUserListProps {
  team: Array<ITeam>;
  handleEditTeam: (data: ITeam, modalType: string) => void;
}

export default function TeamTable({ team, handleEditTeam }: IUserListProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const columnHelper = createColumnHelper<ITeam>();

  const columns = useMemo<ColumnDef<ITeam, any>[]>(
    () => [
      columnHelper.accessor('name', {
        header: () => 'Tên bộ phận',
        cell: info => <div>{info.getValue()}</div>,
      }),
      columnHelper.accessor('parentId', {
        header: () => 'Thuộc bộ phận',
        cell: info => <div>{info.getValue()?.name || '--'}</div>,
      }),
      columnHelper.accessor('createdAt', {
        header: () => 'Ngày tạo',
        cell: info => (
          <div>
            {info.getValue() ? formatDate(info.getValue(), 'dd/MM/yyyy') : '--'}
          </div>
        ),
      }),
      columnHelper.accessor('_id', {
        header: 'Thao tác',
        cell: info => (
          <div className='flex items-center gap-2'>
            <AuthorizationWrapper allowedRoles={PERMISSIONS.UPDATE_TEAM}>
              <button
                className='rounded text-gray-500 hover:text-blue-400'
                onClick={() => {
                  handleEditTeam(info?.row.original, ModalType.Upsert);
                }}
              >
                <LuPencil className='w-4 h-4' />
              </button>
            </AuthorizationWrapper>
            <AuthorizationWrapper allowedRoles={PERMISSIONS.DELETE_TEAM}>
              <button
                className='rounded text-gray-500 hover:text-red-500'
                onClick={() => {
                  handleEditTeam(info?.row.original, ModalType.Delete);
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

  const data = useMemo(() => team || [], [team]);

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
                className='px-5 py-3 text-center text-gray-500 dark:text-gray-400'
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
