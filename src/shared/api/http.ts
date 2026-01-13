export type HttpResponse<T> = {
  data: T;
  status: number;
  headers: Headers;
};

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

type RequestOptions = {
  method?: HttpMethod;
  body?: string;
};

export const BASE_URL = 'http://localhost:3000';

export async function request<T>(
  url: string,
  options: RequestOptions = {},
): Promise<HttpResponse<T>> {
  const response = await fetch(`${BASE_URL}${url}`, {
    method: options.method ?? 'GET',
    body: options.body,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(
      `HTTP error: ${response.status.toString()} ${response.statusText}`,
    );
  }

  const contentType = response.headers.get('Content-Type');
  const hasJson =
    contentType !== null && contentType.includes('application/json');

  const data = hasJson ? ((await response.json()) as T) : (undefined as T);

  return {
    data,
    status: response.status,
    headers: response.headers,
  };
}
