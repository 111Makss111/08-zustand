import type { Metadata } from 'next';

export const APP_NAME = 'NoteHub';
export const APP_DESCRIPTION =
  'NoteHub helps you create, browse, filter, and keep track of your notes in one place.';
export const OG_IMAGE_URL =
  'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg';
export const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? 'https://08-zustand.vercel.app';

export type MetadataWithUrl = Metadata & {
  url: string;
};

export function buildPageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): MetadataWithUrl {
  const url = new URL(path, SITE_URL).toString();

  return {
    title,
    description,
    url,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: APP_NAME,
      type: 'website',
      images: [
        {
          url: OG_IMAGE_URL,
          width: 1200,
          height: 630,
          alt: `${APP_NAME} Open Graph image`,
        },
      ],
    },
  };
}

export function createNoteExcerpt(content: string, maxLength = 150): string {
  if (content.length <= maxLength) {
    return content;
  }

  return `${content.slice(0, maxLength).trim()}...`;
}
