import { apiClient } from '@/lib/api/client';
import { unwrapNote } from '@/lib/api/noteMappers';

export async function fetchNoteById(id: string) {
  const response = await apiClient.get(`/notes/${id}`);

  return unwrapNote(response.data);
}
