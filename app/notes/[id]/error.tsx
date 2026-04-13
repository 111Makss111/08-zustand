'use client';

interface NoteDetailsErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function NoteDetailsError({
  error,
  reset,
}: NoteDetailsErrorProps) {
  return (
    <main style={{ padding: '24px' }}>
      <p>We could not load this note right now.</p>
      <p>{error.message}</p>
      <button type="button" onClick={reset}>
        Try again
      </button>
    </main>
  );
}
