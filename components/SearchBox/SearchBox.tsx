'use client';

import { useDeferredValue, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import css from './SearchBox.module.css';

interface SearchBoxProps {
  initialValue?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export default function SearchBox({
  initialValue = '',
  value,
  onChange,
}: SearchBoxProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isControlled =
    typeof value === 'string' && typeof onChange === 'function';
  const [internalValue, setInternalValue] = useState(initialValue);
  const deferredValue = useDeferredValue(internalValue);
  const resolvedValue = isControlled ? value : internalValue;

  useEffect(() => {
    if (isControlled) {
      return;
    }

    setInternalValue(initialValue);
  }, [initialValue, isControlled]);

  useEffect(() => {
    if (isControlled) {
      return;
    }

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
  }, [deferredValue, initialValue, isControlled, pathname, router]);

  return (
    <input
      type="text"
      className={css.input}
      placeholder="Search notes"
      value={resolvedValue}
      onChange={(event) => {
        if (isControlled) {
          onChange(event.target.value);
          return;
        }

        setInternalValue(event.target.value);
      }}
    />
  );
}
