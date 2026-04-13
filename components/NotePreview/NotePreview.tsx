import Link from 'next/link';

import type { Note } from '@/types/note';

import css from './NotePreview.module.css';

interface NotePreviewProps {
  note: Note;
  backHref?: string | null;
  backLabel?: string;
}

function formatNoteDate(value?: string) {
  if (!value) {
    return null;
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  return parsedDate.toLocaleString('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export default function NotePreview({
  note,
  backHref = '/notes',
  backLabel = 'Back to notes',
}: NotePreviewProps) {
  const formattedDate = formatNoteDate(note.updatedAt ?? note.createdAt);

  return (
    <div className={css.container}>
      <article className={css.item}>
        {backHref ? (
          <Link href={backHref} className={css.backBtn}>
            {backLabel}
          </Link>
        ) : null}

        <div className={css.header}>
          <h2>{note.title}</h2>
          <span className={css.tag}>{note.tag}</span>
        </div>

        <p className={css.content}>{note.content}</p>

        {formattedDate ? (
          <p className={css.date}>Updated: {formattedDate}</p>
        ) : null}
      </article>
    </div>
  );
}
