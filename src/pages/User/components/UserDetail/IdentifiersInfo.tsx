import { parseUserAgent } from '@/shared/utils/helpers';
import { IUser } from '@/types';

export default function IdentifiersInfo({ userDetail }: { userDetail: IUser }) {
  const info = parseUserAgent(userDetail?.userAgent);

  return (
    <div>
      <ul className='divide-y divide-gray-100 dark:divide-gray-800'>
        <li className='flex items-center gap-5 py-2.5'>
          <span className='w-1/2 text-sm text-gray-500 sm:w-1/3 dark:text-gray-400'>
            Địa chỉ IP
          </span>
          <span className='w-1/2 text-sm font-medium text-gray-700 sm:w-2/3 dark:text-gray-400'>
            {userDetail.ip}
          </span>
        </li>
        <li className='flex items-center gap-5 py-2.5'>
          <span className='w-1/2 text-sm text-gray-500 sm:w-1/3 dark:text-gray-400'>
            Trình duyệt
          </span>
          <span className='w-1/2 text-sm font-medium text-gray-700 sm:w-2/3 dark:text-gray-400'>
            {info?.browserName} {info?.browserVersion}
          </span>
        </li>
        <li className='flex items-center gap-5 py-2.5'>
          <span className='w-1/2 text-sm text-gray-500 sm:w-1/3 dark:text-gray-400'>
            Hệ điều hành
          </span>
          <span className='w-1/2 text-sm font-medium text-gray-700 sm:w-2/3 dark:text-gray-400'>
            {info.os}
          </span>
        </li>
        <li className='flex items-center gap-5 py-2.5'>
          <span className='w-1/2 text-sm text-gray-500 sm:w-1/3 dark:text-gray-400'>
            Thiết bị
          </span>
          <span className='w-1/2 text-sm font-medium text-gray-700 sm:w-2/3 dark:text-gray-400'>
            {info.device}
          </span>
        </li>
        <li className='flex items-center gap-5 py-2.5'>
          <span className='w-1/2 text-sm text-gray-500 sm:w-1/3 dark:text-gray-400'>
            User Agent
          </span>
          <span className='w-1/2 text-sm font-medium text-gray-700 sm:w-2/3 dark:text-gray-400'>
            {userDetail.userAgent}
          </span>
        </li>
      </ul>
    </div>
  );
}
