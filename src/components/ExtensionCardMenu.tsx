import { useOnClickOutside } from '@/hooks/useOnClickOutside';
import { useEffect, useRef } from 'react';

/**
 * Extension menu props.
 */
interface ExtensionCardMenuProps {
  buttonRef: React.RefObject<HTMLButtonElement>;
  onMoveToFolder: () => void;
  onManageExtension: () => void;
  onCloseMenu: () => void;
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
  onCloseMenu,
}: ExtensionCardMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  // Use custom hook for outside click
  useOnClickOutside(menuRef, event => {
    console.debug('[SEM][ExtensionCardMenu] Outside click detected');
    // Ignore if the click is on the button that opened the menu
    if (buttonRef.current && buttonRef.current.contains(event.target as Node)) {
      return;
    }
    onCloseMenu();
  });

  /**
   * Handle menu position.
   */
  useEffect(() => {
    if (menuRef.current && buttonRef.current) {
      console.debug('[SEM][ExtensionCardMenu] Handling menu position');
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const menuRect = menuRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - buttonRect.bottom;
      const spaceAbove = buttonRect.top;

      if (spaceBelow < menuRect.height && spaceAbove > menuRect.height) {
        menuRef.current.style.top = 'auto';
        menuRef.current.style.bottom = '100%';
        menuRef.current.style.marginTop = '0';
        menuRef.current.style.marginBottom = '0.5rem';
      } else {
        menuRef.current.style.top = '100%';
        menuRef.current.style.bottom = 'auto';
        menuRef.current.style.marginTop = '0.5rem';
        menuRef.current.style.marginBottom = '0';
      }
    }
  }, []);

  /**
   * Render the extension menu.
   * @returns
   */
  return (
    <div
      ref={menuRef}
      className="absolute right-0 w-36 rounded-lg shadow-[0_0_8px_0] shadow-zinc-500/20 dark:shadow-zinc-900/20 bg-white dark:bg-zinc-700 ring-1 ring-black ring-opacity-5 z-50"
      style={{ marginTop: '0.5rem' }}
    >
      <div className="py-1">
        <button
          onClick={e => {
            onMoveToFolder();
          }}
          className="block w-full text-left px-3 py-2 text-2xs text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-600"
        >
          Move to Folder
        </button>
        <button
          onClick={e => {
            onManageExtension();
          }}
          className="block w-full text-left px-3 py-2 text-2xs text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-600"
        >
          Manage Extension
        </button>
      </div>
    </div>
  );
}
