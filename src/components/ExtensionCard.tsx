import { ExtensionCardMenu } from '@/components/ExtensionCardMenu';
import { TagSelector } from '@/components/TagSelector';
import { useExtensions } from '@/hooks/useExtensions';
import { useTagStore } from '@/stores/tagStore';
import { logger } from '@/utils/logger';
import { Switch } from '@headlessui/react';
import { useEffect, useRef, useState } from 'react';

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
  const [isHovered, setIsHovered] = useState(false);
  const [hasOptionsPage, setHasOptionsPage] = useState(false);
  const { tags, extensionTags, addTagToExtension, removeTagFromExtension } = useTagStore();
  const { refreshExtensions } = useExtensions();
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Check if extension has options page on mount
  useEffect(() => {
    const checkOptionsPage = async () => {
      try {
        const extensionInfo = await chrome.management.get(extension.id);
        setHasOptionsPage(!!extensionInfo.optionsUrl);
      } catch (error) {
        logger.error('Failed to get extension info', {
          group: 'ExtensionCard',
          persist: true,
        });
      }
    };
    checkOptionsPage();
  }, [extension.id]);

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
      logger.error('Failed to uninstall extension', {
        group: 'ExtensionCard',
        persist: true,
      });
    }
  };

  /**
   * Handle card click to open the extension.
   */
  const handleCardClick = async () => {
    if (!extension.enabled || !hasOptionsPage) return;

    try {
      const extensionInfo = await chrome.management.get(extension.id);
      if (extensionInfo.optionsUrl) {
        await chrome.tabs.create({ url: extensionInfo.optionsUrl, active: true });
      }
    } catch (error) {
      logger.error('Failed to launch extension', {
        group: 'ExtensionCard',
        persist: true,
      });
    }
  };

  /**
   * Handle mouse enter on controls.
   */
  const handleControlsMouseEnter = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsHovered(false);
  };

  /**
   * Handle mouse leave on controls.
   */
  const handleControlsMouseLeave = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsHovered(true);
  };

  /**
   * Handle controls click to prevent event propagation.
   */
  const handleControlsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  /**
   * Render the extension card.
   * @returns
   */
  return (
    <div
      className={`rounded-xl px-3 py-2 ${
        extension.enabled && hasOptionsPage ? 'cursor-pointer' : ''
      } ${
        isHovered && extension.enabled && hasOptionsPage
          ? 'bg-zinc-50 dark:bg-zinc-600'
          : 'bg-white dark:bg-zinc-700'
      } transition-colors`}
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center gap-2">
        <img
          src={extension.iconUrl}
          alt={extension.name}
          className={`w-6 h-6 rounded transition-opacity ${!extension.enabled ? 'opacity-30' : ''}`}
        />
        <div className="flex-1 min-w-0">
          <h3
            className={`text-2xs select-none font-semibold truncate text-zinc-900 dark:text-white transition-opacity ${!extension.enabled ? 'opacity-30' : ''}`}
          >
            {extension.name}
          </h3>
          <p
            className={`text-3xs select-none text-zinc-500 dark:text-zinc-400 transition-opacity ${!extension.enabled ? 'opacity-50' : ''}`}
          >
            {extension.version}
          </p>
        </div>
        <div
          className="flex items-center space-x-2"
          onMouseEnter={handleControlsMouseEnter}
          onMouseLeave={handleControlsMouseLeave}
          onClick={handleControlsClick}
        >
          <Switch
            checked={extension.enabled}
            onChange={checked => onToggle(extension.id, checked)}
            className={`${
              extension.enabled ? 'bg-green-500' : 'bg-zinc-300 dark:bg-zinc-600'
            } relative inline-flex h-4 w-7 items-center rounded-full transition-colors focus:outline-none`}
          >
            <span
              className={`${
                extension.enabled ? 'translate-x-4' : 'translate-x-0.5'
              } inline-block h-2.5 w-2.5 transform rounded-full bg-white transition-transform`}
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
        <TagSelector
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
