import Link from 'next/link';

import css from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={css.footer}>
      <div className={css.wrap}>
        <span>NoteHub homework project</span>
        <Link href="https://nextjs.org" target="_blank" rel="noreferrer">
          Next.js
        </Link>
        <Link href="https://vercel.com" target="_blank" rel="noreferrer">
          Vercel
        </Link>
      </div>
    </footer>
  );
}
