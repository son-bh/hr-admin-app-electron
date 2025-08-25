import { useForm } from 'react-hook-form';
import Button from '../../../components/ui/button/Button';
import { Modal } from '../../../components/ui/modal';
import { useGetUsersMutation } from '../../../services';
import { ErrorForm, ModalType, ToastType } from '../../../shared/constants';
import { IOptionSelect } from '../../../types';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from '../../../components/toast';
import {
  mappingOptionEmployeeBenefit,
  // mappingOptionSelect,
} from '@/shared/utils/mapping';
import { useCreateEmployeeBenefitMutation } from '@/services/employeeBenefit';
import {
  AsyncSelectController,
  CheckboxController,
} from '@/components/form/controller';
import { useEffect, useState } from 'react';
import { GroupBase, OptionsOrGroups } from 'react-select';
import { debounce, isEmpty } from 'lodash';

interface IEmployeeBenefitFormProps {
  isOpen: boolean;
  closeModal: () => void;
  handleRefetchData: () => void;
  handleEditAfterCreate: (employeeId: string, modalType: string) => void;
}

const schemaBase = yup.object().shape({
  isAll: yup.boolean().default(false),
  employeeIds: yup
    .mixed<Array<IOptionSelect>>()
    .nullable()
    .when('isAll', {
      is: false,
      then: s => s.required(ErrorForm.Required),
      otherwise: s => s.notRequired(),
    }),
});
type FormValues = yup.InferType<typeof schemaBase>;
const defaultValues = {
  employeeIds: undefined,
  isAll: false,
  // templateId: undefined,
};
const DefaultFilter = { pageIndex: 0, pageSize: 10 };
export default function CreateEmployBenefit({
  isOpen,
  closeModal,
  handleRefetchData,
  handleEditAfterCreate,
}: IEmployeeBenefitFormProps) {
  const [employeeOptions, setEmployeeOptions] = useState<Array<IOptionSelect>>(
    []
  );
  const [selectedEmployee, setSelectedEmployee] = useState<
    Array<IOptionSelect>
  >([]);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [totalPage, setTotalPage] = useState<number>(0);
  // const { data: userDataBenefit } = useQueryGetBenefit();
  const getEmployeeMutation = useGetUsersMutation();
  const createEmployeeBenefitMutation = useCreateEmployeeBenefitMutation();
  const { control, reset, handleSubmit, watch } = useForm<FormValues>({
    defaultValues,
    resolver: yupResolver(schemaBase as yup.ObjectSchema<FormValues>),
  });
  const watchIsAll = watch('isAll');
  const handleGetInitialEmployee = () => {
    getEmployeeMutation.mutate(DefaultFilter, {
      onSuccess: data => {
        setEmployeeOptions(
          mappingOptionEmployeeBenefit(data?.data, 'username') || []
        );
        setPageIndex(data?.pagination?.page);
        setTotalPage(data?.pagination?.totalPage);
      },
      onError: () => {
        setEmployeeOptions([]);
      },
    });
  };

  const loadOptions = async (
    inputValue: string
  ): Promise<OptionsOrGroups<IOptionSelect, GroupBase<IOptionSelect>>> => {
    return new Promise(resolve => {
      onInputChange(inputValue, resolve);
    });
  };

  const onInputChange = debounce(async (inputValue, callback) => {
    getEmployeeMutation.mutateAsync(
      { ...DefaultFilter, searchKeyword: inputValue },
      {
        onSuccess: data => {
          const employees =
            mappingOptionEmployeeBenefit(data?.data || [], 'username') || [];

          setEmployeeOptions(employees);
          callback(employees);
        },
        onError: () => {
          setEmployeeOptions([]);
          callback([]);
        },
      }
    );
  }, 300);

  const handleSelectedEmployee = (value: Array<IOptionSelect>) => {
    if (isEmpty(value)) {
      setSelectedEmployee([]);
      return;
    }

    if (selectedEmployee.length > value.length) {
      setSelectedEmployee(value);
      return;
    }

    setSelectedEmployee(value);
  };

  useEffect(() => {
    handleGetInitialEmployee();
  }, []);

  const onSubmit = (values: FormValues) => {
    const dataSubmit = {
      employeeIds: values.isAll
        ? undefined
        : values.employeeIds?.map(item => item.value),
    };
    createEmployeeBenefitMutation.mutate(dataSubmit, {
      onSuccess: e => {
        toast(ToastType.Success, 'Thêm chế độ lương cho nhân viên thành công');
        handleCloseModal();
        if (dataSubmit.employeeIds?.length === 1 && e.successCount === 1) {
          handleEditAfterCreate(dataSubmit.employeeIds[0], ModalType.Block);
        } else {
          handleRefetchData();
        }
      },
    });
  };
  const handleInfiniteScroll = () => {
    getEmployeeMutation.mutate(
      { pageIndex: pageIndex, pageSize: DefaultFilter.pageSize },
      {
        onSuccess: data => {
          const nextOption =
            mappingOptionEmployeeBenefit(data?.data, 'username') || [];
          setEmployeeOptions([...employeeOptions, ...nextOption]);
          setPageIndex(data?.pagination?.page);
        },
        onError: () => {
          setEmployeeOptions([]);
        },
      }
    );
  };
  const onMenuScrollToBottom = () => {
    if (pageIndex < totalPage) {
      handleInfiniteScroll();
    }
  };

  const handleCloseModal = () => {
    reset(defaultValues);
    closeModal();
  };

  return (
    <Modal
      title={
        <h4 className='text-2xl sm:text-xl font-bold text-white'>
          Tạo lương cho nhân viên
        </h4>
      }
      footerContent={
        <div className='flex items-center gap-3 px-2 mt-6 justify-end'>
          <Button size='sm' variant='outline' onClick={handleCloseModal}>
            Đóng
          </Button>
          <Button
            size='sm'
            isLoading={createEmployeeBenefitMutation.isPending}
            onClick={handleSubmit(onSubmit)}
          >
            Lưu
          </Button>
        </div>
      }
      isOpen={isOpen}
      onClose={closeModal}
      className='max-w-[700px] m-4'
      isScroll={false}
    >
      <div className='lg:p-4'>
        <form className='flex flex-col'>
          <div className='space-y-4'>
            {!watchIsAll && (
              <AsyncSelectController
                name='employeeIds'
                control={control}
                label='Nhân sự'
                loadOptions={loadOptions}
                isMulti={true}
                placeholder='Chọn nhân sự'
                options={employeeOptions}
                onMenuScrollToBottom={onMenuScrollToBottom}
                required
                onChange={handleSelectedEmployee}
              />
            )}
            <CheckboxController
              control={control}
              name='isAll'
              label='Tất cả nhân viên'
            />
          </div>
        </form>
      </div>
    </Modal>
  );
}
