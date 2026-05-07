import { MediaType, SalonListResponse } from '@lumii/types';

export class SalonListResponseDto implements SalonListResponse {
  id: string;
  name: string;
  city: string;
  profileImageUrl?: string;
}

export class SalonDetailResponseDto implements SalonListResponse {
  id: string;
  name: string;
  city: string;
  street: string;
  zipcode: string;
  country: string;
  media: {
    id: string;
    type: MediaType;
    sortOrder: number;
    url: string;
  }[];
}
