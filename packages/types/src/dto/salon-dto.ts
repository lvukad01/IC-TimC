import { DepositType, MediaType, SalonCategory } from '@enums/enum';

export interface CreateSalonRequest {
  name: string;
  street: string;
  city: string;
  zipcode: string;
  country: string;
  categories: string[];
  lat?: number;
  lng?: number;
}

export interface UpdateSalonRequest {
  name?: string;
  city?: string;
  street?: string;
  zipcode?: string;
  country?: string;
  lat?: number;
  lng?: number;
}

export interface UploadMediaRequest {
  type: MediaType;
  sortOrder: number;
}

export interface CreatePaymentConfigRequest {
  depositType: DepositType;
  depositValue: number;
}

export interface UpdatePaymentConfigRequest {
  depositType?: DepositType;
  depositValue?: number;
}

export interface SalonListResponse {
  id: string;
  name: string;
  city: string;
  profileImageUrl?: string;
}

export interface SalonDetailResponse {
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

export interface FindSalonsQuery {
  search?: string;
  city?: string;
  category?: SalonCategory;
  radiusMeters?: number;
  lat?: number;
  lng?: number;
  page: number;
  limit: number;
}
