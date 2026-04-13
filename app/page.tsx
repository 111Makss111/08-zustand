import Link from 'next/link';

import { buildPageMetadata } from '@/lib/metadata';

import css from './Home.module.css';

export const metadata = buildPageMetadata({
  title: 'Home',
  description:
    'Welcome to NoteHub, a simple app for creating, filtering, and revisiting your notes.',
  path: '/',
});

export default function HomePage() {
  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>NoteHub</h1>
        <p className={css.description}>
          Keep all of your thoughts in one place with convenient note creation,
          filtering, search, and quick previews.
        </p>
        <p className={css.description}>
          Open the <Link href="/notes">notes page</Link> to browse your
          collection or create a new note.
        </p>
      </div>
    </main>
  );
}
