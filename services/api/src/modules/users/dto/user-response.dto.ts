import { UserResponse } from '@lumii/types';

export class UserResponseDto implements UserResponse {
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
