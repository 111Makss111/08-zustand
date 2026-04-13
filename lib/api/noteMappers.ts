import type { FetchNotesParams, Note, NotesResponse } from '@/types/note';

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === 'object' && value !== null;
}

function getString(value: unknown, fallback = '') {
  if (typeof value === 'string') {
    return value;
  }

  if (typeof value === 'number') {
    return String(value);
  }

  return fallback;
}

function getNumber(value: unknown, fallback: number) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const parsed = Number(value);

    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return fallback;
}

function getNestedRecord(source: UnknownRecord, key: string) {
  const value = source[key];

  return isRecord(value) ? value : null;
}

export function normalizeNote(payload: unknown): Note {
  const source = isRecord(payload) ? payload : {};

  return {
    id: getString(source.id ?? source._id ?? source.noteId),
    title: getString(source.title ?? source.name),
    content: getString(source.content ?? source.description ?? source.text),
    tag: getString(source.tag ?? source.category, 'Todo'),
    createdAt: getString(source.createdAt ?? source.created_at),
    updatedAt: getString(source.updatedAt ?? source.updated_at),
  };
}

export function unwrapNote(payload: unknown) {
  if (isRecord(payload)) {
    if (isRecord(payload.note)) {
      return normalizeNote(payload.note);
    }

    if (isRecord(payload.data)) {
      return normalizeNote(payload.data);
    }
  }

  return normalizeNote(payload);
}

export function normalizeNotesResponse(
  payload: unknown,
  params: FetchNotesParams = {},
): NotesResponse {
  const source = isRecord(payload) ? payload : {};
  const dataRecord = getNestedRecord(source, 'data');
  const metaRecord = getNestedRecord(source, 'meta');
  const paginationRecord =
    getNestedRecord(source, 'pagination') ??
    (dataRecord ? getNestedRecord(dataRecord, 'pagination') : null);

  const notesRaw = Array.isArray(payload)
    ? payload
    : Array.isArray(source.notes)
      ? source.notes
      : Array.isArray(source.items)
        ? source.items
        : Array.isArray(source.results)
          ? source.results
          : dataRecord && Array.isArray(dataRecord.notes)
            ? dataRecord.notes
            : dataRecord && Array.isArray(dataRecord.items)
              ? dataRecord.items
              : [];

  const page =
    getNumber(source.page, 0) ||
    getNumber(metaRecord?.page, 0) ||
    getNumber(paginationRecord?.page, 0) ||
    params.page ||
    1;

  const perPage =
    getNumber(source.perPage, 0) ||
    getNumber(source.per_page, 0) ||
    getNumber(metaRecord?.perPage, 0) ||
    getNumber(paginationRecord?.perPage, 0) ||
    params.perPage ||
    notesRaw.length ||
    12;

  const totalPages =
    getNumber(source.totalPages, 0) ||
    getNumber(source.total_pages, 0) ||
    getNumber(source.pages, 0) ||
    getNumber(metaRecord?.totalPages, 0) ||
    getNumber(paginationRecord?.totalPages, 0) ||
    1;

  const totalItems =
    getNumber(source.total, 0) ||
    getNumber(source.totalItems, 0) ||
    getNumber(source.total_items, 0) ||
    getNumber(metaRecord?.total, 0) ||
    getNumber(metaRecord?.totalItems, 0) ||
    notesRaw.length;

  return {
    notes: notesRaw.map(normalizeNote).filter((note) => note.id),
    page,
    perPage,
    totalPages,
    totalItems,
  };
}
