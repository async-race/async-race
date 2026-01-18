import { request } from '@/shared/api/http';
import { endpoints } from '@/shared/api/endpoints';
import type {
  Car,
  CarId,
  CarsQuery,
  CreateCarDto,
  UpdateCarDto,
} from '../model/types';

export async function getCars(parameters?: CarsQuery): Promise<{
  items: Car[];
  total: number;
}> {
  const query = new URLSearchParams();

  if (parameters?.page !== undefined) {
    query.set('_page', parameters.page.toString());
  }

  if (parameters?.limit !== undefined) {
    query.set('_limit', parameters.limit.toString());
  }

  const response = await request<Car[]>(
    `${endpoints.garage}?${query.toString()}`,
  );

  const total = Number(response.headers.get('X-Total-Count') ?? '0');

  return {
    items: response.data,
    total,
  };
}

export function getCar(id: CarId): Promise<{ data: Car }> {
  return request<Car>(`${endpoints.garage}/${String(id)}`);
}

export function createCar(dto: CreateCarDto): Promise<{ data: Car }> {
  return request<Car>(endpoints.garage, {
    method: 'POST',
    body: JSON.stringify(dto),
  });
}

export function deleteCar(id: CarId): Promise<void> {
  return request(`${endpoints.garage}/${String(id)}`, {
    method: 'DELETE',
  }).then(() => {});
}

export function updateCar(
  id: CarId,
  dto: UpdateCarDto,
): Promise<{ data: Car }> {
  return request<Car>(`${endpoints.garage}/${String(id)}`, {
    method: 'PUT',
    body: JSON.stringify(dto),
  });
}
