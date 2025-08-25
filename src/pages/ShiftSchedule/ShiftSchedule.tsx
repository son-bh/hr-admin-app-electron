import { useNavigate } from 'react-router-dom';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import PageMeta from '@/components/common/PageMeta';
import Button from '@/components/ui/button/Button';
import { PATH_NAME } from '@/configs';
import Filter from './components/Filter';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  IOverTime,
  IQueryParams,
  ISchedule,
  IShift,
  IShiftSchedule,
  IShiftScheduleEmployee,
  PERMISSIONS,
} from '@/types';
import {
  // useExportShiftScheduleMutation,
  useQueryShiftScheduleByRange,
} from '@/services';
import {
  getCurrentWeek,
  mergeShiftScheduleEmployee,
} from '@/shared/utils/shift';
import { eachDayOfInterval, format } from 'date-fns';
import { mappingEmployeeShiftSchedule } from '@/shared/utils/mapping';
import isEmpty from 'lodash/isEmpty';
import EmployeeShiftSchedule from './components/EmployeeShift/EmployeeShiftSchedule';
import ShiftDetailModal from './components/EmployeeShift/ShiftDetailModal';
import AuthorizationWrapper from '@/components/common/AuthorizationWrapper';
// import { downloadFile } from '@/shared/utils/helpers';
// import { ToastType } from '@/shared/constants';
// import { toast } from '@/components/toast';

type ShiftScheduleQueryParams = IQueryParams & {
  startDate: string;
  endDate?: string;
  userIds?: Array<string>;
  teamIds?: Array<string>;
};

const defaultFilter = {
  startDate: format(getCurrentWeek().startDate, 'yyyy-MM-dd'),
  endDate: format(getCurrentWeek().endDate, 'yyyy-MM-dd'),
};

