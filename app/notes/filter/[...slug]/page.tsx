import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';

import NotesClient from './Notes.client';
import { buildPageMetadata } from '@/lib/metadata';
import { noteTags } from '@/types/note';

import css from '@/app/notes/NotesPage.module.css';

type FilterPageProps = {
  params: Promise<{
    slug: string[];
  }>;
};

function resolveTag(slug: string[]) {
  const segment = decodeURIComponent(slug.at(-1) ?? 'all');
  const matchedTag = noteTags.find(
    (tag) => tag.toLowerCase() === segment.toLowerCase(),
  );

  return matchedTag ?? segment;
}

export async function generateMetadata({
  params,
}: FilterPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tag = resolveTag(slug);

  return buildPageMetadata({
    title: `Filtered notes: ${tag}`,
    description: `Browse NoteHub notes filtered by the ${tag} category.`,
    path: `/notes/filter/${slug.join('/')}`,
  });
}

export default async function FilteredNotesPage({ params }: FilterPageProps) {
  const { slug } = await params;
  const tag = resolveTag(slug);

  return (
    <Suspense
      fallback={
        <div className={css.app}>
          <div className={css.toolbar}>
            <span>Loading notes...</span>
            <Link href="/notes/action/create" className={css.button}>
              Create note +
            </Link>
          </div>
        </div>
      }
    >
      <NotesClient tag={tag} />
    </Suspense>
  );
}
