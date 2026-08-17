import { useCallback } from 'react';

import { chromeAPI } from '@/api';
import { useExtensionContext } from '@/contexts';
import { ExtensionModel } from '@/models';
import { logger } from '@/utils';

/**
 * The hook that provides a bulk enable/disable operation over a set of extensions.
 *
 * @returns The bulkToggle function.
 */
export const useBulkToggle = () => {
  const { toggleEnabled } = useExtensionContext();

  /**
   * Toggle the given extensions to the given enabled state.
   * Locked extensions are excluded so they keep their state. This extension
   * itself is excluded so a bulk disable cannot shut down the manager UI
   * mid-operation.
   *
   * @param extensions - The extensions to toggle.
   * @param enabled - The enabled state to apply.
   */
  const bulkToggle = useCallback(
    (extensions: ExtensionModel[], enabled: boolean) => {
      /** Filter the toggle targets */
      const targets = extensions.filter(ext => !ext.locked && ext.id !== chromeAPI.getSelfId());

      /** Toggle all target extensions simultaneously */
      const togglePromises = targets.map(ext => toggleEnabled(ext.id, enabled));
      Promise.all(togglePromises).catch(error => {
        logger.warn('Failed to toggle extensions:', error);
      });
    },
    [toggleEnabled]
  );

  return { bulkToggle };
};
