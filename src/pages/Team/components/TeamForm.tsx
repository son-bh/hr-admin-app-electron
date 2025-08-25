import { useForm } from 'react-hook-form';
import InputController from '../../../components/form/controller/InputController';
import SelectController from '../../../components/form/controller/SelectController';
import Button from '../../../components/ui/button/Button';
import { Modal } from '../../../components/ui/modal';
import {
  useCreateTeamMutation,
  useUpdateTeamMutation,
} from '../../../services';
import { ErrorForm, ToastType } from '../../../shared/constants';
import { IOptionSelect, ITeam } from '../../../types';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { toast } from '../../../components/toast';

interface ITeamFormProps {
  teamDetail?: ITeam | null;
  isOpen: boolean;
  teamOptions: Array<IOptionSelect>;
  closeModal: () => void;
  handleRefetchData: () => void;
}

type FormValues = {
  name: string;
  parentId?: IOptionSelect | null;
};

const schemaBase = yup.object().shape({
  name: yup.string().required(ErrorForm.Required),
});
const defaultValues = {
  name: '',
  parentId: null,
};
export default function TeamForm({
  teamDetail,
  isOpen,
  teamOptions,
  closeModal,
  handleRefetchData,
}: ITeamFormProps) {
  const [options, setOption] = useState<Array<IOptionSelect>>();
  const createTeamMutation = useCreateTeamMutation();
  const updateTeamMutation = useUpdateTeamMutation();
  const { control, reset, handleSubmit } = useForm<FormValues>({
    defaultValues,
    resolver: yupResolver(schemaBase),
  });

  useEffect(() => {
    if (teamDetail) {
      reset({
        name: teamDetail.name,
        parentId: teamDetail.parentId
          ? { label: teamDetail.parentId.name, value: teamDetail.parentId._id }
          : undefined,
      });
      if (teamOptions) {
        const optionSelect = teamOptions.filter(
          item => item.value != teamDetail._id
        );
        setOption(optionSelect);
      }
    } else {
      setOption(teamOptions);
      reset(defaultValues);
    }
  }, [teamDetail, teamOptions]);

  const onSubmit = (values: FormValues) => {
    const dataSubmit = {
      ...values,
      parentId: values.parentId?.value,
    };

    if (teamDetail?._id) {
      updateTeamMutation.mutate(
        { ...dataSubmit, teamId: teamDetail?._id },
        {
          onSuccess: () => {
            toast(ToastType.Success, 'Cập nhật phòng thành công');
            handleRefetchData();
            closeModal();
          },
        }
      );
      return;
    }

    createTeamMutation.mutate(dataSubmit, {
      onSuccess: () => {
        toast(ToastType.Success, 'Thêm bộ phận thành công');
        handleRefetchData();
        handleCloseModal();
      },
    });
  };

  const handleCloseModal = () => {
    reset(defaultValues);
    closeModal();
  };

  return (
    <Modal
      title={
        <h4 className='text-2xl sm:text-xl font-bold text-white'>
          {teamDetail ? 'Chỉnh sửa bộ phận' : 'Thêm bộ phận'}
        </h4>
      }
      footerContent={
        <div className='flex items-center gap-3 px-2 mt-6 justify-end'>
          <Button size='sm' variant='outline' onClick={handleCloseModal}>
            Đóng
          </Button>
          <Button
            size='sm'
            isLoading={
              createTeamMutation.isPending || updateTeamMutation.isPending
            }
            onClick={handleSubmit(onSubmit)}
          >
            Lưu
          </Button>
        </div>
      }
      isOpen={isOpen}
      onClose={handleCloseModal}
      className='max-w-[700px] m-4'
    >
      <div className='lg:p-4'>
        <form className='flex flex-col'>
          <div className='space-y-4'>
            <InputController
              control={control}
              name='name'
              label='Tên bộ phận'
              required
            />
            <SelectController
              control={control}
              name='parentId'
              label='Thuộc bộ phận'
              options={options}
              containerClassName='z-[1000]'
            />
          </div>
        </form>
      </div>
    </Modal>
  );
}
