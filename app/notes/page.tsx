import { buildPageMetadata } from '@/lib/metadata';

import NotesClient from './NotesClient';

export const metadata = buildPageMetadata({
  title: 'All notes',
  description:
    'Browse every note in NoteHub, search through titles and content, and manage your collection.',
  path: '/notes',
});

type NotesPageProps = {
  searchParams: Promise<{
    page?: string;
    search?: string;
  }>;
};

export default async function NotesPage({ searchParams }: NotesPageProps) {
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams.page ?? '1');
  const currentPage = Number.isFinite(page) && page > 0 ? page : 1;
  const search = resolvedSearchParams.search?.trim() ?? '';

  return <NotesClient currentPage={currentPage} search={search} />;
}
