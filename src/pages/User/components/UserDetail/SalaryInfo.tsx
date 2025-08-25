import { formatVND } from '@/shared/utils/helpers';
import { IEmployBenefit } from '@/types';

export default function SalaryInfo({
  employeeBenefit,
}: {
  employeeBenefit: IEmployBenefit;
}) {
  return (
    <div>
      <ul className='divide-y divide-gray-100 dark:divide-gray-800'>
        <li className='flex items-center gap-5 py-2.5'>
          <span className='w-1/2 text-sm text-gray-500 sm:w-1/4 dark:text-gray-400'>
            Lương
          </span>
          <span className='w-1/2 text-sm font-medium text-gray-700 sm:w-3/4 dark:text-gray-400'>
            {formatVND(employeeBenefit.benefits.baseSalary || 0)}
          </span>
        </li>
        <li className='flex items-center gap-5 py-2.5'>
          <span className='w-1/2 text-sm text-gray-500 sm:w-1/4 dark:text-gray-400'>
            Ngày phép
          </span>
          <span className='w-1/2 text-sm font-medium text-gray-700 sm:w-3/4 dark:text-gray-400'>
            {employeeBenefit.benefits.paidLeaveDays || 0}
          </span>
        </li>
      </ul>
    </div>
  );
}
