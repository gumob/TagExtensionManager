import { useExtensionContext } from '@/contexts/ExtensionContext';
import { TagModel } from '@/models';
import { useExtensionStore, useTagStore } from '@/stores';
import { logger } from '@/utils';

/**
 * Current version of the backup file format
 */
const BACKUP_VERSION = '1.0.0';

/**
 * Interface for the backup file structure
 */
interface BackupData {
  version: string;
  tags: {
    id: string;
    name: string;
    order: number;
    createdAt: string;
    updatedAt: string;
  }[];
  extensionTags: {
    extensionId: string;
    tagIds: string[];
  }[];
  extensions: {
    id: string;
    enabled: boolean;
    locked: boolean;
  }[];
}

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
      if (!(date instanceof Date) || isNaN(date.getTime())) {
        return new Date().toISOString();
      }
      return date.toISOString();
    } catch (error) {
      console.error('📁🛑 Failed to initialize extensions', error);
      return new Date().toISOString();
    }
  };

  /**
   * Validates the backup data structure
   * @param data - The backup data to validate
   * @returns Whether the data is valid
   */
  const validateBackupData = (data: any): data is BackupData => {
    if (!data || typeof data !== 'object') return false;
    if (!data.version || typeof data.version !== 'string') return false;
    if (!Array.isArray(data.tags)) return false;
    if (!Array.isArray(data.extensionTags)) return false;
    if (!Array.isArray(data.extensions)) return false;

    /** Validate tags */
    for (const tag of data.tags) {
      if (!tag.id || !tag.name || typeof tag.order !== 'number') return false;
      if (!tag.createdAt || !tag.updatedAt) return false;
    }

    /** Validate extension tags */
    for (const extTag of data.extensionTags) {
      if (!extTag.extensionId || !Array.isArray(extTag.tagIds)) return false;
    }

    /** Validate extensions */
    for (const ext of data.extensions) {
      if (!ext.id || typeof ext.enabled !== 'boolean' || typeof ext.locked !== 'boolean')
        return false;
    }

    return true;
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
      const profiles: BackupData = {
        version: BACKUP_VERSION,
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

      logger.info('📁✅ Successfully exported profile', {
        group: 'useBackup',
        persist: true,
      });
    } catch (error) {
      console.error('📁🛑 Failed to export profile', error);
      throw error;
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
           * Validate backup data structure
           */
          if (!validateBackupData(profiles)) {
            throw new Error('Invalid backup file format');
          }

          /**
           * Check version compatibility
           */
          if (profiles.version !== BACKUP_VERSION) {
            logger.warn(
              `📁⚠️ Backup file version (${profiles.version}) differs from current version (${BACKUP_VERSION})`,
              {
                group: 'useBackup',
                persist: true,
              }
            );
          }

          /**
           * Get current installed extensions
           */
          const { extensions: installedExtensions } = useExtensionStore.getState();
          const installedExtensionIds = new Set(installedExtensions.map(ext => ext.id));

          /**
           * Filter out data for non-installed extensions
           */
          const filteredExtensions = profiles.extensions
            .filter((ext: any) => installedExtensionIds.has(ext.id))
            .map(ext => {
              const installedExt = installedExtensions.find(e => e.id === ext.id);
              if (!installedExt) {
                throw new Error(`Extension ${ext.id} not found in installed extensions`);
              }
              return {
                ...installedExt,
                enabled: ext.enabled,
                locked: ext.locked,
              };
            });

          const filteredExtensionTags = profiles.extensionTags.filter((extTag: any) =>
            installedExtensionIds.has(extTag.extensionId)
          );

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
          importTags(convertedTags, filteredExtensionTags);
          importExtensions(filteredExtensions);

          /**
           * Refresh the extension list to reflect imported changes
           */
          await refreshExtensions();

          /**
           * Log the number of filtered out extensions
           */
          const filteredOutCount = profiles.extensions.length - filteredExtensions.length;
          if (filteredOutCount > 0) {
            logger.info(`📁ℹ️ Filtered out ${filteredOutCount} non-installed extensions`, {
              group: 'useBackup',
              persist: true,
            });
          }

          logger.info('📁✅ Successfully imported profile', {
            group: 'useBackup',
            persist: true,
          });
        } catch (error) {
          console.error('📁🛑 Failed to import profile', error);
          throw error;
        }
      };

      /**
       * Start reading the file as text
       */
      reader.readAsText(file);
    } catch (error) {
      console.error('📁🛑 Failed to import profile', error);
      throw error;
    }
  };

  return {
    exportFile,
    importFile,
  };
};
