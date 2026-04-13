import Link from 'next/link';

import { noteTags } from '@/types/note';

import css from './SidebarNotes.module.css';

export default function SidebarNotes() {
  return (
    <ul className={css.menuList}>
      <li className={css.menuItem}>
        <Link href="/notes" className={css.menuLink}>
          All notes
        </Link>
      </li>

      {noteTags.map((tag) => (
        <li key={tag} className={css.menuItem}>
          <Link
            href={`/notes/filter/${encodeURIComponent(tag.toLowerCase())}`}
            className={css.menuLink}
          >
            {tag}
          </Link>
        </li>
      ))}
    </ul>
  );
}
