import Button from '@/components/ui/button/Button';
import { Modal } from '@/components/ui/modal';

interface INoteModelProps {
  isOpen: boolean;
  note?: string;
  closeModal: () => void;
}

export default function NoteModel({
  isOpen,
  note,
  closeModal,
}: INoteModelProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      className='max-w-[700px] m-4'
      isBackdropClose={false}
    >
      <div className='relative w-full p-4 bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11'>
        <div className='pr-14 mb-4'>
          <h4 className='text-2xl font-semibold text-gray-800 dark:text-white/90'>
            {'Ghi chú'}
          </h4>
        </div>
        <div className='flex flex-row gap-2'>
          <div className='w-[100px]'>Ghi chú:</div>
          <div>{note}</div>
        </div>
        <div className='flex items-center gap-3 px-2 mt-6 justify-end'>
          <Button size='sm' variant='outline' onClick={closeModal}>
            Đóng
          </Button>
        </div>
      </div>
    </Modal>
  );
}
