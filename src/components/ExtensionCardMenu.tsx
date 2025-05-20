import { autoUpdate, flip, offset, shift, useFloating } from '@floating-ui/react';
import { Menu } from '@headlessui/react';
import { Cog6ToothIcon, EllipsisVerticalIcon, TagIcon } from '@heroicons/react/24/outline';

/**
 * Extension menu props.
 */
interface ExtensionCardMenuProps {
  buttonRef: React.RefObject<HTMLButtonElement>;
  onManageTags: () => void;
  onManageExtension: () => void;
}

/**
 * Extension card menu component.
 * @param props
 * @returns
 */
export function ExtensionCardMenu({
  buttonRef,
  onManageTags,
  onManageExtension,
}: ExtensionCardMenuProps) {
  const { refs, floatingStyles } = useFloating({
    elements: {
      reference: buttonRef.current,
    },
    middleware: [offset(4), flip(), shift()],
    whileElementsMounted: autoUpdate,
  });

  return (
    <Menu>
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
                onClick={onManageTags}
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
