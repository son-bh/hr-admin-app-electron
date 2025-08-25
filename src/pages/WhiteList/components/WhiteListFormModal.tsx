import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Button from '@/components/ui/button/Button';
import { Modal } from '@/components/ui/modal';
import { toast } from '@/components/toast';
import { ToastType } from '@/shared/constants/common';
import { ErrorForm } from '@/shared/constants/error';
import { InputController } from '@/components/form/controller';
import { useCreateWhiteListMutation } from '@/services';

interface Props {
  isOpen: boolean;
  closeModal: () => void;
  handleRefetchData: () => void;
}

type FormValues = {
  name: string;
  ip: string;
};

const defaultValues = {
  name: '',
  ip: '',
};

const schema = yup.object().shape({
  name: yup.string().required(ErrorForm.Required),
  ip: yup.string().required(ErrorForm.Required),
});

export default function WhiteListFormModal({
  isOpen,
  closeModal,
  handleRefetchData,
}: Props) {
  const createWhiteListMutation = useCreateWhiteListMutation();

  const { control, reset, handleSubmit } = useForm<FormValues>({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const onSubmit = (values: FormValues) => {
    createWhiteListMutation.mutate(
      {
        ...values,
      },
      {
        onSuccess: () => {
          toast(ToastType.Success, 'Thêm ca thành công');
          handleRefetchData();
          handleCloseModal();
        },
      }
    );
  };

  const handleCloseModal = () => {
    reset(defaultValues);
    closeModal();
  };

  return (
    <Modal
      title={
        <h4 className='text-2xl sm:text-xl font-bold text-white mb-1'>
          Tạo IP
        </h4>
      }
      footerContent={
        <div className='flex items-center w-full gap-3 lg:px-4 mt-6 justify-end'>
          <Button
            className='sm:w-1/4 w-1/2'
            size='sm'
            variant='outline'
            onClick={handleCloseModal}
          >
            Đóng
          </Button>
          <Button
            size='sm'
            className='sm:w-1/4 w-1/2'
            isLoading={createWhiteListMutation.isPending}
            onClick={handleSubmit(onSubmit)}
          >
            Tạo
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
            <InputController control={control} name='ip' label='IP' required />
            <InputController
              control={control}
              name='name'
              label='Tên'
              required
            />
          </div>
        </form>
      </div>
    </Modal>
  );
}
