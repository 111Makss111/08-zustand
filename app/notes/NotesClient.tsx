'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';

import NoteList from '@/components/NoteList/NoteList';
import Pagination from '@/components/Pagination/Pagination';
import SearchBox from '@/components/SearchBox/SearchBox';
import { getErrorMessage } from '@/lib/api/client';
import { fetchNotes } from '@/lib/api/fetchNotes';

import css from './NotesPage.module.css';

interface NotesClientProps {
  currentPage: number;
  search: string;
}

export default function NotesClient({ currentPage, search }: NotesClientProps) {
  const queryClient = useQueryClient();

  const notesQuery = useQuery({
    queryKey: ['notes', currentPage, search],
    queryFn: () =>
      fetchNotes({
        page: currentPage,
        perPage: 12,
        search,
      }),
  });

  return (
    <div className={css.app}>
      <div className={css.toolbar}>
        <SearchBox initialValue={search} />
        <Link href="/notes/action/create" className={css.button}>
          Create note +
        </Link>
      </div>

      {notesQuery.isLoading ? <p>Loading notes...</p> : null}

      {notesQuery.isError ? <p>{getErrorMessage(notesQuery.error)}</p> : null}

      {notesQuery.data ? (
        <>
          <NoteList
            notes={notesQuery.data.notes}
            emptyMessage="No notes match your current search."
            onNoteDeleted={() => {
              void queryClient.invalidateQueries({
                queryKey: ['notes'],
              });
            }}
          />
          <Pagination
            currentPage={notesQuery.data.page ?? currentPage}
            totalPages={notesQuery.data.totalPages}
            pathname="/notes"
            search={search}
          />
        </>
      ) : null}
    </div>
  );
}
