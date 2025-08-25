import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MdOutlineDevices, MdSystemSecurityUpdate } from 'react-icons/md';

// Assume these icons are imported from an icon library
import { ChevronDownIcon, GridIcon, CalenderIcon } from '../icons';
import { FaRegClock } from 'react-icons/fa';
import { useSidebar } from '../context/SidebarContext';
import { PATH_NAME } from '../configs';
import { MdBusinessCenter } from 'react-icons/md';
// import { FaList } from 'react-icons/fa6';
import { AiOutlineDollar, AiOutlineFileText } from 'react-icons/ai';
import { useRole } from '@/hooks/useRole';
import { PERMISSIONS } from '@/types';
import useUserStore from '@/store/userStore';

type NavItem = {
  name: string;
  icon: React.ReactNode;
  roles?: Array<string>;
  path?: string;
  subItems?: {
    name: string;
    path: string;
    pro?: boolean;
    new?: boolean;
    roles?: Array<string>;
  }[];
};

const navItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: 'Tổng quan',
    path: PATH_NAME.HOME,
  },
  {
    icon: <MdBusinessCenter />,
    name: 'Nhân sự & Bộ phận',
    path: PATH_NAME.TEAM,
    // roles: [PERMISSIONS.VIEW_LIST_TEAM],
    subItems: [
      {
        name: 'Quản lý bộ phận',
        path: PATH_NAME.TEAM,
        roles: [PERMISSIONS.VIEW_LIST_TEAM],
      },
      {
        name: 'Quản lý nhân sự',
        path: PATH_NAME.ADMIN,
        roles: [PERMISSIONS.VIEW_LIST_EMPLOYEE],
      },
    ],
  },
  {
    icon: <FaRegClock />,
    name: 'Quản lý ca',
    path: PATH_NAME.SHIFT,
    roles: [PERMISSIONS.VIEW_LIST_SHIFF],
    subItems: [
      {
        // icon: <FaRegClock />,
        name: 'Quản lý ca',
        path: PATH_NAME.SHIFT,
        roles: [PERMISSIONS.VIEW_LIST_SHIFF],
      },
      {
        // icon: <FaRegClock />,
        name: 'Quản lý nghỉ phép',
        path: PATH_NAME.REQUEST_OFF,
        roles: [PERMISSIONS.VIEW_BENEFIT],
      },
      {
        // icon: <TbClockX />,
        name: 'Quản lý xin về sớm, vào trễ',
        path: PATH_NAME.REQUEST_OUT,
        roles: [PERMISSIONS.MANAGE_OUT_EARLY_LATE],
      },
    ],
  },
  {
    icon: <CalenderIcon />,
    name: 'Lịch làm việc nhân viên',
    path: PATH_NAME.EMPLOYEE_SHIFT_SCHEDULE,
    roles: [PERMISSIONS.VIEW_SCHEDULES],
  },
  {
    icon: <AiOutlineFileText />,
    name: 'Chính sách',
    path: PATH_NAME.POLICY,
    // roles: [PERMISSIONS.VIEW_EMPLOYEE_BENEFIT],
    subItems: [
      {
        // icon: <AiOutlineFileText />,
        name: 'Chính sách công ty',
        path: PATH_NAME.POLICY,
        roles: [PERMISSIONS.VIEW_BENEFIT],
      },
      {
        // icon: <MdPolicy />,
        name: 'Quản lý lương & phép',
        path: PATH_NAME.BENEFIT,
        roles: [PERMISSIONS.VIEW_EMPLOYEE_BENEFIT],
      },
      {
        // icon: <MdPolicy />,
        name: 'Quản lý nghỉ lễ',
        path: PATH_NAME.HOLIDAY,
        roles: [PERMISSIONS.HOLIDAY],
      },
    ],
  },
  {
    icon: <AiOutlineDollar />,
    name: 'Lương nhân viên',
    path: PATH_NAME.SALARY,
    // roles: [PERMISSIONS.VIEW_EMPLOYEE_BENEFIT],
    subItems: [
      {
        // icon: <MdPayment />,
        name: 'Cài đặt lương',
        path: PATH_NAME.EMPLOYEE_BENEFIT,
        roles: [PERMISSIONS.CREATE_EMPLOYEE_BENEFIT],
      },
      {
        name: 'Tính lương',
        path: PATH_NAME.SALARY,
        roles: [PERMISSIONS.VIEW_EMPLOYEE_BENEFIT],
      },
    ],
  },

  {
    icon: <MdOutlineDevices />,
    name: 'Quản lý thiết bị',
    path: PATH_NAME.DEVICES,
    // roles: [PERMISSIONS.VIEW_EMPLOYEE_MATERIAL],
    subItems: [
      {
        name: 'Quản lý thiết bị',
        path: PATH_NAME.DEVICES,
        roles: [PERMISSIONS.VIEW_EMPLOYEE_MATERIAL],
      },
      {
        // icon: <FaList />,
        name: 'Quản lý IP',
        path: PATH_NAME.WHITELIST,
        roles: [PERMISSIONS.VIEW_IPS],
      },
    ],
  },
  {
    icon: <MdSystemSecurityUpdate />,
    name: 'Quản lý hoạt động',
    path: PATH_NAME.ADMIN_LOGS,
    roles: [PERMISSIONS.VIEW_SYSTEM_LOGS],
  },
];

