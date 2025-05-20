import { ExtensionCardMenu } from '@/components/ExtensionCardMenu';
import { FolderSelectionDialog } from '@/components/FolderSelectionDialog';
import { useFolderStore } from '@/stores/folderStore';
import { Switch } from '@headlessui/react';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';
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
  onSettingsClick: (extensionId: string) => void;
}

/**
 * Extension card component.
 * @param props
 * @returns
 */
export function ExtensionCard({ extension, onToggle, onSettingsClick }: ExtensionCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFolderDialogOpen, setIsFolderDialogOpen] = useState(false);
  const { folders, extensions: folderExtensions, moveExtension } = useFolderStore();
  const buttonRef = useRef<HTMLButtonElement>(null);

  /**
   * Current folder id.
   */
  const currentFolderId = folderExtensions.find(ext => ext.id === extension.id)?.folderId ?? null;

  /**
   * Handle move to folder.
   * @param folderId
   */
  const handleMoveToFolder = (folderId: string | null) => {
    console.debug('[SEM][ExtensionCard] Moving extension to folder:', folderId);
    moveExtension(extension.id, folderId);
    setIsFolderDialogOpen(false);
  };

  /**
   * Handle open folder dialog.
   */
  const handleOpenFolderDialog = () => {
    console.debug('[SEM][ExtensionCard] Opening folder dialog');
    setIsMenuOpen(false);
    setTimeout(() => {
      setIsFolderDialogOpen(true);
    }, 0);
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
            <button
              ref={buttonRef}
              onClick={() => {
                if (!isFolderDialogOpen) {
                  setIsMenuOpen(!isMenuOpen);
                }
              }}
              className="p-1 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
            >
              <EllipsisVerticalIcon className="h-5 w-5" />
            </button>
            {isMenuOpen && (
              <ExtensionCardMenu
                buttonRef={buttonRef}
                onMoveToFolder={handleOpenFolderDialog}
                onManageExtension={() => {
                  setIsMenuOpen(false);
                  onSettingsClick(extension.id);
                }}
                onCloseMenu={() => setIsMenuOpen(false)}
              />
            )}
          </div>
        </div>
      </div>

      {isFolderDialogOpen && (
        <FolderSelectionDialog
          folders={folders}
          currentFolderId={currentFolderId}
          onClose={() => setIsFolderDialogOpen(false)}
          onSelectFolder={handleMoveToFolder}
        />
      )}
    </div>
  );
}
