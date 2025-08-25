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
// import { FaTrash } from 'react-icons/fa';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ISystemLogs } from '@/types';
import {
  ACTION_SYSTEM_LOG_LABEL,
  ModalType,
  REF_TYPE_LABEL,
  StatusColor,
} from '@/shared/constants';
import classNames from 'classnames';
import { formatDate } from 'date-fns';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { USER_ROLE } from '@/configs';

interface IUserListProps {
  SystemLogsData: Array<ISystemLogs>;
  handleAction: (data: ISystemLogs, modalType: string) => void;
}

export default function SystemLogsTable({
  SystemLogsData,
  handleAction,
}: IUserListProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const columnHelper = createColumnHelper<ISystemLogs>();

  const columns = useMemo<ColumnDef<ISystemLogs, any>[]>(
    () => [
      // columnHelper.accessor('triggeredBy.username', {
      //   header: () => 'Người thực hiện',
      //   cell: info => <div>{info.getValue()}</div>,
      // }),
      columnHelper.accessor('triggeredBy.username', {
        header: 'Người thực hiện',
        cell: info => (
          <div className='flex items-center gap-2'>
            <button
              className='rounded text-gray-500 hover:text-blue-500 underline'
              onClick={() => {
                handleAction(info?.row.original, ModalType.Detail);
              }}
            >
              {info.getValue()}
            </button>
          </div>
        ),
      }),
      columnHelper.accessor('actionType', {
        header: () => 'Hành động',
        cell: info => (
          <div
            className={classNames(
              'border text-center rounded-md px-3 py-1',
              StatusColor[info.getValue()]
            )}
          >
            {ACTION_SYSTEM_LOG_LABEL[info.getValue()]}
          </div>
        ),
      }),
      columnHelper.accessor('refType', {
        header: () => 'Kiểu tham chiếu',
        cell: info => <div>{REF_TYPE_LABEL[info.getValue()]}</div>,
      }),
      columnHelper.accessor('description', {
        header: () => 'Tác vụ',
        cell: info => <div>{info.getValue()}</div>,
      }),
      columnHelper.accessor('triggeredBy.role', {
        header: () => 'Chức vụ',
        cell: info => (
          <div>{USER_ROLE[info.getValue() as keyof typeof USER_ROLE]}</div>
        ),
      }),
      columnHelper.accessor('createdAt', {
        header: () => 'Ngày tạo',
        cell: info => (
          <div>
            {info.getValue()
              ? formatDate(info.getValue(), 'dd/MM/yyyy HH:mm')
              : '--'}
          </div>
        ),
      }),
      columnHelper.accessor('_id', {
        header: 'Thao tác',
        cell: info => (
          <div className='flex items-center gap-2'>
            <button
              className='rounded text-gray-500 hover:text-red-500'
              onClick={() => {
                handleAction(info?.row.original, ModalType.Detail);
              }}
            >
              <MdOutlineRemoveRedEye className='w-4 h-4' />
            </button>
          </div>
        ),
      }),
    ],
    []
  );

  const data = useMemo(() => SystemLogsData || [], [SystemLogsData]);

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
                colSpan={9}
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
