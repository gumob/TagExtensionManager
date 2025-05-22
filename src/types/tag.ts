export interface Tag {
  id: string;
  name: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface ExtensionTag {
  extensionId: string;
  tagIds: string[];
}

export interface TagState {
  tags: Tag[];
  extensionTags: ExtensionTag[];
  visibleTagId: string | null; // nullの場合は全て表示
}

export interface TagStore extends TagState {
  addTag: (name: string) => void;
  updateTag: (id: string, name: string) => void;
  deleteTag: (id: string) => void;
  reorderTags: (tagIds: string[]) => void;
  addTagToExtension: (extensionId: string, tagId: string) => void;
  removeTagFromExtension: (extensionId: string, tagId: string) => void;
  importTags: (tags: Tag[], extensionTags: ExtensionTag[]) => void;
  exportTags: () => { tags: Tag[]; extensionTags: ExtensionTag[] };
  initialize: () => void;
  setVisibleTag: (tagId: string | null) => void;
  showAllTags: () => void;
  isLoading: boolean;
}
