import { IWorkingDays } from '@/types';
import { format } from 'date-fns';

export default function WorkHistory({
  workingDays,
}: {
  workingDays: IWorkingDays;
}) {
  return (
    <div>
      <div className='text-sm mb-3'>Tháng: {format(new Date(), 'MM-yyyy')}</div>
      <ul className='divide-y divide-gray-100 dark:divide-gray-800'>
        <li className='flex items-center gap-5 py-2.5'>
          <span className='w-1/2 text-sm text-gray-500 sm:w-1/4 dark:text-gray-400'>
            Tổng ngày làm
          </span>
          <span className='w-1/2 text-sm font-medium text-gray-700 sm:w-3/4 dark:text-gray-400'>
            {workingDays.totalWorkDays}
          </span>
        </li>
        <li className='flex items-center gap-5 py-2.5'>
          <span className='pl-4 w-1/2 text-[13px] text-gray-500 sm:w-1/4 dark:text-gray-400'>
            Số lần về sớm
          </span>
          <span className='w-1/2 text-sm font-medium text-gray-700 sm:w-3/4 dark:text-gray-400'>
            {workingDays.earlyBreakCount}
          </span>
        </li>
        <li className='flex items-center gap-5 py-2.5'>
          <span className='pl-4 w-1/2 text-[13px] text-gray-500 sm:w-1/4 dark:text-gray-400'>
            Số lần đi trễ
          </span>
          <span className='w-1/2 text-sm font-medium text-gray-700 sm:w-3/4 dark:text-gray-400'>
            {workingDays.lateCount}
          </span>
        </li>
        <li className='flex items-center gap-5 py-2.5'>
          <span className='w-1/2 text-sm text-gray-500 sm:w-1/4 dark:text-gray-400'>
            Tổng ngày off
          </span>
          <span className='w-1/2 text-sm font-medium text-gray-700 sm:w-3/4 dark:text-gray-400'>
            {0}
          </span>
        </li>
      </ul>
    </div>
  );
}
