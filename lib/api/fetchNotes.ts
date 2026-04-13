import { apiClient } from '@/lib/api/client';
import { normalizeNotesResponse } from '@/lib/api/noteMappers';
import type { FetchNotesParams } from '@/types/note';

export async function fetchNotes(params: FetchNotesParams = {}) {
  const response = await apiClient.get('/notes', {
    params: {
      page: params.page ?? 1,
      perPage: params.perPage ?? 12,
      ...(params.search
        ? {
            search: params.search,
            query: params.search,
          }
        : {}),
      ...(params.tag
        ? {
            tag: params.tag,
            category: params.tag,
          }
        : {}),
    },
  });

  return normalizeNotesResponse(response.data, params);
}
