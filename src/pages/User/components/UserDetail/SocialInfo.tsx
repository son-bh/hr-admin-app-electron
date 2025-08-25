import { IUser } from '@/types';

export default function SocialInfo({ userDetail }: { userDetail: IUser }) {
  return (
    <div>
      <div className='w-full text-sm font-medium text-gray-700 dark:text-gray-400'>
        {userDetail?.social &&
          Object.keys(userDetail.social).map((key, index) => (
            <div
              key={index}
              className='flex items-center gap-2 py-2.5 border-b border-b-gray-100'
            >
              <span className='w-1/2 text-sm text-gray-500 sm:w-1/3 dark:text-gray-400'>
                {`Tài khoản ${key}`}:
              </span>
              <span className='w-1/2 text-sm font-medium text-gray-700 sm:w-2/3 dark:text-gray-400'>
                {userDetail.social[key]}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}
