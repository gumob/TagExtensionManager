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
    const listener = (event: MouseEvent) => {
      if (!ref.current) return;
      // Debug log for event target and ref
      // eslint-disable-next-line no-console
      console.log(
        '[SEM][useOnClickOutside] event.target:',
        event.target,
        'ref.current:',
        ref.current,
        'contains:',
        ref.current.contains(event.target as Node)
      );
      if (ref.current.contains(event.target as Node)) {
        return;
      }
      handler(event);
    };
    console.log('[SEM][useOnClickOutside] Adding event listener');
    document.addEventListener('mousedown', listener);
    return () => {
      console.log('[SEM][useOnClickOutside] Removing event listener');
      document.removeEventListener('mousedown', listener);
    };
  }, [ref, handler]);
}
