import { DepositType, MediaType, SalonCategory } from '@enums/enum';
import { PaginationQuery } from './common-dto';

export interface CreateSalonRequest {
  name: string;
  street: string;
  city: string;
  zipcode: string;
  country: string;
  categories: SalonCategory;
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
  street: string;
  profileImageKey?: string;
  avgRating: number;
  isFavorite?: boolean;
}

export interface SalonDetailResponse {
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

export interface FindSalonsQuery extends PaginationQuery {
  search?: string;
  city?: string;
  category?: SalonCategory;
  radiusMeters?: number;
  lat?: number;
  lng?: number;
  page: number;
  limit: number;
  date?: string;
  serviceId?: string;
}

export interface AddCategoriesRequest {
  categories: SalonCategory;
}
