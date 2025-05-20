import { Menu } from '@headlessui/react';
import { Cog6ToothIcon, EllipsisVerticalIcon, TagIcon } from '@heroicons/react/24/outline';

/**
 * Extension menu props.
 */
interface ExtensionCardMenuProps {
  buttonRef: React.RefObject<HTMLButtonElement>;
  onMoveToFolder: () => void;
  onManageExtension: () => void;
}

/**
 * Extension menu component.
 * @param props
 * @returns
 */
export function ExtensionCardMenu({
  buttonRef,
  onMoveToFolder,
  onManageExtension,
}: ExtensionCardMenuProps) {
  return (
    <Menu as="div" className="relative">
      <Menu.Button
        ref={buttonRef}
        className="inline-flex items-center justify-center w-full px-2 py-2 text-sm font-medium text-zinc-900 dark:text-zinc-100 hover:text-zinc-700 dark:hover:text-zinc-200 focus:outline-none"
      >
        <EllipsisVerticalIcon className="h-5 w-5" />
      </Menu.Button>

      <Menu.Items className="absolute right-0 w-36 mt-1 bg-white dark:bg-zinc-700 rounded-lg shadow-xl shadow-zinc-900 ring-1 ring-black ring-opacity-5 focus:outline-none z-[100]">
        <div className="py-1">
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={onMoveToFolder}
                className={`${
                  active ? 'bg-zinc-100 dark:bg-zinc-600' : ''
                } block w-full text-left px-3 py-2 text-2xs text-zinc-700 dark:text-zinc-200 focus:outline-none`}
              >
                <span className="flex items-center gap-2">
                  <TagIcon className="w-4 h-4" />
                  Move to Folder
                </span>
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={onManageExtension}
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
        </div>
      </Menu.Items>
    </Menu>
  );
}
