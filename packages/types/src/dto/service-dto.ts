export interface AddServiceRequest {
  name: string;
  price: number;
  durationMin: number;
  isActive: boolean;
}

export interface ServiceResponse {
  id: string;
  salonId: string;
  categoryId: string;
  name: string;
  price: number;
  durationMin: number;
  isActive: boolean;
}
