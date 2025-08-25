import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
  isFullscreen?: boolean;
  isBackdropClose?: boolean;
  title?: React.ReactNode;
  footerContent?: React.ReactNode;
  isScroll?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  className,
  showCloseButton = true,
  isFullscreen = false,
  isBackdropClose = true,
  title,
  footerContent,
  isScroll = true,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const contentClasses = isFullscreen
    ? 'w-full h-full'
    : 'relative w-full rounded-2xl bg-white dark:bg-gray-900';

  return (
    <AnimatePresence mode='wait'>
      {isOpen && (
        <motion.div
          className='fixed inset-0 flex items-center justify-center overflow-y-auto modal z-[998]'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {!isFullscreen && (
            <motion.div
              className='fixed inset-0 h-full w-full bg-gray-400/50 z-[997]'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (isBackdropClose) {
                  onClose();
                }
              }}
            />
          )}

          <motion.div
            ref={modalRef}
            className={`${contentClasses} ${className} z-[998]`}
            initial={
              isFullscreen
                ? { opacity: 0, scale: 0.95 }
                : { opacity: 0, y: 100, scale: 0.9 }
            }
            animate={
              isFullscreen
                ? { opacity: 1, scale: 1 }
                : { opacity: 1, y: 0, scale: 1 }
            }
            exit={
              isFullscreen
                ? { opacity: 0, scale: 0.95 }
                : { opacity: 0, y: 100, scale: 0.9 }
            }
            transition={{
              type: 'spring',
              damping: 25,
              stiffness: 400,
              duration: 0.3,
            }}
            onClick={e => e.stopPropagation()}
          >
            {showCloseButton && (
              <button
                onClick={onClose}
                className='absolute right-3 top-4 z-[997] flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white sm:right-6 sm:top-4 sm:h-11 sm:w-11'
              >
                <svg
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    fillRule='evenodd'
                    clipRule='evenodd'
                    d='M6.04289 16.5413C5.65237 16.9318 5.65237 17.565 6.04289 17.9555C6.43342 18.346 7.06658 18.346 7.45711 17.9555L11.9987 13.4139L16.5408 17.956C16.9313 18.3466 17.5645 18.3466 17.955 17.956C18.3455 17.5655 18.3455 16.9323 17.955 16.5418L13.4129 11.9997L17.955 7.4576C18.3455 7.06707 18.3455 6.43391 17.955 6.04338C17.5645 5.65286 16.9313 5.65286 16.5408 6.04338L11.9987 10.5855L7.45711 6.0439C7.06658 5.65338 6.43342 5.65338 6.04289 6.0439C5.65237 6.43442 5.65237 7.06759 6.04289 7.45811L10.5845 11.9997L6.04289 16.5413Z'
                    fill='currentColor'
                  />
                </svg>
              </button>
            )}
            <div className='relative w-full dark:bg-gray-900 rounded-2xl shadow-2xl '>
              {title && (
                <div className='bg-blue-500 p-4 sm:p-6 rounded-t-2xl'>
                  {title}
                </div>
              )}

              <div className='p-4'>
                <div
                  className={`sm:max-h-[75vh] max-h-[75dvh] ${isScroll ? 'overflow-y-auto' : 'overflow-y-visible'}  custom-scrollbar`}
                >
                  {children}
                </div>
                {footerContent && <div>{footerContent}</div>}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
