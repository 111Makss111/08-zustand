import { notFound } from 'next/navigation';

import NotePreviewClient from '@/app/@modal/(.)notes/[id]/NotePreview.client';
import Modal from '@/components/Modal/Modal';
import { isNotFoundError } from '@/lib/api/client';
import { fetchNoteById } from '@/lib/api/fetchNoteById';

type InterceptedNotePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function InterceptedNotePage({
  params,
}: InterceptedNotePageProps) {
  const { id } = await params;

  try {
    const note = await fetchNoteById(id);

    return (
      <Modal fallbackHref="/notes">
        <NotePreviewClient
          note={note}
          backHref={`/notes/${id}`}
          backLabel="Open full page"
        />
      </Modal>
    );
  } catch (error) {
    if (isNotFoundError(error)) {
      notFound();
    }

    return (
      <Modal fallbackHref="/notes">
        <p>We could not load this note right now. Please try again later.</p>
      </Modal>
    );
  }
}
