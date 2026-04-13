import type { Metadata } from 'next';
import Link from 'next/link';

import { buildPageMetadata } from '@/lib/metadata';

import css from './Home.module.css';

export const metadata: Metadata = buildPageMetadata({
  title: 'Page not found',
  description:
    'The requested NoteHub page does not exist. Please return to the homepage or the notes list.',
  path: '/not-found',
});

export default function NotFoundPage() {
  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Page not found</h1>
        <p className={css.description}>
          The page you are looking for does not exist in NoteHub.
        </p>
        <p className={css.description}>
          Go back to <Link href="/">home</Link> or open your{' '}
          <Link href="/notes">notes</Link>.
        </p>
      </div>
    </main>
  );
}
