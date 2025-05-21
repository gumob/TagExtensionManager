import { logger } from '@/utils/logger';
import { useEffect } from 'react';

/**
 * useOnClickOutside
 * Calls handler when a click occurs outside the referenced element.
 * @param ref - React ref to the element
 * @param handler - Function to call on outside click
 */
export function useOnClickOutside<T extends HTMLElement>(
  ref: React.RefObject<T>,
  handler: (event: MouseEvent) => void
) {
  /**
   * Add event listener.
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        logger.debug('Click outside detected', {
          group: 'useOnClickOutside',
          persist: true,
        });
        handler(event);
      }
    };

    logger.debug('Adding event listener', {
      group: 'useOnClickOutside',
      persist: true,
    });
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      logger.debug('Removing event listener', {
        group: 'useOnClickOutside',
        persist: true,
      });
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, handler]);
}
