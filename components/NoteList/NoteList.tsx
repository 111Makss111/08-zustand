'use client';

import { useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { startTransition, useState } from 'react';

import { deleteNote } from '@/lib/api/deleteNote';
import { getErrorMessage } from '@/lib/api/client';
import type { Note } from '@/types/note';

import css from './NoteList.module.css';

interface NoteListProps {
  notes: Note[];
  emptyMessage?: string;
  onNoteDeleted?: () => void;
}

export default function NoteList({
  notes,
  emptyMessage = 'There are no notes yet.',
  onNoteDeleted,
}: NoteListProps) {
  const router = useRouter();
  const [error, setError] = useState('');
  const [activeDeleteId, setActiveDeleteId] = useState<string | null>(null);

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      setActiveDeleteId(id);
      await deleteNote(id);
    },
    onSuccess: () => {
      setError('');

      if (onNoteDeleted) {
        onNoteDeleted();
        return;
      }

      startTransition(() => {
        router.refresh();
      });
    },
    onError: (mutationError) => {
      setError(getErrorMessage(mutationError));
    },
    onSettled: () => {
      setActiveDeleteId(null);
    },
  });

  if (notes.length === 0) {
    return <p>{emptyMessage}</p>;
  }

  return (
    <>
      {error ? <p>{error}</p> : null}

      <ul className={css.list}>
        {notes.map((note) => {
          const isDeleting =
            deleteMutation.isPending && activeDeleteId === note.id;

          return (
            <li key={note.id} className={css.listItem}>
              <h2 className={css.title}>{note.title}</h2>
              <p className={css.content}>{note.content}</p>

              <div className={css.footer}>
                <span className={css.tag}>{note.tag}</span>
                <div>
                  <Link href={`/notes/${note.id}`} className={css.link}>
                    View details
                  </Link>{' '}
                  <button
                    type="button"
                    className={css.button}
                    onClick={() => deleteMutation.mutate(note.id)}
                    disabled={isDeleting}
                  >
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}
