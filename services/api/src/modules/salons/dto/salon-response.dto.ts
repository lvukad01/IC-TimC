import {
  MediaType,
  SalonDetailResponse,
  SalonListResponse,
} from '@lumii/types';

export class SalonListResponseDto implements SalonListResponse {
  id: string;
  name: string;
  city: string;
  street: string;
  profileImageKey?: string;
  avgRating: number;
  isFavorite?: boolean;
}

export class SalonDetailResponseDto implements SalonDetailResponse {
  id: string;
  name: string;
  city: string;
  street: string;
  zipcode: string;
  country: string;
  isFavorite?: boolean;
  media: {
    id: string;
    type: MediaType;
    sortOrder: number;
    key: string;
  }[];
}
