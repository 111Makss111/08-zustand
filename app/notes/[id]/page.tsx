import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import NoteDetailsClient from './NoteDetails.client';
import { fetchNoteById } from '@/lib/api/fetchNoteById';
import { isNotFoundError } from '@/lib/api/client';
import { buildPageMetadata, createNoteExcerpt } from '@/lib/metadata';

import css from './NoteDetails.module.css';

type NoteDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata({
  params,
}: NoteDetailsPageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const note = await fetchNoteById(id);

    return buildPageMetadata({
      title: note.title,
      description: createNoteExcerpt(note.content),
      path: `/notes/${id}`,
    });
  } catch {
    return buildPageMetadata({
      title: 'Note details',
      description: 'Open a NoteHub note to read its full content and details.',
      path: `/notes/${id}`,
    });
  }
}

export default async function NoteDetailsPage({
  params,
}: NoteDetailsPageProps) {
  const { id } = await params;

  try {
    const note = await fetchNoteById(id);

    return <NoteDetailsClient note={note} />;
  } catch (error) {
    if (isNotFoundError(error)) {
      notFound();
    }

    return (
      <main className={css.main}>
        <div className={css.container}>
          <p>We could not load this note right now. Please try again later.</p>
        </div>
      </main>
    );
  }
}
