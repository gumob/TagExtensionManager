import { autoUpdate, flip, offset, shift, useFloating } from '@floating-ui/react';
import { Dialog, Menu, MenuItems } from '@headlessui/react';
import {
  ArchiveBoxXMarkIcon,
  Cog6ToothIcon,
  EllipsisVerticalIcon,
  LockClosedIcon,
  LockOpenIcon,
  TagIcon,
} from '@heroicons/react/24/outline';

import { useState } from 'react';

import {
  CancelButtonComponent,
  DeleteButtonComponent,
  DialogComponent,
  MenuItemComponent,
} from '@/components';
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
            <Menu.Button
              ref={buttonRef}
              className="p-1 text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-lg focus:outline-none transition-colors"
            >
              <EllipsisVerticalIcon className="w-5 h-5" />
            </Menu.Button>

            <MenuItems
              ref={refs.setFloating}
              style={floatingStyles}
              className="w-36 z-[100] bg-zinc-50 dark:bg-zinc-700 rounded-lg shadow-xl shadow-zinc-300 dark:shadow-zinc-900 ring-1 ring-black ring-opacity-5 focus:outline-none"
            >
              <div className="py-1">
                <MenuItemComponent onClick={() => setIsTagSelectorOpen(true)}>
                  <TagIcon className="w-4 h-4" />
                  Manage Tags
                </MenuItemComponent>
                <MenuItemComponent onClick={() => handleLockToggle(close)}>
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
                </MenuItemComponent>
                <MenuItemComponent onClick={() => openExtensionPage(extension.id)}>
                  <Cog6ToothIcon className="w-4 h-4" />
                  Manage Extension
                </MenuItemComponent>
                <MenuItemComponent
                  className="!text-red-600 dark:!text-red-400"
                  onClick={handleUninstallClick}
                >
                  <ArchiveBoxXMarkIcon className="w-4 h-4" />
                  Uninstall Extension
                </MenuItemComponent>
              </div>
            </MenuItems>
          </>
        )}
      </Menu>

      <DialogComponent
        isOpen={isUninstallDialogOpen}
        onClose={() => setIsUninstallDialogOpen(false)}
        width="max-w-sm"
      >
        <Dialog.Title className="text-header">{`Uninstall "${extension.name}"?`}</Dialog.Title>

        <div className="mt-6 flex justify-end gap-2">
          <CancelButtonComponent onClick={() => setIsUninstallDialogOpen(false)} />
          <DeleteButtonComponent onClick={handleConfirmUninstall} />
        </div>
      </DialogComponent>

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
