'use client';

import Link from 'next/link';

import NoteList from '@/components/NoteList/NoteList';
import Pagination from '@/components/Pagination/Pagination';
import SearchBox from '@/components/SearchBox/SearchBox';
import type { NotesResponse } from '@/types/note';

import css from '@/app/notes/NotesPage.module.css';

interface NotesClientProps {
  data: NotesResponse;
  currentPage: number;
  pathname: string;
  search: string;
  tag: string;
}

export default function NotesClient({
  data,
  currentPage,
  pathname,
  search,
  tag,
}: NotesClientProps) {
  return (
    <div className={css.app}>
      <div className={css.toolbar}>
        <SearchBox initialValue={search} />
        <Link href="/notes/action/create" className={css.button}>
          Create note +
        </Link>
      </div>
      <NoteList
        notes={data.notes}
        emptyMessage={`No notes found for the ${tag} filter.`}
      />
      <Pagination
        currentPage={data.page ?? currentPage}
        totalPages={data.totalPages}
        pathname={pathname}
        search={search}
      />
    </div>
  );
}
