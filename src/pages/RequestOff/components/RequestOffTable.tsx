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
import { IRequestOff, PERMISSIONS, UserStatus } from '@/types';
import {
  ModalType,
  Status,
  StatusColor,
  StatusOption,
} from '@/shared/constants';
import Select from '@/components/form/Select';
import classNames from 'classnames';
import { formatDate } from 'date-fns';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import useUserStore from '@/store/userStore';
import { checkIsDisableSelectByPermission } from '@/shared/utils/helpers';

interface IUserListProps {
  requestData: Array<IRequestOff>;
  handleAction: (data: IRequestOff, modalType: string) => void;
}

export default function RequestOffTable({
  requestData,
  handleAction,
}: IUserListProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const columnHelper = createColumnHelper<IRequestOff>();
  const userInfo = useUserStore(state => state.userInfo);

  const columns = useMemo<ColumnDef<IRequestOff, any>[]>(
    () => [
      columnHelper.accessor(row => row.employee?.username, {
        id: 'employee.username',
        header: () => 'Tài khoản',
        cell: info => <div>{info.getValue() || '--'}</div>,
      }),
      columnHelper.accessor(row => row.employee?.email, {
        id: 'employee.email',
        header: () => 'Email',
        cell: info => <div>{info.getValue() || '--'}</div>,
      }),
      columnHelper.accessor(row => row.schedule?.date, {
        id: 'schedule.date',
        header: () => 'Ngày',
        cell: info => (
          <div>
            {info.getValue() ? formatDate(info.getValue(), 'dd/MM/yyyy') : '--'}
          </div>
        ),
      }),
      columnHelper.accessor(row => row.schedule?.shift, {
        id: 'schedule.shift',
        header: () => 'Ca',
        cell: info => (
          <div>
            {info.getValue() ? (
              <>
                <span>{info.getValue().name}: </span>
                <span>
                  {info.getValue().startTime} - {info.getValue().endTime}
                </span>
              </>
            ) : (
              '--'
            )}
          </div>
        ),
      }),
      columnHelper.accessor('reason', {
        header: () => 'Lý do',
        cell: info => <div>{info.getValue() || '--'}</div>,
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
      columnHelper.accessor('status', {
        header: () => 'Trạng thái',
        cell: info => (
          <Select
            defaultValue={info.getValue()}
            options={StatusOption}
            disabled={
              checkIsDisableSelectByPermission(
                userInfo,
                PERMISSIONS.APPROVE_REQUESTS
              ) || info.getValue() !== Status.PENDING
            }
            // disabled={
            //   (userInfo &&
            //     userInfo?.permissions?.length &&
            //     !userInfo?.permissions.includes(
            //       PERMISSIONS.APPROVE_REQUESTS
            //     )) ||
            //   info.getValue() === Status.APPROVED
            // }
            placeholder='--Chọn--'
            isSetSelectedValue={false}
            className={classNames(
              '!w-[120px] !p-0 !text-center cursor-pointer',
              StatusColor[info.getValue()]
            )}
            onChange={(e: string) => {
              handleAction(
                { ...info?.row.original, status: e as UserStatus },
                ModalType.ChangeStatus
              );
            }}
          />
        ),
      }),
      columnHelper.accessor(row => row.approvedBy?.username, {
        id: 'approvedBy.username',
        header: () => 'Duyệt bởi',
        cell: info => <div>{info.getValue() || '--'}</div>,
      }),
      columnHelper.accessor('updatedAt', {
        header: () => 'Duyệt lúc',
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

  const data = useMemo(() => requestData || [], [requestData]);

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
