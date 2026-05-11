import { UserRole } from '@enums/enum';

export interface AccessToken {
  accessToken: string;
}

export interface RegisterRequest {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  phone: string;
  role: UserRole;
  street: string;
  city: string;
  zipcode: string;
  country: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface MeResponse {
  id: string;
  email: string;
  role: UserRole;
}
