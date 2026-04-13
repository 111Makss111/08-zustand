import type { Metadata } from 'next';

import NoteForm from '@/components/NoteForm/NoteForm';
import { buildPageMetadata } from '@/lib/metadata';

import css from './CreateNote.module.css';

export const metadata: Metadata = buildPageMetadata({
  title: 'Create note',
  description:
    'Create a new note in NoteHub and continue later with an automatically saved draft.',
  path: '/notes/action/create',
});

export default function CreateNotePage() {
  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Create note</h1>
        <NoteForm />
      </div>
    </main>
  );
}
