// import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
// import MonthlySalesChart from "../../components/ecommerce/MonthlySalesChart";
// import StatisticsChart from "../../components/ecommerce/StatisticsChart";
// import MonthlyTarget from "../../components/ecommerce/MonthlyTarget";
// import RecentOrders from "../../components/ecommerce/RecentOrders";
// import DemographicCard from "../../components/ecommerce/DemographicCard";

import PageMeta from '@/components/common/PageMeta';
// import { usePreloadImage } from '@/hooks/usePreloadImage';
import useUserStore from '@/store/userStore';

export default function Home() {
  const userInfo = useUserStore(state => state.userInfo);
  // usePreloadImage(BG);

  return (
    <>
      <PageMeta title='Quản lý nhân sự' description='Quản lý nhân sự' />
      <div className='flex flex-col items-center'>
        <div className='w-[400px]'>
          <img src='/images/user/bg-main.webp' alt='User' />
        </div>
        <h3 className='font-bold text-2xl mt-8'>
          Chào mừng <span className='text-brand-500'>{userInfo?.username}</span>{' '}
          đến với trang Quản lý nhân sự!
        </h3>
      </div>
      {/* <h3 className="font-semibold text-2xl">{`Chào mừng bạn đến với trang Quản lý nhân sự`}</h3> */}
      {/* <h3 className="font-semibold text-2xl text-brand-500">Quản lý nhân sự</h3> */}
      {/* <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-7">
          <EcommerceMetrics />

          <MonthlySalesChart />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <MonthlyTarget />
        </div>

        <div className="col-span-12">
          <StatisticsChart />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <DemographicCard />
        </div>

        <div className="col-span-12 xl:col-span-7">
          <RecentOrders />
        </div>
      </div> */}
      {/* </div> */}
    </>
  );
}