export default function ShiftSchedule() {
  const navigate = useNavigate();

  const [isOpenDetailModal, setIsOpenDetailModal] = useState<boolean>(false);
  const [filter, setFilter] = useState<ShiftScheduleQueryParams>(defaultFilter);
  const [shiftSchedule, setShiftSchedule] = useState<Array<IShiftSchedule>>([]);
  const [scheduleDetail, setScheduleDetail] = useState<
    (ISchedule & { employee: IShiftScheduleEmployee }) | null
  >(null);

  const { data: shiftScheduleData } = useQueryShiftScheduleByRange(filter);
  // const exportMutation = useExportShiftScheduleMutation();

  const dateRange = useMemo(() => {
    if (filter.startDate && filter.endDate) {
      return eachDayOfInterval({
        start: filter.startDate,
        end: filter.endDate,
      });
    }

    return [];
  }, [filter.startDate, filter.endDate]);

  useEffect(() => {
    const schedules = shiftScheduleData?.data;

    if (schedules) {
      const employeeShiftSchedule = [...schedules].map(item => {
        const schedulesEmploy = mergeShiftScheduleEmployee(
          item.schedules || []
        );

        const schedulesInRage = mappingEmployeeShiftSchedule(
          schedulesEmploy,
          dateRange
        );

        return {
          employee: item.employee,
          schedules: schedulesInRage,
        };
      });

      setShiftSchedule(employeeShiftSchedule);
    }
  }, [shiftScheduleData?.data, dateRange]);

  const handleFilterChange = useCallback(
    (newFilter: ShiftScheduleQueryParams) => {
      setFilter(newFilter);
    },
    []
  );

  const handleEditShift = useCallback(
    (scheduleDetail: ISchedule & { employee: IShiftScheduleEmployee }) => {
      setScheduleDetail(scheduleDetail);
      setIsOpenDetailModal(true);
    },
    []
  );

  const handleDeleteSuccess = (
    shiftData: IShift,
    shiftDate: string,
    username: string
  ) => {
    const newShiftSchedule = shiftSchedule.map(item => ({
      ...item,
      schedules: item.schedules.map(scheduleItem => {
        if (
          scheduleItem.date === shiftDate &&
          item.employee.username === username
        ) {
          return {
            ...scheduleItem,
            shift: scheduleItem.shift.filter(s => s._id !== shiftData._id),
          };
        }
        return scheduleItem;
      }),
    }));

    setShiftSchedule(newShiftSchedule);
    setScheduleDetail(
      prev =>
        ({
          ...prev,
          shift: prev?.shift.filter(item => item._id !== shiftData?._id),
        }) as ISchedule & { employee: IShiftScheduleEmployee }
    );
  };

  const handleUpdateSuccess = (
    shiftData: IShift,
    shiftDate: string,
    username: string
  ) => {
    const newShiftSchedule = shiftSchedule.map(item => ({
      ...item,
      schedules: item.schedules.map(scheduleItem => {
        if (
          scheduleItem.date === shiftDate &&
          item.employee.username === username
        ) {
          return {
            ...scheduleItem,
            shift: [...(scheduleItem.shift ?? []), shiftData],
          };
        }
        return scheduleItem;
      }),
    }));

    setShiftSchedule(newShiftSchedule);
    setScheduleDetail(
      prev =>
        ({
          ...prev,
          shift: [...(prev?.shift ?? []), shiftData],
        }) as ISchedule & { employee: IShiftScheduleEmployee }
    );
  };

  const handleSetOverTimeSuccess = (
    overTimeDetail: IOverTime,
    shiftDate: string,
    username: string
  ) => {
    const newShiftSchedule = shiftSchedule.map(item => ({
      ...item,
      schedules: item.schedules.map(scheduleItem => {
        if (
          scheduleItem.date === shiftDate &&
          item.employee.username === username
        ) {
          return {
            ...scheduleItem,
            ...overTimeDetail,
          };
        }
        return scheduleItem;
      }),
    }));

    setShiftSchedule(newShiftSchedule);
    setScheduleDetail(
      prev =>
        ({
          ...prev,
          ...overTimeDetail,
        }) as ISchedule & { employee: IShiftScheduleEmployee }
    );
  };

  // const handleExportShiftSchedule = async () => {
  //   exportMutation.mutate(undefined, {
  //     onSuccess: response => {
  //       downloadFile(response, 'lich-lam-viec-nhan');
  //       toast(ToastType.Success, 'Tải lịch làm việc nhân viên thành công');
  //     },
  //   });
  // };

  return (
    <>
      <PageMeta
        title='Lịch làm việc nhân viên'
        description='Lịch làm việc nhân viên'
      />
      <div>
        <div className='flex flex-wrap items-center justify-between'>
          <PageBreadcrumb pageTitle='Lịch làm việc nhân viên' />
          <div className='flex items-center gap-3'>
            {/* <Button onClick={handleExportShiftSchedule}>Xuất dữ liệu</Button> */}
            <AuthorizationWrapper allowedRoles={PERMISSIONS.CREATE_SCHEDULE}>
              <Button
                onClick={() => {
                  navigate(PATH_NAME.ADD_EMPLOYEE_SHIFT_SCHEDULE);
                }}
              >
                Phân ca
              </Button>
            </AuthorizationWrapper>
          </div>
        </div>
        <Filter handleFilterChange={handleFilterChange} />
        {!isEmpty(shiftSchedule) ? (
          <EmployeeShiftSchedule
            dateRange={dateRange}
            employeeShiftSchedule={shiftSchedule}
            isShowTime
            handleEditShift={handleEditShift}
          />
        ) : (
          <div className='flex items-center justify-center min-h-[200px] bg-white rounded-md'>
            Chưa có lịch làm việc của nhân viên
          </div>
        )}
      </div>
      {isOpenDetailModal && (
        <ShiftDetailModal
          scheduleDetail={scheduleDetail}
          isOpen={isOpenDetailModal}
          closeModal={() => {
            setIsOpenDetailModal(false);
          }}
          handleDeleteSuccess={handleDeleteSuccess}
          handleUpdateSuccess={handleUpdateSuccess}
          handleSetOverTimeSuccess={handleSetOverTimeSuccess}
        />
      )}
    </>
  );
}
