import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import EmployeeShiftForm from './components/AllocationShift/EmployeeShiftForm';

export default function AddEmployeeShift() {
  return (
    <div>
      <div className='flex flex-wrap items-center justify-between'>
        <PageBreadcrumb pageTitle='Phân ca nhân sự' />
      </div>
      <div>
        <EmployeeShiftForm />
      </div>
    </div>
  );
}
