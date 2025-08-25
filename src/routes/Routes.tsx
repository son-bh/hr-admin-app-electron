import { Fragment, lazy, Suspense } from 'react';
import { Routes as Routers, Route } from 'react-router-dom';

import AuthGuard from '@/guards/AuthGuard';
import AppLayout from '@/layout/AppLayout';
import AuthLayout from '@/layout/AuthLayout';
import GuestGuard from '@/guards/GuestGuard';
import { IRoutes, PERMISSIONS } from '@/types';
import { PATH_NAME } from '@/configs';
import RoleRoute from './RoleRoute';

const Home = lazy(() => import('@/pages/Dashboard/Home'));
const UserProfile = lazy(() => import('@/pages/User/UserProfile'));
const UserList = lazy(() => import('@/pages/User/UserList'));
const SignIn = lazy(() => import('@/pages/AuthPages/SignIn'));
const ShiftList = lazy(() => import('@/pages/Shift/ShiftList'));
const TeamList = lazy(() => import('@/pages/Team/TeamList'));
const BenefitList = lazy(() => import('@/pages/Benefit/BenefitList'));
const EmployeeBenefit = lazy(
  () => import('@/pages/EmployeeBenefit/EmployeeBenefit')
);
const DevicesManager = lazy(() => import('@/pages/Devices/DevicesManager'));
const WhiteList = lazy(() => import('@/pages/WhiteList/WhiteList'));
const ShiftSchedule = lazy(() => import('@/pages/ShiftSchedule/ShiftSchedule'));
const RequestOff = lazy(() => import('@/pages/RequestOff/RequestOff'));
const AddEmployeeShift = lazy(
  () => import('@/pages/ShiftSchedule/AddEmployeeShift')
);
const Policy = lazy(() => import('@/pages/Policy/Policy'));
const Salary = lazy(() => import('@/pages/Salary/Salary'));
const RequestOut = lazy(() => import('@/pages/RequestOut/RequestOut'));
const SystemLogs = lazy(() => import('@/pages/SystemLogs/SystemLogs'));
const Holiday = lazy(() => import('@/pages/Holiday/Holiday'));

const routesConfig: IRoutes[] = [
  {
    path: PATH_NAME.HOME,
    guard: AuthGuard,
    layout: AppLayout,
    element: Home,
  },
  {
    path: PATH_NAME.ADMIN,
    guard: AuthGuard,
    layout: AppLayout,
    element: UserList,
    requireRoles: PERMISSIONS.VIEW_LIST_EMPLOYEE,
  },
  {
    path: PATH_NAME.TEAM,
    guard: AuthGuard,
    layout: AppLayout,
    element: TeamList,
    requireRoles: PERMISSIONS.VIEW_LIST_TEAM,
  },
  {
    path: PATH_NAME.BENEFIT,
    guard: AuthGuard,
    layout: AppLayout,
    element: BenefitList,
    requireRoles: PERMISSIONS.VIEW_LIST_EMPLOYEE,
  },
  {
    path: PATH_NAME.EMPLOYEE_BENEFIT,
    guard: AuthGuard,
    layout: AppLayout,
    element: EmployeeBenefit,
    requireRoles: PERMISSIONS.VIEW_LIST_EMPLOYEE,
  },
  {
    path: PATH_NAME.PROFILE,
    guard: AuthGuard,
    layout: AppLayout,
    element: UserProfile,
  },
  {
    path: PATH_NAME.SHIFT,
    guard: AuthGuard,
    layout: AppLayout,
    element: ShiftList,
    requireRoles: PERMISSIONS.VIEW_LIST_SHIFF,
  },
  {
    path: PATH_NAME.REQUEST_OFF,
    guard: AuthGuard,
    layout: AppLayout,
    element: RequestOff,
    requireRoles: PERMISSIONS.WIEW_REQUESTS,
  },
  {
    path: PATH_NAME.REQUEST_OUT,
    guard: AuthGuard,
    layout: AppLayout,
    element: RequestOut,
    requireRoles: PERMISSIONS.MANAGE_OUT_EARLY_LATE,
  },
  {
    path: PATH_NAME.WHITELIST,
    guard: AuthGuard,
    layout: AppLayout,
    element: WhiteList,
    requireRoles: PERMISSIONS.VIEW_IPS,
  },
  {
    path: PATH_NAME.EMPLOYEE_SHIFT_SCHEDULE,
    guard: AuthGuard,
    layout: AppLayout,
    element: ShiftSchedule,
    requireRoles: PERMISSIONS.VIEW_HISTORY_EMPLOYEE,
  },
  {
    path: PATH_NAME.ADD_EMPLOYEE_SHIFT_SCHEDULE,
    guard: AuthGuard,
    layout: AppLayout,
    element: AddEmployeeShift,
  },
  {
    path: PATH_NAME.LOGIN,
    guard: GuestGuard,
    layout: AuthLayout,
    element: SignIn,
  },
  {
    path: PATH_NAME.DEVICES,
    guard: AuthGuard,
    layout: AppLayout,
    element: DevicesManager,
    requireRoles: PERMISSIONS.VIEW_EMPLOYEE_MATERIAL,
  },
  {
    path: PATH_NAME.POLICY,
    guard: AuthGuard,
    layout: AppLayout,
    element: Policy,
    requireRoles: PERMISSIONS.VIEW_BENEFIT,
  },
  {
    path: PATH_NAME.SALARY,
    guard: AuthGuard,
    layout: AppLayout,
    element: Salary,
    requireRoles: PERMISSIONS.VIEW_BENEFIT,
  },
  {
    path: PATH_NAME.ADMIN_LOGS,
    guard: AuthGuard,
    layout: AppLayout,
    element: SystemLogs,
  },
  {
    path: PATH_NAME.HOLIDAY,
    guard: AuthGuard,
    layout: AppLayout,
    element: Holiday,
  },
];

const renderRoutes = (routes: IRoutes[]) => {
  return (
    <>
      {routes ? (
        <Suspense fallback={<div />}>
          <Routers>
            {routes.map((route: IRoutes, idx: number) => {
              const Guard = route.guard || Fragment;
              const Layout = route.layout || Fragment;
              const Component = route.element;
              const requireRoles = route.requireRoles;

              return (
                <Route
                  key={`routes-${idx}`}
                  path={route.path}
                  element={
                    <Guard>
                      <Layout>
                        <RoleRoute requireRoles={requireRoles}>
                          <Component />
                        </RoleRoute>
                      </Layout>
                    </Guard>
                  }
                >
                  {route.routes ? renderRoutes(route.routes) : null}
                </Route>
              );
            })}
          </Routers>
        </Suspense>
      ) : null}
    </>
  );
};

const Routes = () => renderRoutes(routesConfig);

export default Routes;
