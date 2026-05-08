export interface AddServiceRequest {
  name: string;
  price: number;
  duration_min: number;
  is_active: boolean;
}

export interface ServiceResponse {
  id: string;
  salon_id: string;
  category_id: string;
  name: string;
  price: number;
  duration_min: number;
  is_active: boolean;
}
