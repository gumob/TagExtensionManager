import { Switch } from '@headlessui/react';
import { LockClosedIcon } from '@heroicons/react/24/outline';

import { useEffect, useRef, useState } from 'react';

import { ExtensionCardMenu } from '@/features/extension/components';
import { TagSelector } from '@/features/tag/components';
import { useExtensions } from '@/shared/hooks';
import { Extension } from '@/shared/models';
import { useTagStore } from '@/shared/stores';
import { logger } from '@/shared/utils';

/**
 * Extension card props.
 *
 * @param extension - The extension to display.
 * @param onToggle - The callback to toggle the extension.
 * @param onSettingsClick - The callback to open the settings page.
 * @param onLockToggle - The callback to lock the extension.
 */
interface ExtensionCardProps {
  extension: Extension;
  onToggle: (id: string, enabled: boolean) => void;
  onSettingsClick: (id: string) => void;
  onLockToggle: (id: string, locked: boolean) => void;
}

/**
 * Extension card component.
 *
 * @param extension - The extension to display.
 * @param onToggle - The callback to toggle the extension.
 * @param onSettingsClick - The callback to open the settings page.
 * @param onLockToggle - The callback to lock the extension.
 * @returns The extension card component.
 */
export function ExtensionCard({
  extension,
  onToggle,
  onSettingsClick,
  onLockToggle,
}: ExtensionCardProps) {
  /**
   * The tag dialog open state.
   */
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);
  /**
   * The hovered state.
   */
  const [isHovered, setIsHovered] = useState(false);
  /**
   * The has options page state.
   */
  const [hasOptionsPage, setHasOptionsPage] = useState(false);
  /**
   * The has options page state.
   */
  const { tags, extensionTags, addTagToExtension, removeTagFromExtension } = useTagStore();
  /**
   * The use extensions hook.
   */
  const { refreshExtensions } = useExtensions();
  /**
   * The button ref.
   */
  const buttonRef = useRef<HTMLButtonElement>(null);

  /**
   * Check if extension has options page on mount.
   */
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
    /** Add new tags */
    tagIds.forEach(tagId => {
      if (!currentTagIds.includes(tagId)) {
        addTagToExtension(extension.id, tagId);
      }
    });

    /** Remove deselected tags */
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
      /** Refresh the extension list after uninstallation */
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
   *
   * @param e - The mouse event.
   */
  const handleControlsMouseEnter = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsHovered(false);
  };

  /**
   * Handle mouse leave on controls.
   *
   * @param e - The mouse event.
   */
  const handleControlsMouseLeave = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsHovered(true);
  };

  /**
   * Handle controls click to prevent event propagation.
   *
   * @param e - The mouse event.
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
          {extension.locked && (
            <LockClosedIcon className="w-3 h-3 text-zinc-500 dark:text-zinc-400" />
          )}
          <Switch
            checked={extension.enabled}
            onChange={checked => onToggle(extension.id, checked)}
            disabled={extension.locked}
            className={`${
              extension.enabled ? 'bg-green-500' : 'bg-zinc-300 dark:bg-zinc-600'
            } relative inline-flex h-4 w-7 items-center rounded-full transition-colors focus:outline-none ${
              extension.locked ? 'opacity-50 cursor-not-allowed' : ''
            }`}
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
              onLockToggle={() => onLockToggle(extension.id, !extension.locked)}
              extensionName={extension.name}
              isLocked={extension.locked}
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
