import { apiClient } from '@/lib/api/client';
import { unwrapNote } from '@/lib/api/noteMappers';
import type { NewNote } from '@/types/note';

export async function createNote(note: NewNote) {
  const response = await apiClient.post('/notes', note);

  return unwrapNote(response.data);
}
