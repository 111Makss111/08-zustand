import Link from 'next/link';

import NotesClient from './Notes.client';
import SearchBox from '@/components/SearchBox/SearchBox';
import { getErrorMessage } from '@/lib/api/client';
import { fetchNotes } from '@/lib/api/fetchNotes';
import { buildPageMetadata } from '@/lib/metadata';
import { noteTags } from '@/types/note';

import css from '@/app/notes/NotesPage.module.css';

type FilterPageProps = {
  params: Promise<{
    slug: string[];
  }>;
  searchParams: Promise<{
    page?: string;
    search?: string;
  }>;
};

function resolveTag(slug: string[]) {
  const segment = decodeURIComponent(slug.at(-1) ?? 'all');
  const matchedTag = noteTags.find(
    (tag) => tag.toLowerCase() === segment.toLowerCase(),
  );

  return matchedTag ?? segment;
}

export async function generateMetadata({ params }: FilterPageProps) {
  const { slug } = await params;
  const tag = resolveTag(slug);

  return buildPageMetadata({
    title: `Filtered notes: ${tag}`,
    description: `Browse NoteHub notes filtered by the ${tag} category.`,
    path: `/notes/filter/${slug.join('/')}`,
  });
}

export default async function FilteredNotesPage({
  params,
  searchParams,
}: FilterPageProps) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  const tag = resolveTag(slug);
  const page = Number(resolvedSearchParams.page ?? '1');
  const currentPage = Number.isFinite(page) && page > 0 ? page : 1;
  const search = resolvedSearchParams.search?.trim() ?? '';

  try {
    const data = await fetchNotes({
      page: currentPage,
      perPage: 12,
      search,
      tag: tag.toLowerCase() === 'all' ? undefined : tag,
    });

    return (
      <NotesClient
        data={data}
        currentPage={currentPage}
        pathname={`/notes/filter/${slug.join('/')}`}
        search={search}
        tag={tag}
      />
    );
  } catch (error) {
    return (
      <div className={css.app}>
        <div className={css.toolbar}>
          <SearchBox initialValue={search} />
          <Link href="/notes/action/create" className={css.button}>
            Create note +
          </Link>
        </div>
        <p>{getErrorMessage(error)}</p>
      </div>
    );
  }
}
