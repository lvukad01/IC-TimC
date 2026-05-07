import { RegisterRequest } from '@lumii/types';

export interface CreateUserInput extends RegisterRequest {
  lat: number;
  lng: number;
}
