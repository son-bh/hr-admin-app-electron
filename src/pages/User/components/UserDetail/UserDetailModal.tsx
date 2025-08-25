import Button from '@/components/ui/button/Button';
import { Modal } from '@/components/ui/modal';
import Tabs, { TabItem } from '@/components/ui/tabs/Tabs';
import {
  IEmployBenefit,
  IRewardsAndPenalties,
  IUser,
  IWorkingDays,
} from '@/types';
import Information from './Information';
import WorkHistory from './WorkHistory';
import SalaryInfo from './SalaryInfo';
import { useQueryUserDetail } from '@/services';
import BonusInfo from './BonusInfo';
import { Material } from '@/types/IDevices';
import Devices from './Devices';
import SocialInfo from './SocialInfo';
import IdentifiersInfo from './IdentifiersInfo';

interface IUserDetailModalProps {
  userDetail?: IUser | null;
  isOpen: boolean;
  closeModal: () => void;
}

const DetailTab = {
  Info: 'info',
  Salary: 'salary',
  CheckIn: 'checkIn',
  Bonus: 'bonus',
  Devices: 'devices',
  Social: 'social',
  Identifiers: 'identifiers',
};

const PolicyNoData = () => {
  return <div className='text-sm my-3 text-gray-700'>Chưa có chính sách</div>;
};

export default function UserDetailModal({
  isOpen,
  userDetail,
  closeModal,
}: IUserDetailModalProps) {
  const { data: userDetailData } = useQueryUserDetail(
    userDetail?._id as string,
    {
      enabled: !!userDetail?._id,
    }
  );
  const {
    employeeBenefit,
    rewardsAndPenalties,
    workingDays,
    employeeMaterial,
  } = userDetailData?.data || {};

  const tabItems: TabItem[] = [
    {
      key: DetailTab.Info,
      label: 'Thông tin',
      content: <Information userDetail={userDetail as IUser} />,
    },
    {
      key: DetailTab.Salary,
      label: 'Lương & phép',
      content: !employeeBenefit ? (
        <PolicyNoData />
      ) : (
        <SalaryInfo employeeBenefit={employeeBenefit as IEmployBenefit} />
      ),
    },
    {
      key: DetailTab.CheckIn,
      label: 'Chấm công',
      content: !workingDays ? (
        <PolicyNoData />
      ) : (
        <WorkHistory workingDays={workingDays as IWorkingDays} />
      ),
    },
    {
      key: DetailTab.Bonus,
      label: 'Thưởng/ phạt',
      content: !rewardsAndPenalties ? (
        <PolicyNoData />
      ) : (
        <BonusInfo
          rewardsAndPenalties={rewardsAndPenalties as IRewardsAndPenalties}
        />
      ),
    },
    {
      key: DetailTab.Devices,
      label: 'Thiết bị',
      content: !rewardsAndPenalties ? (
        <PolicyNoData />
      ) : (
        <Devices employeeMaterial={employeeMaterial as Array<Material>} />
      ),
    },
    {
      key: DetailTab.Social,
      label: 'Tài khoản',
      content: !rewardsAndPenalties ? (
        <PolicyNoData />
      ) : (
        <SocialInfo userDetail={userDetail as IUser} />
      ),
    },
    {
      key: DetailTab.Identifiers,
      label: 'Định danh',
      content: !rewardsAndPenalties ? (
        <PolicyNoData />
      ) : (
        <IdentifiersInfo userDetail={userDetail as IUser} />
      ),
    },
  ];

  return (
    <Modal
      title={
        <h4 className='text-2xl sm:text-xl font-bold text-white mb-1'>
          Thông tin nhân sự
        </h4>
      }
      footerContent={
        <div className='flex items-center gap-3 px-2 mt-6 lg:justify-end'>
          <Button size='sm' variant='outline' onClick={closeModal}>
            Đóng
          </Button>
        </div>
      }
      isOpen={isOpen}
      onClose={closeModal}
      className='max-w-[700px] m-4'
    >
      <div className='lg:p-4'>
        <Tabs items={tabItems} defaultActiveKey={DetailTab.Info} />
      </div>
    </Modal>
  );
}
