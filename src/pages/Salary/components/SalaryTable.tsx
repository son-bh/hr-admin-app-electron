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
import { ISalaryRecord, SalaryStatus } from '@/types';
import {
  ModalType,
  SalaryStatus as SalaryStatusCons,
  SalaryStatusOption,
  StatusColor,
} from '@/shared/constants';
import Select from '@/components/form/Select';
import classNames from 'classnames';
import { formatDate } from 'date-fns';
import { USER_ROLE } from '@/configs';
import { formatVND } from '@/shared/utils/helpers';
import {
  MdOutlineRemoveRedEye,
  MdFeedback,
  MdCheckCircle,
} from 'react-icons/md';
import { FaMoneyBill } from 'react-icons/fa';

interface ISalaryTableProps {
  salaries: Array<ISalaryRecord>;
  handleEditSalary: (data: ISalaryRecord, modalType: string) => void;
}

export default function SalaryTable({
  salaries,
  handleEditSalary,
}: ISalaryTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const columnHelper = createColumnHelper<ISalaryRecord>();

  const columns = useMemo<ColumnDef<ISalaryRecord, any>[]>(
    () => [
      // columnHelper.accessor('employee', {
      //   header: () => 'Tên',
      //   cell: info => (
      //     <div className='underline decoration-blue-500 cursor-pointer'>{info.getValue()?.fullname || info.getValue()?.username}</div>
      //   ),
      // }),
      columnHelper.accessor('employee', {
        header: 'Tên',
        cell: info => (
          <div className='flex items-center gap-2'>
            <button
              className='rounded hover:bg-gay-400 text-gray-500 hover:text-blue-400 underline'
              onClick={() => {
                handleEditSalary(info?.row.original, ModalType.Detail);
              }}
            >
              {info.getValue()?.fullname || info.getValue()?.username}
            </button>
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
      columnHelper.accessor('team', {
        id: 'team',
        header: () => 'Bộ phận',
        cell: info => <div>{info.getValue() || '--'}</div>,
      }),
      columnHelper.accessor('baseSalary', {
        header: () => 'Lương cơ bản',
        cell: info => <div>{formatVND(info.getValue()) || 0}</div>,
      }),
      columnHelper.accessor('workingDays', {
        header: () => 'Công tính lương',
        cell: info => <div>{info.getValue() || 0}</div>,
      }),
      columnHelper.accessor('mainSalary', {
        header: () => 'Lương thực tế',
        cell: info => <div>{formatVND(info.getValue() || 0)}</div>,
      }),
      columnHelper.group({
        header: 'Tiền phạt',
        footer: props => props.column.id,
        columns: [
          columnHelper.accessor('penaltyDetails', {
            header: 'Tổng đơn phạt',
            cell: info => <div>{info.getValue()?.length || 0}</div>,
          }),
          columnHelper.accessor('penalty', {
            header: 'Tổng tiền phạt',
            cell: info => (
              <div className='text-error-500'>
                {formatVND(info.getValue()) || 0}
              </div>
            ),
          }),
        ],
      }),
      columnHelper.accessor('bonus', {
        header: () => 'Thưởng',
        cell: info => <div>{formatVND(info.getValue()) || 0}</div>,
      }),
      columnHelper.accessor('totalSalary', {
        header: () => 'Tổng thực lãnh',
        cell: info => (
          <div className='text-success-400'>
            {formatVND(info.getValue()) || 0}
          </div>
        ),
      }),
      columnHelper.accessor('isSentToEmployee', {
        header: () => 'Gửi bảng lương',
        cell: info => (
          <div
            className={classNames(
              'flex items-center gap-2',
              info.getValue() ? 'text-success-400' : 'text-warning-400'
            )}
          >
            <div>{info.getValue() ? 'Đã gửi' : 'Chưa gửi'}</div>
            {info.getValue() && (
              <div className='text-[13px]'>
                {info?.row.original.status === SalaryStatusCons.FEEDBACK && (
                  <div className=''>
                    <button
                      className='flex items-center gap-1.5 bg-error-50 text-error-500 p-1.5 rounded-md'
                      onClick={() => {
                        handleEditSalary(info?.row.original, ModalType.Note);
                      }}
                    >
                      <span>Y/C chỉnh sửa</span>
                      <MdFeedback className='w-4 h-4' />
                    </button>
                  </div>
                )}
                {info?.row.original.status === SalaryStatusCons.CONFIRMED && (
                  <div className='flex items-center gap-1.5 bg-success-50 text-success-500 p-1.5 rounded-md'>
                    <span>Đã xác nhận</span>
                    <MdCheckCircle className='w-4 h-4' />
                  </div>
                )}
              </div>
            )}
          </div>
        ),
      }),
      columnHelper.accessor('status', {
        header: () => 'Trạng thái',
        cell: info => (
          <Select
            defaultValue={info.getValue()}
            options={SalaryStatusOption.filter(item =>
              [SalaryStatusCons.DRAFT, SalaryStatusCons.PAID].includes(
                item.value
              )
            )}
            placeholder='--Chọn--'
            isSetSelectedValue={false}
            className={classNames(
              '!w-[120px] !p-0 !text-center cursor-pointer',
              StatusColor[
                info.getValue() === SalaryStatusCons.PAID
                  ? info.getValue()
                  : SalaryStatusCons.DRAFT
              ]
            )}
            onChange={(e: string) => {
              handleEditSalary(
                { ...info?.row.original, status: e as SalaryStatus },
                ModalType.ChangeStatus
              );
            }}
          />
        ),
      }),
      columnHelper.accessor('createdAt', {
        header: () => 'Ngày tạo',
        cell: info => <div>{formatDate(info.getValue(), 'hh/MM/yyyy')}</div>,
      }),
      columnHelper.accessor('_id', {
        header: 'Thao tác',
        cell: info => (
          <div className='flex items-center gap-2'>
            <button
              className='rounded hover:bg-gay-400 text-gray-500 hover:text-blue-400'
              onClick={() => {
                handleEditSalary(info?.row.original, ModalType.Detail);
              }}
            >
              <MdOutlineRemoveRedEye className='w-4 h-4' />
            </button>
            {!info?.row.original.isSentToEmployee && (
              <button
                className='rounded hover:bg-gay-400 text-gray-500 hover:text-blue-400'
                onClick={() => {
                  handleEditSalary(info?.row.original, ModalType.Send);
                }}
              >
                <FaMoneyBill className='w-4 h-4' />
              </button>
            )}
          </div>
        ),
      }),
    ],
    []
  );

  const data = useMemo(() => salaries || [], [salaries]);

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
      <Table className='[&>thead>*:nth-child(even)>th]:border-r [&>thead>*:nth-child(even)]:border-gray-300'>
        <TableHeader className='border-b border-gray-100 dark:border-white/[0.05]'>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header, columnIndex) => {
                return (
                  <TableCell
                    key={header.id}
                    isHeader
                    className={classNames(
                      'truncate px-5 py-3 font-medium text-gray-700 text-start text-theme-xs dark:text-gray-400 border-b border-gray-200 bg-white',
                      {
                        'border-x': header.colSpan > 1,
                      }
                    )}
                    colSpan={header.colSpan}
                    style={{
                      padding: '8px',
                      position: columnIndex === 0 ? 'sticky' : 'static',
                      left: columnIndex === 0 ? 0 : undefined,
                      zIndex: columnIndex === 0 ? 2 : 1,
                    }}
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={classNames({
                          // "cursor-pointer": header.column.getCanSort(),
                          'text-center': header.colSpan > 1,
                        })}
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
                {row.getVisibleCells().map((cell, cellIndex) => (
                  <TableCell
                    key={cell.id}
                    className='truncate px-5 py-3 text-gray-700 text-theme-sm dark:text-gray-300'
                    style={{
                      background: 'white',
                      position: cellIndex === 0 ? 'sticky' : 'static',
                      left: cellIndex === 0 ? 0 : undefined,
                      zIndex: cellIndex === 0 ? 1 : 0,
                    }}
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
                colSpan={14}
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
