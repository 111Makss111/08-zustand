'use client';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { NoteDraft } from '@/types/note';

export const initialDraft: NoteDraft = {
  title: '',
  content: '',
  tag: 'Todo',
};

interface NoteStoreState {
  draft: NoteDraft;
  setDraft: (note: Partial<NoteDraft>) => void;
  clearDraft: () => void;
}

export const useNoteStore = create<NoteStoreState>()(
  persist(
    (set) => ({
      draft: initialDraft,
      setDraft: (note) =>
        set((state) => ({
          draft: {
            ...state.draft,
            ...note,
          },
        })),
      clearDraft: () =>
        set({
          draft: initialDraft,
        }),
    }),
    {
      name: 'notehub-draft',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        draft: state.draft,
      }),
    },
  ),
);
