import { DEVICES } from '@/configs/devices';
import { Material } from '@/types/IDevices';

export default function Devices({
  employeeMaterial,
}: {
  employeeMaterial: Array<Material>;
}) {
  return (
    <div>
      {employeeMaterial?.map((item, index) => (
        <div key={index} className='mb-3 border-b-2 last:border-0'>
          <div className='text-sm'>Thiết bị {index + 1}</div>
          <ul className='divide-y divide-gray-100 dark:divide-gray-800'>
            <li className='flex items-center gap-5 py-2.5'>
              <span className='w-1/2 text-sm text-gray-500 sm:w-1/4 dark:text-gray-400'>
                Tên
              </span>
              <span className='w-1/2 text-sm font-medium text-gray-700 sm:w-3/4 dark:text-gray-400'>
                {DEVICES[item.device as keyof typeof DEVICES]}
              </span>
            </li>
            <li className='flex items-center gap-5 py-2.5'>
              <span className='w-1/2 text-[13px] text-gray-500 sm:w-1/4 dark:text-gray-400'>
                Code
              </span>
              <span className='w-1/2 text-sm font-medium text-gray-700 sm:w-3/4 dark:text-gray-400'>
                {item.code}
              </span>
            </li>

            <li className='flex items-center gap-5 py-2.5'>
              <span className='w-1/2 text-sm text-gray-500 sm:w-1/4 dark:text-gray-400'>
                Ghi chú
              </span>
              <span className='w-1/2 text-sm font-medium text-gray-700 sm:w-3/4 dark:text-gray-400'>
                {item.note}
              </span>
            </li>
          </ul>
        </div>
      ))}
    </div>
  );
}
