import { DevicesOptions, ToastType } from '@/shared/constants/common';
import { toast } from '@/components/toast';
import { Material } from '@/types/IDevices';
import * as yup from 'yup';
import {
  useAssignMaterialsMutation,
  useUpdateMaterialsMutation,
} from '@/services/devices';
import { Modal } from '@/components/ui/modal';
import {
  InputController,
  SelectController,
} from '@/components/form/controller';
import Button from '@/components/ui/button/Button';
import { IOptionSelect } from '@/types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ErrorForm } from '@/shared/constants';
import { useEffect } from 'react';
import { useQueryGetUsers } from '@/services';
import { IDevices } from '@/types/IDevices';

interface IAddModalProps {
  materialData?: Material;
  isOpen: boolean;
  closeModal: () => void;
  handleRefetchData: () => void;
  setMaterial?: React.Dispatch<React.SetStateAction<IDevices>>;
}

type FormValues = {
  employeeId: IOptionSelect | null | undefined;
  code: string;
  note: string;
  device: IOptionSelect;
};

const defaultValues = {
  code: '',
  device: undefined,
  note: '',
  employeeId: undefined,
};

const schemaBase = (isEditMode: boolean) =>
  yup.object().shape({
    code: yup.string().required(ErrorForm.Required),
    device: yup.mixed<IOptionSelect>().nullable().required(ErrorForm.Required),
    note: yup.string().required(ErrorForm.Required),
    employeeId: isEditMode
      ? yup.mixed<IOptionSelect>().nullable()
      : yup.mixed<IOptionSelect>().nullable().required(ErrorForm.Required),
  });

export default function AddDevicesModal({
  materialData,
  isOpen,
  closeModal,
  handleRefetchData,
  setMaterial,
}: IAddModalProps) {
  const isEditMode = !!materialData?._id;
  const schema = schemaBase(isEditMode);
  const addDeviceMutation = useAssignMaterialsMutation();
  const updateDevicesMutation = useUpdateMaterialsMutation();

  const { control, reset, handleSubmit } = useForm<FormValues>({
    defaultValues,
    resolver: yupResolver(schema) as any,
  });
  const { data: userData } = useQueryGetUsers();
  const userOptions: IOptionSelect[] =
    userData?.data.map(item => ({
      label: item.username,
      value: item._id,
    })) || [];

  useEffect(() => {
    if (isEditMode && materialData) {
      reset({
        code: materialData.code || '',
        note: materialData.note || '',
        device:
          DevicesOptions.find(option => option.value === materialData.device) ||
          undefined,
        employeeId: undefined,
      });
    } else {
      reset(defaultValues);
    }
  }, [materialData, reset, isEditMode]);

  const onSubmit = (data: FormValues) => {
    const payload = {
      code: data.code,
      note: data.note,
      device: data.device?.value,
    };

    if (isEditMode) {
      if (!materialData?._id) {
        toast(ToastType.Error, 'Không tìm thấy ID thiết bị để cập nhật');
        return;
      }
      updateDevicesMutation.mutate(
        { materialId: materialData._id, ...payload },
        {
          onSuccess: () => {
            toast(ToastType.Success, 'Cập nhật thiết bị thành công');
            if (setMaterial) {
              setMaterial(prev => ({
                ...prev,
                materials: prev.materials.map(item =>
                  item._id === materialData._id
                    ? {
                        ...item,
                        code: data.code,
                        note: data.note,
                        device: data.device?.value,
                      }
                    : item
                ),
              }));
            }
            handleRefetchData();
            closeModal();
          },
          onError: (error: any) => {
            toast(
              ToastType.Error,
              error.message || 'Cập nhật thiết bị thất bại'
            );
          },
        }
      );
    } else {
      if (!data.employeeId?.value) {
        toast(ToastType.Error, 'Vui lòng chọn nhân viên');
        return;
      }
      addDeviceMutation.mutate(
        {
          employeeId: data.employeeId.value,
          ...payload,
        },
        {
          onSuccess: () => {
            toast(ToastType.Success, 'Thêm thiết bị thành công');
            handleRefetchData();
            closeModal();
          },
          onError: (error: any) => {
            toast(ToastType.Error, error.message || 'Thêm thiết bị thất bại');
          },
        }
      );
    }
  };

  return (
    <Modal
      title={
        <h4 className='text-2xl sm:text-xl font-bold text-white'>
          {materialData?._id ? 'Chỉnh sửa' : 'Bàn giao'} thiết bị
        </h4>
      }
      footerContent={
        <div className='flex items-center gap-3 px-2 mt-6 justify-end'>
          <Button size='sm' variant='outline' onClick={closeModal}>
            Đóng
          </Button>
          <Button
            size='sm'
            isLoading={
              addDeviceMutation.isPending || updateDevicesMutation.isPending
            }
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
      <div className='relative w-full p-4 bg-white no-scrollbar rounded-3xl dark:bg-gray-900'>
        <form className='flex flex-col mt-5'>
          <div className='space-y-4'>
            {!materialData?._id && (
              <SelectController
                control={control}
                name='employeeId'
                label='Nhân viên'
                options={userOptions}
                required
                containerClassName='z-[1000]'
              />
            )}
            <InputController
              control={control}
              name='code'
              label='Code'
              required
            />
            <SelectController
              control={control}
              name='device'
              label='Thiết bị'
              options={DevicesOptions}
              required
              containerClassName='z-[1000]'
            />
            <InputController
              control={control}
              name='note'
              label='Ghi chú'
              required
            />
          </div>
        </form>
      </div>
    </Modal>
  );
}
