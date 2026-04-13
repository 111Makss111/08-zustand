import SidebarNotes from '@/components/SidebarNotes/SidebarNotes';

import css from './LayoutNotes.module.css';

export default function NotesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={css.container}>
      <aside className={css.sidebar}>
        <SidebarNotes />
      </aside>
      <div className={css.notesWrapper}>{children}</div>
    </div>
  );
}
