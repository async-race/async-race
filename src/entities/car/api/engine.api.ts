import { request } from '@/shared/api/http';
import { endpoints } from '@/shared/api/endpoints';
import type {
  CarId,
  EngineStatus,
  EngineStartResponse,
  EngineDriveResponse,
} from '../model/types';

function engineQuery(id: CarId, status: EngineStatus): string {
  const query = new URLSearchParams({
    id: id.toString(),
    status,
  });

  return `${endpoints.engine}?${query.toString()}`;
}

export function startEngine(id: CarId): Promise<{ data: EngineStartResponse }> {
  return request<EngineStartResponse>(engineQuery(id, 'started'), {
    method: 'PATCH',
  });
}

export function stopEngine(id: CarId): Promise<void> {
  return request(engineQuery(id, 'stopped'), {
    method: 'PATCH',
  }).then(() => {});
}

export function driveEngine(id: CarId): Promise<{ data: EngineDriveResponse }> {
  return request<EngineDriveResponse>(engineQuery(id, 'drive'), {
    method: 'PATCH',
  });
}
