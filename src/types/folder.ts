export interface Folder {
  id: string;
  name: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface ExtensionInFolder {
  id: string;
  folderId: string | null; // nullの場合はUnsorted
}

export interface FolderState {
  folders: Folder[];
  extensions: ExtensionInFolder[];
  visibleFolderId: string | null; // nullの場合は全て表示
}

export interface FolderStore extends FolderState {
  addFolder: (name: string) => void;
  updateFolder: (id: string, name: string) => void;
  deleteFolder: (id: string) => void;
  reorderFolders: (folderIds: string[]) => void;
  moveExtension: (extensionId: string, folderId: string | null) => void;
  importFolders: (folders: Folder[], extensions: ExtensionInFolder[]) => void;
  exportFolders: () => { folders: Folder[]; extensions: ExtensionInFolder[] };
  initialize: () => void;
  setVisibleFolder: (folderId: string | null) => void;
  showAllFolders: () => void;
}
