import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { request, BASE_URL } from './http';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('http.ts', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should use GET method by default', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      Response.json(
        { ok: true },
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        },
      ),
    );

    await request('/test');

    expect(fetchMock).toHaveBeenCalledWith(
      `${BASE_URL}/test`,
      expect.objectContaining({
        method: 'GET',
      }),
    );
  });

  it('should pass method and body to fetch', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      Response.json(
        { id: 1 },
        {
          status: 201,
          headers: { 'Content-Type': 'application/json' },
        },
      ),
    );

    const body = JSON.stringify({ name: 'Car' });

    await request('/cars', {
      method: 'POST',
      body,
    });

    expect(fetchMock).toHaveBeenCalledWith(
      `${BASE_URL}/cars`,
      expect.objectContaining({
        method: 'POST',
        body,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    );
  });

  it('should return parsed JSON data when content-type is application/json', async () => {
    const responseData = { id: 1, name: 'BMW' };

    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      Response.json(responseData, {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    const response = await request<typeof responseData>('/cars/1');

    expect(response.data).toEqual(responseData);
    expect(response.status).toBe(200);
    expect(response.headers).toBeInstanceOf(Headers);
  });

  it('should return undefined data when response is not JSON', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(undefined, {
        status: 204,
        headers: { 'Content-Type': 'text/plain' },
      }),
    );

    const response = await request('/cars/1');

    expect(response.data).toBeUndefined();
    expect(response.status).toBe(204);
  });

  it('should throw error when response is not ok', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response('Not found', {
        status: 404,
        statusText: 'Not Found',
      }),
    );

    await expect(request('/wrong-url')).rejects.toThrow(
      'HTTP error: 404 Not Found',
    );
  });
});
