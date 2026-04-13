'use client';

import { useDeferredValue, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import css from './SearchBox.module.css';

interface SearchBoxProps {
  initialValue?: string;
}

export default function SearchBox({ initialValue = '' }: SearchBoxProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [value, setValue] = useState(initialValue);
  const deferredValue = useDeferredValue(value);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const normalizedValue = deferredValue.trim();

    if (normalizedValue === initialValue) {
      return;
    }

    const params = new URLSearchParams();

    if (normalizedValue) {
      params.set('search', normalizedValue);
    }

    const nextUrl = params.toString() ? `${pathname}?${params}` : pathname;

    router.replace(nextUrl, {
      scroll: false,
    });
  }, [deferredValue, initialValue, pathname, router]);

  return (
    <input
      type="text"
      className={css.input}
      placeholder="Search notes"
      value={value}
      onChange={(event) => setValue(event.target.value)}
    />
  );
}
