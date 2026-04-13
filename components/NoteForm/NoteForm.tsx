'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';

import { createNote } from '@/lib/api/createNote';
import { getErrorMessage } from '@/lib/api/client';
import { initialDraft, useNoteStore } from '@/lib/store/noteStore';
import { noteTags, type NoteDraft } from '@/types/note';

import css from './NoteForm.module.css';

function SubmitButton({
  action,
}: {
  action: (formData: FormData) => Promise<void>;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      formAction={action}
      className={css.submitButton}
      disabled={pending}
    >
      {pending ? 'Creating...' : 'Create'}
    </button>
  );
}

export default function NoteForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const draft = useNoteStore((state) => state.draft);
  const setDraft = useNoteStore((state) => state.setDraft);
  const clearDraft = useNoteStore((state) => state.clearDraft);
  const [hydrated, setHydrated] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const markPending = () => setHydrated(false);
    const markHydrated = () => setHydrated(true);

    markHydrated();

    const unsubscribeHydrate = useNoteStore.persist.onHydrate(markPending);
    const unsubscribeFinish =
      useNoteStore.persist.onFinishHydration(markHydrated);

    return () => {
      unsubscribeHydrate();
      unsubscribeFinish();
    };
  }, []);

  const values = hydrated ? draft : initialDraft;

  const navigateBack = () => {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push('/notes');
  };

  const handleFieldChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = event.target;

    setDraft({
      [name]: value,
    } as Partial<NoteDraft>);

    if (error) {
      setError('');
    }
  };

  const handleCreate = async (formData: FormData) => {
    const title = String(formData.get('title') ?? '').trim();
    const content = String(formData.get('content') ?? '').trim();
    const tag = String(formData.get('tag') ?? initialDraft.tag);

    if (!title || !content) {
      setError('Please fill in both the title and content fields.');
      return;
    }

    try {
      setError('');
      await createNote({
        title,
        content,
        tag,
      });
      clearDraft();
      await queryClient.invalidateQueries({
        queryKey: ['notes'],
      });
      navigateBack();
    } catch (submitError) {
      setError(getErrorMessage(submitError));
    }
  };

  return (
    <form className={css.form}>
      <label className={css.formGroup}>
        Title
        <input
          type="text"
          name="title"
          className={css.input}
          value={values.title}
          onChange={handleFieldChange}
        />
      </label>

      <label className={css.formGroup}>
        Content
        <textarea
          name="content"
          rows={6}
          className={css.textarea}
          value={values.content}
          onChange={handleFieldChange}
        />
      </label>

      <label className={css.formGroup}>
        Tag
        <select
          name="tag"
          className={css.select}
          value={values.tag}
          onChange={handleFieldChange}
        >
          {noteTags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </label>

      {error ? <p className={css.error}>{error}</p> : null}

      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelButton}
          onClick={navigateBack}
        >
          Cancel
        </button>
        <SubmitButton action={handleCreate} />
      </div>
    </form>
  );
}
