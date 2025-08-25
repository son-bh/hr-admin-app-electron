import { USER_ROLE } from '@/configs';
import { GenderText } from '@/shared/constants';
import { IUser } from '@/types';
import { formatDate } from 'date-fns';

export default function Information({ userDetail }: { userDetail: IUser }) {
  return (
    <div>
      <ul className='divide-y divide-gray-100 dark:divide-gray-800'>
        <li className='flex items-center gap-5 py-2.5'>
          <span className='w-1/2 text-sm text-gray-500 sm:w-1/4 dark:text-gray-400'>
            Username
          </span>
          <span className='w-1/2 text-sm font-medium text-gray-700 sm:w-3/4 dark:text-gray-400'>
            {userDetail.username}
          </span>
        </li>
        <li className='flex items-center gap-5 py-2.5'>
          <span className='w-1/2 text-sm text-gray-500 sm:w-1/4 dark:text-gray-400'>
            Email
          </span>
          <span className='w-1/2 text-sm font-medium text-gray-700 sm:w-3/4 dark:text-gray-400'>
            {userDetail.email}
          </span>
        </li>
        <li className='flex items-center gap-5 py-2.5'>
          <span className='w-1/2 text-sm text-gray-500 sm:w-1/4 dark:text-gray-400'>
            Tên
          </span>
          <span className='w-1/2 text-sm font-medium text-gray-700 sm:w-3/4 dark:text-gray-400'>
            {userDetail.fullname || '--'}
          </span>
        </li>
        <li className='flex items-center gap-5 py-2.5'>
          <span className='w-1/2 text-sm text-gray-500 sm:w-1/4 dark:text-gray-400'>
            Chức vụ
          </span>
          <span className='w-1/2 text-sm font-medium text-gray-700 sm:w-3/4 dark:text-gray-400'>
            {USER_ROLE[userDetail?.role as keyof typeof USER_ROLE]}
          </span>
        </li>
        <li className='flex items-center gap-5 py-2.5'>
          <span className='w-1/2 text-sm text-gray-500 sm:w-1/4 dark:text-gray-400'>
            Bộ phận
          </span>
          <span className='w-1/2 text-sm font-medium text-gray-700 sm:w-3/4 dark:text-gray-400'>
            {userDetail?.teamId?.name || '--'}
          </span>
        </li>
        <li className='flex items-center gap-5 py-2.5'>
          <span className='w-1/2 text-sm text-gray-500 sm:w-1/4 dark:text-gray-400'>
            Ngày nhận việc
          </span>
          <span className='w-1/2 text-sm font-medium text-gray-700 sm:w-3/4 dark:text-gray-400'>
            {userDetail.onboardAt
              ? formatDate(userDetail.onboardAt, 'dd/MM/yyyy')
              : '--'}
          </span>
        </li>
        <li className='flex items-center gap-5 py-2.5'>
          <span className='w-1/2 text-sm text-gray-500 sm:w-1/4 dark:text-gray-400'>
            Ngày chuyển chính
          </span>
          <span className='w-1/2 text-sm font-medium text-gray-700 sm:w-3/4 dark:text-gray-400'>
            {userDetail.officialAt
              ? formatDate(userDetail.officialAt, 'dd/MM/yyyy')
              : '--'}
          </span>
        </li>
        <li className='flex items-center gap-5 py-2.5'>
          <span className='w-1/2 text-sm text-gray-500 sm:w-1/4 dark:text-gray-400'>
            Ngày sinh
          </span>
          <span className='w-1/2 text-sm font-medium text-gray-700 sm:w-3/4 dark:text-gray-400'>
            {userDetail.birthday
              ? formatDate(userDetail.birthday, 'dd/MM/yyyy')
              : '--'}
          </span>
        </li>
        <li className='flex items-center gap-5 py-2.5'>
          <span className='w-1/2 text-sm text-gray-500 sm:w-1/4 dark:text-gray-400'>
            Giới tính
          </span>
          <span className='w-1/2 text-sm font-medium text-gray-700 sm:w-3/4 dark:text-gray-400'>
            {GenderText[userDetail.gender as keyof typeof GenderText]}
          </span>
        </li>
        <li className='flex items-center gap-5 py-2.5'>
          <span className='w-1/2 text-sm text-gray-500 sm:w-1/4 dark:text-gray-400'>
            Trình trạng
          </span>
          <span className='w-1/2 text-sm font-medium text-gray-700 sm:w-3/4 dark:text-gray-400'>
            {userDetail.isOfficial ? 'Chính thức' : 'Thử việc'}
          </span>
        </li>
        <li className='flex items-center gap-5 py-2.5'>
          <span className='w-1/2 text-sm text-gray-500 sm:w-1/4 dark:text-gray-400'>
            Số điện thoại
          </span>
          <span className='w-1/2 text-sm font-medium text-gray-700 sm:w-3/4 dark:text-gray-400'>
            {userDetail.phone || '--'}
          </span>
        </li>
        {/* <li className='flex items-center gap-5 py-2.5'>
          <span className='w-1/2 text-sm text-gray-500 sm:w-1/4 dark:text-gray-400'>
            Tài khoản xã hội
          </span>
          <div className='w-1/2 text-sm font-medium text-gray-700 sm:w-3/4 dark:text-gray-400'>
            {userDetail?.social &&
              Object.keys(userDetail.social).map((key, index) => (
                <div key={index} className='flex items-center gap-2'>
                  <span className='capitalize'>{key}:</span>
                  <span className='text-gray-600'>
                    {userDetail.social[key]}
                  </span>
                </div>
              ))}
          </div>
        </li> */}
      </ul>
    </div>
  );
}
