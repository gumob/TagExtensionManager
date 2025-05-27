import { Dialog, Transition } from '@headlessui/react';

import { Fragment } from 'react';

interface DialogComponentProps {
  isOpen: boolean;
  onClose: () => void;
  width?: 'max-w-sm' | 'max-w-md' | 'max-w-lg';
  children: React.ReactNode;
}

export const DialogComponent: React.FC<DialogComponentProps> = ({
  isOpen,
  onClose,
  width = 'max-w-md',
  children,
}) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className={`w-full ${width} transform overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-800 p-6 shadow-xl shadow-zinc-300 dark:shadow-zinc-900 transition-all`}
              >
                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
