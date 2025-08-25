import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import PageMeta from '@/components/common/PageMeta';
import Button from '@/components/ui/button/Button';
import { useQueryGetDetailPolicy } from '@/services/policy';
import { formatVND } from '@/shared/utils/helpers';
import { useState } from 'react';
import { IoMdAddCircleOutline } from 'react-icons/io';
import PolicyFormModal from './components/PolicyFormModel';
import { IPolicy, PERMISSIONS } from '@/types';
import AuthorizationWrapper from '@/components/common/AuthorizationWrapper';

const defaultOpenModal = {
  detail: false,
};
export default function Policy() {
  const { data: policy, refetch } = useQueryGetDetailPolicy();
  const [policyDetail, setPolicyDetail] = useState<IPolicy | undefined>();
  const [openModal, setOpenModal] = useState<{
    detail: boolean;
  }>(defaultOpenModal);
  const handleCloseModal = () => {
    setOpenModal(defaultOpenModal);
  };

  return (
    <>
      <PageMeta title='Chính sách' description='Chính sách' />
      <div>
        <div className='flex items-center justify-between flex-wrap'>
          <PageBreadcrumb pageTitle='Chính sách' />
          <AuthorizationWrapper allowedRoles={PERMISSIONS.CREATE_BENEFIT}>
            <Button
              onClick={() => {
                setOpenModal(prev => ({ ...prev, detail: true }));
                if (policy?.data) setPolicyDetail(policy?.data);
              }}
              className='mb-6'
            >
              Cài đặt chính sách
            </Button>
          </AuthorizationWrapper>
        </div>
        {!policy || !policy.data ? (
          <div className=' bg-white shadow-lg rounded-xl p-6 flex flex-col items-center justify-center text-gray-500'>
            <IoMdAddCircleOutline
              size={32}
              className='cursor-pointer'
              onClick={() => {
                setOpenModal(prev => ({ ...prev, detail: true }));
              }}
            />
            <p>Không có dữ liệu chính sách</p>
          </div>
        ) : (
          <div className='bg-white shadow-lg rounded-xl p-6 space-y-6'>
            {/* Thông tin chính sách */}
            <div>
              <h2 className='text-2xl font-bold text-gray-800'>
                {policy?.data?.name}
              </h2>
              {/* <p className='text-gray-600 mt-1'>{policy?.data?.description}</p> */}
            </div>

            {/* Thử việc */}
            <div>
              <h3 className='text-lg font-semibold text-orange-500 mb-3'>
                👨‍💻 Thử việc
              </h3>
              <ul className='space-y-2 text-gray-700'>
                <li className='flex justify-between border-b pb-1'>
                  <span>Tỷ lệ lương chính thức</span>
                  <span>{policy?.data?.probationSalaryPercent || '0'}%</span>
                </li>
                <li className='flex justify-between border-b pb-1'>
                  <span>Số ngày phép</span>
                  <span>{policy?.data?.probationLeaveDays || '0'}</span>
                </li>
              </ul>
            </div>

            {/* Thưởng */}
            <div>
              <h3 className='text-lg font-semibold text-green-600 mb-3'>
                🎁 Thưởng
              </h3>
              <ul className='space-y-2 text-gray-700'>
                <li className='flex justify-between border-b pb-1'>
                  <span>Sinh nhật</span>
                  <span>{formatVND(policy?.data?.rewards?.birthday)}</span>
                </li>
                <li className='flex justify-between border-b pb-1'>
                  <span> Lương tăng ca</span>
                  <span>{formatVND(policy?.data?.rewards?.overtimeBonus)}</span>
                </li>
                <li className='flex justify-between border-b pb-1'>
                  <span>Thưởng hiệu suất</span>
                  <span>
                    {formatVND(policy?.data?.rewards?.performanceBonus)}
                  </span>
                </li>
                {policy?.data?.rewards?.other &&
                  policy.data.rewards.other.map((item, index) => (
                    <li
                      key={index}
                      className='flex justify-between border-b pb-1'
                    >
                      <span>{item.name}</span>
                      <span>{formatVND(item.amount)}</span>
                    </li>
                  ))}
              </ul>
            </div>

            {/* Phạt */}
            <div>
              <h3 className='text-lg font-semibold text-red-600 mb-3'>
                ⚠️ Phạt
              </h3>
              <ul className='space-y-2 text-gray-700'>
                <li className='flex justify-between border-b pb-1'>
                  <span>Đi trễ</span>
                  <span>{formatVND(policy?.data?.penalties?.late)}</span>
                </li>
                <li className='flex justify-between border-b pb-1'>
                  <span>Về sớm</span>
                  <span>{formatVND(policy?.data?.penalties?.earlyLeave)}</span>
                </li>
                <li className='flex justify-between border-b pb-1'>
                  <span>Vượt thời gian nghỉ</span>
                  <span>{formatVND(policy?.data?.penalties?.overBreak)}</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
      <PolicyFormModal
        isOpen={openModal.detail}
        policyDetail={policyDetail}
        handleRefetchData={refetch}
        closeModal={handleCloseModal}
      />
    </>
  );
}
