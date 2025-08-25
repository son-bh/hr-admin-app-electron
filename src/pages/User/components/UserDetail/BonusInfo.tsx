import { formatVND } from '@/shared/utils/helpers';
import { IRewardsAndPenalties } from '@/types';

export default function BonusInfo({
  rewardsAndPenalties,
}: {
  rewardsAndPenalties: IRewardsAndPenalties;
}) {
  return (
    <div>
      <ul className='divide-y divide-gray-100 dark:divide-gray-800'>
        <li className='flex items-center gap-5 py-2.5'>
          <span className='w-1/2 text-sm text-gray-500 sm:w-1/4 dark:text-gray-400'>
            Thưởng
          </span>
          <span className='w-1/2 text-sm font-medium text-gray-700 sm:w-3/4 dark:text-gray-400'>
            {formatVND(rewardsAndPenalties.reward || 0)}
          </span>
        </li>
        <li className='flex items-center gap-5 py-2.5'>
          <span className='pl-4 w-1/2 text-[13px] text-gray-500 sm:w-1/4 dark:text-gray-400'>
            Lý do:
          </span>
          <span className='w-1/2 text-sm font-medium text-gray-700 sm:w-3/4 dark:text-gray-400'>
            {rewardsAndPenalties.bonusBirthday ? 'Sinh nhật' : ''}
          </span>
        </li>

        <li className='flex items-center gap-5 py-2.5'>
          <span className='w-1/2 text-sm text-gray-500 sm:w-1/4 dark:text-gray-400'>
            Phạt
          </span>
          <span className='w-1/2 text-sm font-medium text-gray-700 sm:w-3/4 dark:text-gray-400'>
            {formatVND(rewardsAndPenalties.penalty || 0)}
          </span>
        </li>
      </ul>
    </div>
  );
}
