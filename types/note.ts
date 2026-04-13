export const noteTags = [
  'Todo',
  'Work',
  'Personal',
  'Meeting',
  'Shopping',
] as const;

export type NoteTag = (typeof noteTags)[number];

export interface Note {
  id: string;
  title: string;
  content: string;
  tag: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface NewNote {
  title: string;
  content: string;
  tag: string;
}

export interface NoteDraft extends NewNote {}

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: string;
}

export interface NotesResponse {
  notes: Note[];
  page: number;
  perPage: number;
  totalPages: number;
  totalItems: number;
}
