import { useExtensions } from '@/hooks';
import { useExtensionStore, useTagStore } from '@/stores';
import { logger } from '@/utils';

/**
 * Custom hook for profile management.
 * @returns Profile management functions
 */
export const useProfile = () => {
  const { refreshExtensions } = useExtensions();
  const { exportTags, importTags } = useTagStore();
  const { importExtensionStates } = useExtensionStore();

  /**
   * Export profile data to JSON file
   */
  const exportProfile = async () => {
    try {
      const { tags, extensionTags } = exportTags();
      const { extensions } = useExtensionStore.getState();
      const profiles = {
        tags,
        extensionTags,
        extensions: extensions.map(ext => ({
          id: ext.id,
          enabled: ext.enabled,
          locked: ext.locked,
        })),
      };
      const data = JSON.stringify(profiles, null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;

      const now = new Date();
      const timestamp =
        now.getFullYear().toString() +
        (now.getMonth() + 1).toString().padStart(2, '0') +
        now.getDate().toString().padStart(2, '0') +
        '-' +
        now.getHours().toString().padStart(2, '0') +
        now.getMinutes().toString().padStart(2, '0');
      a.download = `CleanExtensionManager-${timestamp}.json`;

      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      logger.error('Failed to export profile', {
        group: 'ProfileManager',
        persist: true,
      });
    }
  };

  /**
   * Import profile data from JSON file
   * @param file - The file to import
   */
  const importProfile = async (file: File) => {
    try {
      const reader = new FileReader();
      reader.onload = async e => {
        try {
          const content = e.target?.result as string;
          const profiles = JSON.parse(content);

          importTags(profiles.tags, profiles.extensionTags);
          importExtensionStates(profiles.extensions);
          await refreshExtensions();
        } catch (error) {
          logger.error('Failed to import profile', {
            group: 'ProfileManager',
            persist: true,
          });
        }
      };
      reader.readAsText(file);
    } catch (error) {
      logger.error('Failed to import profile', {
        group: 'ProfileManager',
        persist: true,
      });
    }
  };

  return {
    exportProfile,
    importProfile,
  };
};
