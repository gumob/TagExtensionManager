import { ExtensionCardMenu } from '@/components/ExtensionCardMenu';
import { TagSelectionDialog } from '@/components/TagSelectionDialog';
import { useExtensions } from '@/hooks/useExtensions';
import { useTagStore } from '@/stores/tagStore';
import { Switch } from '@headlessui/react';
import { useRef, useState } from 'react';

/**
 * Extension type.
 */
interface Extension {
  id: string;
  name: string;
  version: string;
  enabled: boolean;
  description: string;
  iconUrl: string;
}

/**
 * Extension card props.
 */
interface ExtensionCardProps {
  extension: Extension;
  onToggle: (id: string, enabled: boolean) => void;
  onSettingsClick: (id: string) => void;
}

/**
 * Extension card component.
 * @param props
 * @returns
 */
export function ExtensionCard({ extension, onToggle, onSettingsClick }: ExtensionCardProps) {
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);
  const { tags, extensionTags, addTagToExtension, removeTagFromExtension } = useTagStore();
  const { refreshExtensions } = useExtensions();
  const buttonRef = useRef<HTMLButtonElement>(null);

  /**
   * Current tag ids.
   */
  const currentTagIds =
    extensionTags.find(extTag => extTag.extensionId === extension.id)?.tagIds ?? [];

  /**
   * Handle tag selection.
   * @param tagIds
   */
  const handleTagSelection = (tagIds: string[]) => {
    // Add new tags
    tagIds.forEach(tagId => {
      if (!currentTagIds.includes(tagId)) {
        addTagToExtension(extension.id, tagId);
      }
    });

    // Remove deselected tags
    currentTagIds.forEach(tagId => {
      if (!tagIds.includes(tagId)) {
        removeTagFromExtension(extension.id, tagId);
      }
    });
  };

  /**
   * Handle uninstall.
   */
  const handleUninstall = async () => {
    try {
      await chrome.management.uninstall(extension.id);
      // Refresh the extension list after uninstallation
      await refreshExtensions();
    } catch (error) {
      console.error('Failed to uninstall extension:', error);
    }
  };

  /**
   * Render the extension card.
   * @returns
   */
  return (
    <div className="bg-white dark:bg-zinc-700 rounded-xl p-3">
      <div className="flex items-start space-x-2">
        <img
          src={extension.iconUrl}
          alt={extension.name}
          className={`w-6 h-6 rounded transition-opacity ${!extension.enabled ? 'opacity-30' : ''}`}
        />
        <div className="flex-1 min-w-0">
          <h3
            className={`text-xs font-semibold truncate select-none text-zinc-900 dark:text-white transition-opacity ${!extension.enabled ? 'opacity-30' : ''}`}
          >
            {extension.name}
          </h3>
          <p
            className={`text-2xs select-none text-zinc-500 dark:text-zinc-400 transition-opacity ${!extension.enabled ? 'opacity-30' : ''}`}
          >
            {extension.version}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Switch
            checked={extension.enabled}
            onChange={checked => onToggle(extension.id, checked)}
            className={`${
              extension.enabled ? 'bg-green-500' : 'bg-zinc-300 dark:bg-zinc-600'
            } relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none`}
          >
            <span
              className={`${
                extension.enabled ? 'translate-x-5' : 'translate-x-1'
              } inline-block h-3 w-3 transform rounded-full bg-white transition-transform`}
            />
          </Switch>
          <div className="relative">
            <ExtensionCardMenu
              buttonRef={buttonRef}
              onManageTags={() => setIsTagDialogOpen(true)}
              onManageExtension={() => onSettingsClick(extension.id)}
              onUninstall={handleUninstall}
              extensionName={extension.name}
            />
          </div>
        </div>
      </div>

      {isTagDialogOpen && (
        <TagSelectionDialog
          isOpen={isTagDialogOpen}
          tags={tags}
          selectedTagIds={currentTagIds}
          onClose={() => setIsTagDialogOpen(false)}
          onSelectTags={handleTagSelection}
        />
      )}
    </div>
  );
}
