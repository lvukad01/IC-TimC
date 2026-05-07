export interface UpdateUserPayload {
  firstName?: string;
  lastName?: string;
  phone?: string;
  lat?: number;
  lng?: number;
}

export interface UserResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: string;
}

export interface UserResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: string;
  street: string;
  city: string;
  zipcode: string;
  country: string;
}
