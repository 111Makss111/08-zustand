'use client';

import NotePreviewClient from '@/app/@modal/(.)notes/[id]/NotePreview.client';
import type { Note } from '@/types/note';

import css from './NoteDetails.module.css';

interface NoteDetailsClientProps {
  note: Note;
}

export default function NoteDetailsClient({ note }: NoteDetailsClientProps) {
  return (
    <main className={css.main}>
      <NotePreviewClient note={note} />
    </main>
  );
}
