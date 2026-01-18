import type { CreateCarDto } from '@/entities';

export type CarListProps = {
  onEdit: (id: number, dto: CreateCarDto) => void;
  onDelete: (id: number) => void;
  onStart: (id: number) => void;
  onStop: (id: number) => void;
};
