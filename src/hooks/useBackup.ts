import { useExtensionContext } from '@/contexts/ExtensionContext';
import { TagModel } from '@/models';
import {
  useExtensionStore,
  useTagStore,
} from '@/stores';
import { logger } from '@/utils';

/**
 * Custom hook for backup management.
 * This hook provides functionality to export and import extension profiles including:
 * - Extension states (enabled/disabled)
 * - Extension locks
 * - Tags and tag assignments
 *
 * @returns Object containing exportFile and importFile functions
 */
export const useBackup = () => {
  /**
   * Get required functions from hooks and stores:
   * - refreshExtensions: Updates the extension list after import
   * - exportTags/importTags: Handles saving/loading tag data
   * - importExtensions: Updates extension states in the store
   */
  const { refreshExtensions } = useExtensionContext();
  const { exportTags, importTags } = useTagStore();
  const { importExtensions } = useExtensionStore();

  /**
   * Converts a date to ISO format
   * @param date - The date to convert
   * @returns The date in ISO format
   */
  const convertToISOString = (date: Date): string => {
    try {
      return date.toISOString();
    } catch (error) {
      logger.error('📁🛑 Failed to convert date', {
        group: 'useBackup',
        persist: true,
      });
      return new Date().toISOString();
    }
  };

  /**
   * The function that exports the current profile configuration to a JSON file.
   *
   * Step-by-step process:
   * 1. Retrieves current tag data using exportTags()
   * 2. Gets current extension states from the store
   * 3. Creates a profiles object combining all data
   * 4. Converts to JSON with proper formatting
   * 5. Creates a downloadable file with timestamp
   * 6. Triggers browser download
   */
  const exportFile = async () => {
    try {
      /**
       * Get current tag configuration and extension states
       */
      const { tags, extensionTags } = exportTags();
      const { extensions: storedExtensions } = useExtensionStore.getState();

      /**
       * Create a profile object containing only necessary extension data
       * and convert dates to ISO format
       */
      const profiles = {
        tags: tags.map(tag => ({
          ...tag,
          createdAt: convertToISOString(tag.createdAt),
          updatedAt: convertToISOString(tag.updatedAt),
        })),
        extensionTags,
        extensions: storedExtensions.map(ext => ({
          id: ext.id,
          enabled: ext.enabled,
          locked: ext.locked,
        })),
      };

      /**
       * Convert profile to JSON and create downloadable file
       */
      const data = JSON.stringify(profiles, null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;

      /**
       * Generate filename with current timestamp
       * Format: CleanExtensionManager-YYYYMMDD-HHMM.json
       */
      const now = new Date();
      const timestamp =
        now.getFullYear().toString() +
        (now.getMonth() + 1).toString().padStart(2, '0') +
        now.getDate().toString().padStart(2, '0') +
        '-' +
        now.getHours().toString().padStart(2, '0') +
        now.getMinutes().toString().padStart(2, '0');
      a.download = `CleanExtensionManager-${timestamp}.json`;

      /**
       * Trigger download and cleanup
       */
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      logger.error('📁🛑 Failed to export profile', {
        group: 'useBackup',
        persist: true,
      });
    }
  };

  /**
   * The function that imports a profile configuration from a JSON file.
   *
   * Step-by-step process:
   * 1. Creates FileReader to read the JSON file
   * 2. Sets up onload handler to process file contents
   * 3. Imports tags and extension states
   * 4. Refreshes extension list to show changes
   *
   * @param file - The JSON file containing profile configuration
   */
  const importFile = async (file: File) => {
    try {
      /**
       * Create FileReader and set up handler for when file is loaded
       */
      const reader = new FileReader();
      reader.onload = async e => {
        try {
          /**
           * Parse JSON content and extract profile data
           */
          const content = e.target?.result as string;
          const profiles = JSON.parse(content);

          /**
           * Convert dates to Date objects before importing
           */
          const convertedTags: TagModel[] = profiles.tags.map((tag: any) => ({
            ...tag,
            createdAt: new Date(tag.createdAt),
            updatedAt: new Date(tag.updatedAt),
          }));

          /**
           * Import tags and extension states into their respective stores
           */
          importTags(convertedTags, profiles.extensionTags);
          importExtensions(profiles.extensions);

          /**
           * Refresh the extension list to reflect imported changes
           */
          await refreshExtensions();
        } catch (error) {
          logger.error('📁🛑 Failed to import profile', {
            group: 'useBackup',
            persist: true,
          });
        }
      };

      /**
       * Start reading the file as text
       */
      reader.readAsText(file);
    } catch (error) {
      logger.error('📁🛑 Failed to import profile', {
        group: 'useBackup',
        persist: true,
      });
    }
  };

  return {
    exportFile,
    importFile,
  };
};
