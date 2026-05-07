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
