import axios, { AxiosHeaders } from 'axios';

const apiBaseUrl =
  process.env.NEXT_PUBLIC_NOTEHUB_API_URL ??
  'https://notehub-public.goit.study/api';

function getApiToken() {
  return (
    process.env.NEXT_PUBLIC_NOTEHUB_API_TOKEN ??
    process.env.NOTEHUB_API_TOKEN ??
    ''
  );
}

export const apiClient = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = getApiToken();

  if (!token) {
    return config;
  }

  if (config.headers && typeof config.headers.set === 'function') {
    config.headers.set('Authorization', `Bearer ${token}`);
    return config;
  }

  config.headers = AxiosHeaders.from(config.headers);
  config.headers.set('Authorization', `Bearer ${token}`);

  return config;
});

export function getErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    const apiMessage =
      typeof error.response?.data?.message === 'string'
        ? error.response.data.message
        : null;

    return apiMessage ?? error.message;
  }

  return 'Something went wrong while talking to the NoteHub API.';
}

export function isNotFoundError(error: unknown) {
  return axios.isAxiosError(error) && error.response?.status === 404;
}
