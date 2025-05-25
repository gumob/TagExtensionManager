import { autoUpdate, flip, offset, shift, useFloating } from '@floating-ui/react';
import { Dialog, Menu, Transition } from '@headlessui/react';
import {
  ArchiveBoxXMarkIcon,
  Cog6ToothIcon,
  EllipsisVerticalIcon,
  LockClosedIcon,
  LockOpenIcon,
  TagIcon,
} from '@heroicons/react/24/outline';

import { Fragment, useState } from 'react';

import { chromeAPI } from '@/api/ChromeAPI';
import { useExtensionContext } from '@/contexts/ExtensionContext';
import { TagSelectorMain } from '@/features/popup/components/selector/TagSelectorMain';
import { ExtensionModel } from '@/models';
import { useExtensionStore, useTagStore } from '@/stores';

/**
 * Extension menu props.
 *
 * @param buttonRef - The button ref.
 */
interface ExtensionCardMenuProps {
  extension: ExtensionModel;
  buttonRef: React.RefObject<HTMLButtonElement>;
}

/**
 * Extension card menu component.
 *
 * @param buttonRef - The button ref.
 * @param extensionName - The name of the extension.
 * @param isLocked - Whether the extension is locked.
 * @returns The extension card menu component.
 */
export const ExtensionCardMenu: React.FC<ExtensionCardMenuProps> = ({ extension, buttonRef }) => {
  /**
   * The tag store.
   */
  const { tags, extensionTags } = useTagStore();
  /**
   * The use extension store.
   */
  const {
    extensions: { refreshExtensions },
  } = useExtensionContext();

  /**
   * The toggle lock function.
   */
  const { toggleLock } = useExtensionStore();

  /**
   * The uninstall dialog open state.
   */
  const [isUninstallDialogOpen, setIsUninstallDialogOpen] = useState(false);

  /**
   * The tag dialog open state.
   */
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);

  /**
   * The use floating hook.
   */
  const { refs, floatingStyles } = useFloating({
    elements: {
      reference: buttonRef.current,
    },
    middleware: [offset(4), flip(), shift()],
    whileElementsMounted: autoUpdate,
  });

  /**
   * The handle uninstall click.
   */
  const handleUninstallClick = () => {
    setIsUninstallDialogOpen(true);
  };

  /**
   * The handle confirm uninstall.
   */
  const handleConfirmUninstall = async () => {
    await chromeAPI.uninstallExtension(extension.id);
    /** Refresh the extension list after uninstallation */
    await refreshExtensions();
    setIsUninstallDialogOpen(false);
  };

  /**
   * The handle lock toggle.
   *
   * @param close - The close callback.
   */
  const handleLockToggle = (close: () => void) => {
    toggleLock(extension.id);
    close();
  };

  /**
   * The extension card menu component.
   *
   * @returns The extension card menu component.
   */
  return (
    <>
      <Menu>
        {({ close }) => (
          <>
            <Menu.Button
              ref={buttonRef}
              className="p-1 text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-lg transition-colors"
            >
              <EllipsisVerticalIcon className="w-5 h-5" />
            </Menu.Button>

            <Menu.Items
              ref={refs.setFloating}
              style={floatingStyles}
              className="w-36 bg-white dark:bg-zinc-700 rounded-lg shadow-xl shadow-zinc-900 ring-1 ring-black ring-opacity-5 focus:outline-none z-[100]"
            >
              <div className="py-1">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => setIsTagDialogOpen(true)}
                      className={`${
                        active ? 'bg-zinc-100 dark:bg-zinc-600' : ''
                      } block w-full text-left px-3 py-2 text-2xs text-zinc-700 dark:text-zinc-200 focus:outline-none`}
                    >
                      <span className="flex items-center gap-2">
                        <TagIcon className="w-4 h-4" />
                        Manage Tags
                      </span>
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => handleLockToggle(close)}
                      className={`${
                        active ? 'bg-zinc-100 dark:bg-zinc-600' : ''
                      } block w-full text-left px-3 py-2 text-2xs text-zinc-700 dark:text-zinc-200 focus:outline-none`}
                    >
                      <span className="flex items-center gap-2">
                        {extension.locked ? (
                          <>
                            <LockOpenIcon className="w-4 h-4" />
                            Unlock Extension
                          </>
                        ) : (
                          <>
                            <LockClosedIcon className="w-4 h-4" />
                            Lock Extension
                          </>
                        )}
                      </span>
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={async () => {
                        await chromeAPI.createTab(extension.id);
                      }}
                      className={`${
                        active ? 'bg-zinc-100 dark:bg-zinc-600' : ''
                      } block w-full text-left px-3 py-2 text-2xs text-zinc-700 dark:text-zinc-200 focus:outline-none`}
                    >
                      <span className="flex items-center gap-2">
                        <Cog6ToothIcon className="w-4 h-4" />
                        Manage Extension
                      </span>
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={handleUninstallClick}
                      className={`${
                        active ? 'bg-zinc-100 dark:bg-zinc-600' : ''
                      } block w-full text-left px-3 py-2 text-2xs text-red-600 dark:text-red-400 focus:outline-none`}
                    >
                      <span className="flex items-center gap-2">
                        <ArchiveBoxXMarkIcon className="w-4 h-4" />
                        Uninstall Extension
                      </span>
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </>
        )}
      </Menu>

      <Transition appear show={isUninstallDialogOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-[200]"
          onClose={() => setIsUninstallDialogOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/70 dark:bg-black/70 backdrop-blur-sm" />
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
                <Dialog.Panel className="w-full max-w-sm transform overflow-hidden rounded-2xl bg-white dark:bg-zinc-800 p-6 shadow-xl transition-all">
                  <Dialog.Title className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                    {`Uninstall ${extension.name}?`}
                  </Dialog.Title>

                  <div className="mt-6 flex justify-end gap-2">
                    <button
                      onClick={() => setIsUninstallDialogOpen(false)}
                      className="px-3 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-200 bg-zinc-100 dark:bg-zinc-600 hover:bg-zinc-200 dark:hover:bg-zinc-500 rounded-full transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirmUninstall}
                      className="px-3 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 dark:bg-red-500/90 dark:hover:bg-red-500 rounded-full transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {isTagDialogOpen && (
        <TagSelectorMain
          extension={extension}
          isOpen={isTagDialogOpen}
          onClose={() => setIsTagDialogOpen(false)}
        />
      )}
    </>
  );
};
