'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';

import NoteList from '@/components/NoteList/NoteList';
import Pagination from '@/components/Pagination/Pagination';
import SearchBox from '@/components/SearchBox/SearchBox';
import { getErrorMessage } from '@/lib/api/client';
import { fetchNotes } from '@/lib/api/fetchNotes';

import css from '@/app/notes/NotesPage.module.css';

interface NotesClientProps {
  tag: string;
}

function parseCurrentPage(value: string | null) {
  const page = Number(value ?? '1');

  return Number.isFinite(page) && page > 0 ? page : 1;
}

export default function NotesClient({ tag }: NotesClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState(() => searchParams.get('search') ?? '');
  const [currentPage, setCurrentPage] = useState(() =>
    parseCurrentPage(searchParams.get('page')),
  );
  const [debouncedSearch] = useDebounce(search.trim(), 300);

  useEffect(() => {
    const nextSearch = searchParams.get('search') ?? '';
    const nextPage = parseCurrentPage(searchParams.get('page'));

    setSearch((previousValue) =>
      previousValue === nextSearch ? previousValue : nextSearch,
    );
    setCurrentPage((previousValue) =>
      previousValue === nextPage ? previousValue : nextPage,
    );
  }, [searchParams]);

  useEffect(() => {
    const params = new URLSearchParams();

    if (debouncedSearch) {
      params.set('search', debouncedSearch);
    }

    if (currentPage > 1) {
      params.set('page', String(currentPage));
    }

    const nextQuery = params.toString();
    const currentQuery = searchParams.toString();

    if (nextQuery === currentQuery) {
      return;
    }

    const nextUrl = nextQuery ? `${pathname}?${nextQuery}` : pathname;

    router.replace(nextUrl, {
      scroll: false,
    });
  }, [currentPage, debouncedSearch, pathname, router, searchParams]);

  const normalizedTag = tag.toLowerCase() === 'all' ? undefined : tag;

  const notesQuery = useQuery({
    queryKey: ['filtered-notes', tag, currentPage, debouncedSearch],
    queryFn: () =>
      fetchNotes({
        page: currentPage,
        perPage: 12,
        search: debouncedSearch,
        tag: normalizedTag,
      }),
    placeholderData: (previousData) => previousData,
  });

  return (
    <div className={css.app}>
      <div className={css.toolbar}>
        <SearchBox
          value={search}
          onChange={(nextValue) => {
            setSearch(nextValue);
            setCurrentPage(1);
          }}
        />
        <Link href="/notes/action/create" className={css.button}>
          Create note +
        </Link>
      </div>

      {notesQuery.isLoading ? <p>Loading notes...</p> : null}

      {notesQuery.isError ? <p>{getErrorMessage(notesQuery.error)}</p> : null}

      {notesQuery.data ? (
        <>
          {notesQuery.data.notes.length > 0 ? (
            <>
              <NoteList
                notes={notesQuery.data.notes}
                onNoteDeleted={() => {
                  void queryClient.invalidateQueries({
                    queryKey: ['filtered-notes', tag],
                  });
                }}
              />
              <Pagination
                currentPage={notesQuery.data.page ?? currentPage}
                totalPages={notesQuery.data.totalPages}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </>
          ) : (
            <p>{`No notes found for the ${tag} filter.`}</p>
          )}
        </>
      ) : null}
    </div>
  );
}
