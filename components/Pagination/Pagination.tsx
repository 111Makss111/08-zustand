import Link from 'next/link';

import css from './Pagination.module.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pathname?: string;
  search?: string;
  onPageChange?: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  pathname,
  search = '',
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  const createPageHref = (page: number) => {
    if (!pathname) {
      return '#';
    }

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
          {onPageChange ? (
            <button type="button" onClick={() => onPageChange(page)}>
              {page}
            </button>
          ) : (
            <Link href={createPageHref(page)} scroll={false}>
              {page}
            </Link>
          )}
        </li>
      ))}
    </ul>
  );
}
