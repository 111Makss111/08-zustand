'use client';

interface FilterNotesErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function FilterNotesError({
  error,
  reset,
}: FilterNotesErrorProps) {
  return (
    <main style={{ padding: '24px' }}>
      <p>We could not load filtered notes right now.</p>
      <p>{error.message}</p>
      <button type="button" onClick={reset}>
        Try again
      </button>
    </main>
  );
}
