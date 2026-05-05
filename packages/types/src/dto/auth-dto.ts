import { UserRole } from '@enums/enum';

export interface AccessToken {
  access_token: string;
}

export interface RegisterRequest {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  phone: string;
  role: UserRole;
}
