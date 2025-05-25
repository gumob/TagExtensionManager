import { create } from 'zustand';

interface VisibleTagStore {
  visibleTagId: string | null;
  setVisibleTagId: (tagId: string | null) => void;
}

export const useVisibleTag = create<VisibleTagStore>()(set => ({
  visibleTagId: null,
  setVisibleTagId: (tagId: string | null) => set({ visibleTagId: tagId }),
}));
