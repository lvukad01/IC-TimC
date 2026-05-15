import type { SalonCategory } from '@lumii/types';

export interface SalonCardData {
  id: string;
  profileImage: string;
  name: string;
  rating: number;
  categories: SalonCategory[];
  address: string;
  isFavorite: boolean;
}
