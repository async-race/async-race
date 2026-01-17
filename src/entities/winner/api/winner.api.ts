import { request } from '@/shared/api/http';
import { endpoints } from '@/shared/api/endpoints';
import type {
  Winner,
  WinnerId,
  CreateWinnerDto,
  UpdateWinnerDto,
  WinnersQuery,
} from '../model/types';

export async function getWinners(parameters?: WinnersQuery): Promise<{
  items: Winner[];
  total: number;
}> {
  const query = new URLSearchParams();

  if (parameters?.page !== undefined) {
    query.set('_page', parameters.page.toString());
  }

  if (parameters?.limit !== undefined) {
    query.set('_limit', parameters.limit.toString());
  }

  if (parameters?.sort !== undefined) {
    query.set('_sort', parameters.sort);
  }

  if (parameters?.order !== undefined) {
    query.set('_order', parameters.order);
  }

  const response = await request<Winner[]>(
    `${endpoints.winners}?${query.toString()}`,
  );

  const total = Number(response.headers.get('X-Total-Count') ?? '0');

  return {
    items: response.data,
    total,
  };
}

export function getWinner(id: WinnerId): Promise<{ data: Winner }> {
  return request<Winner>(`${endpoints.winners}/${String(id)}`);
}

export function createWinner(dto: CreateWinnerDto): Promise<{ data: Winner }> {
  return request<Winner>(endpoints.winners, {
    method: 'POST',
    body: JSON.stringify(dto),
  });
}

export function deleteWinner(id: WinnerId): Promise<void> {
  return request(`${endpoints.winners}/${String(id)}`, {
    method: 'DELETE',
  }).then(() => {});
}

export function updateWinner(
  id: WinnerId,
  dto: UpdateWinnerDto,
): Promise<{ data: Winner }> {
  return request<Winner>(`${endpoints.winners}/${String(id)}`, {
    method: 'PUT',
    body: JSON.stringify(dto),
  });
}
