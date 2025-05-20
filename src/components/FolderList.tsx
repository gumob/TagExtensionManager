import { FolderChip } from '@/components/FolderChip';
import { FolderEditButton } from '@/components/FolderEditButton';
import { FolderShowAllButton } from '@/components/FolderShowAllButton';

import { useFolderStore } from '../stores/folderStore';

export const FolderList = () => {
  const { folders, extensions } = useFolderStore();

  return (
    <div className="flex flex-wrap gap-1">
      <FolderShowAllButton />
      {folders.map(folder => (
        <FolderChip key={folder.id} folder={folder} extensions={extensions} />
      ))}
      <FolderEditButton />
    </div>
  );
};
