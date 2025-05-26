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

import { useExtensionContext } from '@/contexts';
import { TagSelectorMain } from '@/features/popup/components/selector';
import { ExtensionModel } from '@/models';
import { useExtensionStore } from '@/stores';

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
   * The use extension store.
   */
  const { uninstallExtension, openExtensionPage } = useExtensionContext();

  /**
   * The tag selector open state.
   */
  const [isTagSelectorOpen, setIsTagSelectorOpen] = useState(false);

  /**
   * The toggle lock function.
   */
  const { toggleLock } = useExtensionStore();

  /**
   * The uninstall dialog open state.
   */
  const [isUninstallDialogOpen, setIsUninstallDialogOpen] = useState(false);

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
    await uninstallExtension(extension.id);
    setIsUninstallDialogOpen(false);
  };

  /**
   * The handle lock toggle.
   *
   * @param close - The close callback.
   */
  const handleLockToggle = (close: () => void) => {
    toggleLock(extension.id, !extension.locked);
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
            <Menu.Button ref={buttonRef} className="p-1 menu-button">
              <EllipsisVerticalIcon className="w-5 h-5" />
            </Menu.Button>

            <Menu.Items
              ref={refs.setFloating}
              style={floatingStyles}
              className="w-36 z-[100] menu-panel"
            >
              <div className="py-1">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => setIsTagSelectorOpen(true)}
                      className={`block w-full text-left px-3 py-2 menu-item`}
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
                      className={`block w-full text-left px-3 py-2 menu-item`}
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
                        openExtensionPage(extension.id);
                      }}
                      className={`block w-full text-left px-3 py-2 menu-item`}
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
                      className={`block w-full text-left px-3 py-2 menu-item text-red-600 dark:text-red-400`}
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
            <div className="dialog-glass-panel" />
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
                <Dialog.Panel className="w-full max-w-sm dialog-panel">
                  <Dialog.Title className="text-header">
                    {`Uninstall ${extension.name}?`}
                  </Dialog.Title>

                  <div className="mt-6 flex justify-end gap-2">
                    <button
                      onClick={() => setIsUninstallDialogOpen(false)}
                      className="dialog-cancel-button"
                    >
                      Cancel
                    </button>
                    <button onClick={handleConfirmUninstall} className="dialog-delete-button">
                      Delete
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {isTagSelectorOpen && (
        <TagSelectorMain
          extension={extension}
          isOpen={isTagSelectorOpen}
          onClose={() => setIsTagSelectorOpen(false)}
        />
      )}
    </>
  );
};