const othersItems: NavItem[] = [];

const AppSidebar: React.FC = () => {
  const {
    isExpanded,
    isMobileOpen,
    isHovered,
    setIsHovered,
    toggleMobileSidebar,
  } = useSidebar();
  const location = useLocation();
  const { userHasAtLeastAllowedRoles } = useRole();
  const userInfo = useUserStore(state => state.userInfo);
  const authorizationChildren =
    userInfo?.role === 'SUPER_ADMIN'
      ? navItems
      : (navItems
          .map(item => {
            const canSeeParent =
              !item.roles ||
              userHasAtLeastAllowedRoles(item.roles as PERMISSIONS[]);

            if (item.subItems && item.subItems.length > 0) {
              const filteredSubItems = item.subItems.filter(
                sub =>
                  !sub.roles ||
                  userHasAtLeastAllowedRoles(sub.roles as PERMISSIONS[])
              );

              if (filteredSubItems.length === 0) return null;

              return {
                ...item,
                subItems: filteredSubItems,
              };
            }

            if (!item.subItems && !canSeeParent) {
              return null;
            }

            return item;
          })
          .filter(Boolean) as NavItem[]);

  // const authorizationChildren = navItems?.filter(child => !child.roles || userHasAtLeastAllowedRoles(child.roles as PERMISSIONS[]));

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: 'main' | 'others';
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // const isActive = (path: string) => location.pathname === path;
  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  useEffect(() => {
    let submenuMatched = false;
    ['main', 'others'].forEach(menuType => {
      const items = menuType === 'main' ? authorizationChildren : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach(subItem => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as 'main' | 'others',
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [location, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight(prevHeights => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: 'main' | 'others') => {
    setOpenSubmenu(prevOpenSubmenu => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  const renderMenuItems = (items: NavItem[], menuType: 'main' | 'others') => (
    <ul className='flex flex-col gap-4'>
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? 'menu-item-active'
                  : 'menu-item-inactive'
              } cursor-pointer ${
                !isExpanded && !isHovered
                  ? 'lg:justify-center'
                  : 'lg:justify-start'
              }`}
            >
              <span
                className={`menu-item-icon-size  ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? 'menu-item-icon-active'
                    : 'menu-item-icon-inactive'
                }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className='menu-item-text'>{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? 'rotate-180 text-brand-500'
                      : ''
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                to={nav.path}
                className={`menu-item group ${
                  isActive(nav.path) ? 'menu-item-active' : 'menu-item-inactive'
                }`}
                onClick={() => {
                  if (isMobileOpen) {
                    toggleMobileSidebar();
                  }
                }}
              >
                <span
                  className={`menu-item-icon-size ${
                    isActive(nav.path)
                      ? 'menu-item-icon-active'
                      : 'menu-item-icon-inactive'
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className='menu-item-text'>{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={el => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className='overflow-hidden transition-all duration-300'
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : '0px',
              }}
            >
              <ul className='mt-2 space-y-1 ml-9'>
                {nav.subItems.map(subItem => (
                  <li key={subItem.name}>
                    <Link
                      to={subItem.path}
                      className={`menu-dropdown-item ${
                        isActive(subItem.path)
                          ? 'menu-dropdown-item-active'
                          : 'menu-dropdown-item-inactive'
                      }`}
                      onClick={() => {
                        if (isMobileOpen) {
                          toggleMobileSidebar();
                        }
                      }}
                    >
                      {subItem.name}
                      <span className='flex items-center gap-1 ml-auto'>
                        {subItem.new && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? 'menu-dropdown-badge-active'
                                : 'menu-dropdown-badge-inactive'
                            } menu-dropdown-badge`}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? 'menu-dropdown-badge-active'
                                : 'menu-dropdown-badge-inactive'
                            } menu-dropdown-badge`}
                          >
                            pro
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed pt-16 flex flex-col lg:pt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? 'w-[290px]'
            : isHovered
              ? 'w-[290px]'
              : 'w-[90px]'
        }
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex ${
          !isExpanded && !isHovered ? 'lg:justify-center' : 'justify-start'
        }`}
      >
        <Link to='/'>
          {isExpanded || isHovered || isMobileOpen ? (
            <div className='font-bold text-xl'>
              {/* <img
                className="dark:hidden"
                src="/images/logo/logo.svg"
                alt="Logo"
                width={150}
                height={40}
              />
              <img
                className="hidden dark:block"
                src="/images/logo/logo-dark.svg"
                alt="Logo"
                width={150}
                height={40}
              /> */}
              Quản lý nhân sự
            </div>
          ) : (
            <img
              src='/images/logo/logo-icon.svg'
              alt='Logo'
              width={32}
              height={32}
            />
          )}
        </Link>
      </div>
      <div className='flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar'>
        <nav className='mb-6'>
          <div className='flex flex-col gap-4'>
            <div>
              {/* <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu"
                ) : (
                  <HorizontaLDots className="size-6" />
                )}
              </h2> */}
              {renderMenuItems(authorizationChildren, 'main')}
            </div>
            {/* <div className="">
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Others"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(othersItems, "others")}
            </div> */}
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
