import { apiClient } from '@/lib/api/client';

export async function deleteNote(id: string) {
  await apiClient.delete(`/notes/${id}`);
}
