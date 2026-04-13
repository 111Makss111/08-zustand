import Link from 'next/link';

import css from './Pagination.module.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pathname: string;
  search?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  pathname,
  search = '',
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  const createPageHref = (page: number) => {
    const params = new URLSearchParams();

    if (search) {
      params.set('search', search);
    }

    if (page <= 1) {
      params.delete('page');
    } else {
      params.set('page', String(page));
    }

    const query = params.toString();

    return query ? `${pathname}?${query}` : pathname;
  };

  return (
    <ul className={css.pagination}>
      {pages.map((page) => (
        <li key={page} className={page === currentPage ? css.active : ''}>
          <Link href={createPageHref(page)} scroll={false}>
            {page}
          </Link>
        </li>
      ))}
    </ul>
  );
}
