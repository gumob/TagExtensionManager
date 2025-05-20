import { useEffect } from 'react';

/**
 * Custom hook to handle menu positioning.
 * @param buttonRef
 * @param menuRef
 */
export function useMenuPosition(
  buttonRef: React.RefObject<HTMLButtonElement>,
  menuRef: React.RefObject<HTMLDivElement>
) {
  useEffect(() => {
    if (!buttonRef.current || !menuRef.current) return;

    const updatePosition = () => {
      const buttonRect = buttonRef.current!.getBoundingClientRect();
      const menuRect = menuRef.current!.getBoundingClientRect();
      const spaceBelow = window.innerHeight - buttonRect.bottom;
      const spaceAbove = buttonRect.top;
      const spaceRight = window.innerWidth - buttonRect.right;

      // Calculate vertical position
      if (spaceBelow < menuRect.height && spaceAbove > menuRect.height) {
        // Show above the button if there's not enough space below
        menuRef.current!.style.top = `${buttonRect.top - menuRect.height - 4}px`;
        menuRef.current!.style.bottom = 'auto';
      } else {
        // Show below the button
        menuRef.current!.style.top = `${buttonRect.bottom + 4}px`;
        menuRef.current!.style.bottom = 'auto';
      }

      // Calculate horizontal position
      if (spaceRight < menuRect.width) {
        // If there's not enough space on the right, align with the right edge of the button
        menuRef.current!.style.left = `${buttonRect.right - menuRect.width}px`;
        menuRef.current!.style.right = 'auto';
      } else {
        // Align with the left edge of the button
        menuRef.current!.style.left = `${buttonRect.left}px`;
        menuRef.current!.style.right = 'auto';
      }
    };

    // Initial position update
    updatePosition();

    // Update position on scroll and resize
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [buttonRef, menuRef]);
}
