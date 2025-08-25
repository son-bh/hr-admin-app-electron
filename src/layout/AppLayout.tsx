import { SidebarProvider, useSidebar } from '../context/SidebarContext';
import AppHeader from './AppHeader';
import Backdrop from './Backdrop';
import AppSidebar from './AppSidebar';
import { useQueryGetMe } from '@/services';
import { useEffect } from 'react';
import useUserStore from '@/store/userStore';
import { StorageKeys } from '@/shared/constants';
import { CookiesStorage } from '@/shared/utils/cookie-storage';

const LayoutContent = ({ children }: { children?: React.ReactNode }) => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const { data } = useQueryGetMe();
  const setUserInfo = useUserStore(state => state.setUserInfo);

  useEffect(() => {
    if (data?.data) {
      CookiesStorage.setCookieData(
        StorageKeys.UserInfo,
        JSON.stringify(data?.data)
      );
      setUserInfo(data?.data);
    }
  }, [data]);

  return (
    <div className='min-h-screen xl:flex'>
      <div>
        <AppSidebar />
        <Backdrop />
      </div>
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isExpanded || isHovered
            ? 'lg:ml-[290px] lg:w-[calc(100%_-_290px)]'
            : 'lg:ml-[90px]'
        } ${isMobileOpen ? 'ml-0' : ''}`}
      >
        <AppHeader />
        <div className='p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6'>
          {children}
        </div>
      </div>
    </div>
  );
};

const AppLayout: React.FC = ({ children }: { children?: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <LayoutContent>{children}</LayoutContent>
    </SidebarProvider>
  );
};

export default AppLayout;
